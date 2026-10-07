"use client";

// Records the learner's voice in the browser and returns a 16 kHz mono WAV.
//
// Why not MediaRecorder? It produces WebM/Ogg/MP4 depending on the browser, which the server
// would need ffmpeg to measure. Here an AudioWorklet copies the raw samples instead, and
// lib/audio/wav.ts writes a small WAV — the same format from every browser.
//
// Microphone problems are turned into clear, fixable messages (denied, no microphone, in use,
// not a secure page, old browser).
import { useCallback, useEffect, useRef, useState } from "react";
import { level as levelOf, toUploadWav } from "@/lib/audio/wav";

export type RecorderError =
  "denied" | "no-microphone" | "busy" | "insecure" | "unsupported" | "too-short" | "failed";

export const RECORDER_MESSAGES: Record<RecorderError, string> = {
  denied:
    "Microphone access is blocked. Click the lock or microphone icon in the address bar, allow the microphone for this site, then try again.",
  "no-microphone":
    "No microphone was found. Connect one (or check your sound settings) and try again.",
  busy: "Your microphone is being used by another app. Close it and try again.",
  insecure:
    "The microphone only works on a secure page (https:// or localhost). Open Vachan from a secure address.",
  unsupported:
    "This browser can't record audio. Use a recent Chrome, Edge, Firefox or Safari — or upload a recording instead.",
  "too-short": "That was too short — hold on a moment longer and say the whole phrase.",
  failed: "Recording failed. Please try again.",
};

export type Recording = { blob: Blob; durationMs: number };

type State = "idle" | "starting" | "recording" | "error";

// The worklet runs on the audio thread and posts each block of samples (128 at a time) to us.
const WORKLET = `class VachanRecorder extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel) this.port.postMessage(channel.slice(0));
    return true;
  }
}
registerProcessor("vachan-recorder", VachanRecorder);`;

function errorFrom(error: unknown): RecorderError {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") return "denied";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "no-microphone";
  if (name === "NotReadableError" || name === "AbortError") return "busy";
  return "failed";
}

export function useRecorder({ maxDurationMs = 15_000, minDurationMs = 400 } = {}) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<RecorderError | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [inputLevel, setInputLevel] = useState(0);

  const parts = useRef<{
    stream: MediaStream;
    context: AudioContext;
    chunks: Float32Array[];
    startedAt: number;
    timer: number;
    resolve: ((recording: Recording | null) => void) | null;
  } | null>(null);

  const cleanup = useCallback(() => {
    const current = parts.current;
    if (!current) return;
    window.clearInterval(current.timer);
    current.stream.getTracks().forEach((track) => track.stop());
    void current.context.close().catch(() => undefined);
    parts.current = null;
    setInputLevel(0);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  /** Stops recording. Returns the WAV, or null if it was too short. */
  const stop = useCallback((): Recording | null => {
    const current = parts.current;
    if (!current) return null;
    const { chunks, context } = current;
    const sampleRate = context.sampleRate;
    cleanup();
    const wav = toUploadWav(chunks, sampleRate);
    if (wav.durationMs < minDurationMs) {
      setError("too-short");
      setState("error");
      current.resolve?.(null);
      return null;
    }
    setState("idle");
    const recording = {
      blob: new Blob([wav.bytes], { type: "audio/wav" }),
      durationMs: wav.durationMs,
    };
    current.resolve?.(recording);
    return recording;
  }, [cleanup, minDurationMs]);

  /**
   * Starts recording. The returned promise resolves when recording stops — by stop(), or
   * automatically after maxDurationMs.
   */
  const start = useCallback(async (): Promise<Recording | null> => {
    if (parts.current) return null;
    setError(null);
    setElapsedMs(0);
    if (typeof window === "undefined" || !window.isSecureContext) {
      setError("insecure");
      setState("error");
      return null;
    }
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setError("unsupported");
      setState("error");
      return null;
    }
    setState("starting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (cause) {
      setError(errorFrom(cause));
      setState("error");
      return null;
    }

    const context = new AudioContext();
    const chunks: Float32Array[] = [];
    try {
      const source = context.createMediaStreamSource(stream);
      const silent = context.createGain();
      silent.gain.value = 0; // keeps the graph running without playing the voice back
      silent.connect(context.destination);
      let lastLevelUpdate = 0;
      const onSamples = (samples: Float32Array) => {
        chunks.push(samples);
        const now = performance.now();
        if (now - lastLevelUpdate > 80) {
          lastLevelUpdate = now;
          setInputLevel(levelOf(samples));
        }
      };
      if (context.audioWorklet) {
        const url = URL.createObjectURL(new Blob([WORKLET], { type: "application/javascript" }));
        await context.audioWorklet.addModule(url);
        URL.revokeObjectURL(url);
        const node = new AudioWorkletNode(context, "vachan-recorder");
        node.port.onmessage = (event: MessageEvent<Float32Array>) => onSamples(event.data);
        source.connect(node);
        node.connect(silent);
      } else {
        // Older browsers: the deprecated ScriptProcessorNode does the same job.
        const processor = context.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (event) =>
          onSamples(new Float32Array(event.inputBuffer.getChannelData(0)));
        source.connect(processor);
        processor.connect(silent);
      }
      if (context.state === "suspended") await context.resume();
    } catch {
      stream.getTracks().forEach((track) => track.stop());
      void context.close();
      setError("unsupported");
      setState("error");
      return null;
    }

    return new Promise<Recording | null>((resolve) => {
      const startedAt = performance.now();
      const timer = window.setInterval(() => {
        const elapsed = performance.now() - startedAt;
        setElapsedMs(elapsed);
        if (elapsed >= maxDurationMs) stop();
      }, 100);
      parts.current = { stream, context, chunks, startedAt, timer, resolve };
      // If the microphone is unplugged mid-recording, stop with what we have.
      stream.getAudioTracks()[0]?.addEventListener("ended", () => stop());
      setState("recording");
    });
  }, [maxDurationMs, stop]);

  /** Stops without returning anything (e.g. the learner left the page). */
  const cancel = useCallback(() => {
    const current = parts.current;
    cleanup();
    current?.resolve?.(null);
    setState("idle");
  }, [cleanup]);

  const reset = useCallback(() => {
    setError(null);
    setState("idle");
  }, []);

  return {
    state,
    isRecording: state === "recording",
    error,
    errorMessage: error ? RECORDER_MESSAGES[error] : null,
    elapsedMs,
    inputLevel,
    maxDurationMs,
    start,
    stop,
    cancel,
    reset,
  };
}
