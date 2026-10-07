"use client";

// Plays a phrase using server text-to-speech (cached as a blob URL). When the server cannot
// make audio (TTS_PROVIDER=browser, missing key, quota used up) it falls back to the browser's
// own voice for the language, if the device has one. Slower speeds keep the original pitch.
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getSpeechAudio } from "@/lib/api/endpoints";

export type AudioSource =
  | { vocabularyItemId: string; text?: string; language?: string }
  | { question: string }
  | { text: string; language: string };

export type PlaybackState = "idle" | "loading" | "playing" | "error";

// Course language code to the locale used by browser voices.
const LOCALES: Record<string, string> = {
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  ml: "ml-IN",
  kn: "kn-IN",
  bn: "bn-IN",
};

// Module-level, so every player on the page shares the cache and only one clip plays at a time.
const blobUrls = new Map<string, string>();
let sharedAudio: HTMLAudioElement | null = null;

/** Cache key for an audio source. */
function keyOf(source: AudioSource): string {
  if ("question" in source) return `q:${source.question}`;
  if ("vocabularyItemId" in source) return `v:${source.vocabularyItemId}`;
  return `t:${source.language}:${source.text}`;
}

/** The request body for the server: only the fields that identify the audio. */
function toAudioRequest(source: AudioSource) {
  if ("question" in source) return { question: source.question };
  if ("vocabularyItemId" in source) return { vocabularyItemId: source.vocabularyItemId };
  return { text: source.text, language: source.language };
}

/** A browser voice for the language, if this device has one. */
function browserVoice(language: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const locale = LOCALES[language] ?? language;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === locale.toLowerCase()) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(`${language}-`)) ??
    null
  );
}

/** Server errors where the browser voice is a sensible fallback. */
const SERVER_AUDIO_UNAVAILABLE = new Set([
  "TTS_BROWSER_ONLY",
  "TTS_NOT_CONFIGURED",
  "LLM_RATE_LIMITED",
  "RATE_LIMITED",
  "LLM_UNAVAILABLE",
  "LLM_TIMEOUT",
  "LLM_FAILED",
  "LLM_MODEL_NOT_FOUND",
  "LLM_BAD_REQUEST",
  "LLM_AUTH_FAILED",
  "TIMEOUT",
]);

/** Hook that plays phrases and reports the playback state and any error message. */
export function usePhraseAudio() {
  const [state, setState] = useState<PlaybackState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [usedBrowserVoice, setUsedBrowserVoice] = useState(false);
  // Each play() gets a new number; an older request that finishes late is ignored.
  const latestRequest = useRef(0);

  // Stop any sound when the component using this hook unmounts.
  useEffect(
    () => () => {
      sharedAudio?.pause();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    },
    [],
  );

  // Returns false when the device has no voice for this language.
  const speakWithBrowser = useCallback((text: string, language: string, rate: number) => {
    const voice = browserVoice(language);
    if (!voice) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = rate;
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");
    setUsedBrowserVoice(true);
    setState("playing");
    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  const play = useCallback(
    async (source: AudioSource, rate = 1) => {
      const ticket = ++latestRequest.current;
      setMessage(null);
      sharedAudio?.pause();
      window.speechSynthesis?.cancel();
      const key = keyOf(source);
      let url = blobUrls.get(key);
      if (!url) {
        setState("loading");
        try {
          const blob = await getSpeechAudio(toAudioRequest(source));
          url = URL.createObjectURL(blob);
          blobUrls.set(key, url);
        } catch (error) {
          if (ticket !== latestRequest.current) return;
          const code = error instanceof ApiError ? error.code : "UNKNOWN";
          const text = "text" in source ? source.text : undefined;
          const language = "language" in source ? source.language : undefined;
          if (SERVER_AUDIO_UNAVAILABLE.has(code) && text && language) {
            if (speakWithBrowser(text, language, rate)) return;
          }
          setState("error");
          if (SERVER_AUDIO_UNAVAILABLE.has(code)) {
            setMessage(
              "Audio isn't available right now, and this device has no voice for this language. Read the romanization instead.",
            );
          } else {
            setMessage(error instanceof ApiError ? error.message : "Couldn't play the audio.");
          }
          return;
        }
      }
      if (ticket !== latestRequest.current) return;
      sharedAudio ??= new Audio();
      sharedAudio.src = url;
      sharedAudio.playbackRate = rate;
      sharedAudio.preservesPitch = true;
      sharedAudio.onended = () => setState("idle");
      sharedAudio.onerror = () => {
        setState("error");
        setMessage("This audio can't be played in your browser.");
      };
      setUsedBrowserVoice(false);
      setState("playing");
      try {
        await sharedAudio.play();
      } catch {
        setState("error");
        setMessage("The browser blocked playback. Click Play again.");
      }
    },
    [speakWithBrowser],
  );

  const stop = useCallback(() => {
    latestRequest.current++;
    sharedAudio?.pause();
    window.speechSynthesis?.cancel();
    setState("idle");
  }, []);

  return { state, message, usedBrowserVoice, play, stop };
}
