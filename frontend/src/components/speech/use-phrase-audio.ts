"use client";

// Plays a phrase: server text-to-speech (cached as a blob URL), or — when the server can't
// make audio (TTS_PROVIDER=browser, missing key, quota used up) — the browser's own voice for
// the language, if the device has one. Speed: 1×, 0.75×, 0.5× (pitch is kept).
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getSpeechAudio } from "@/lib/api/endpoints";

export type AudioSource =
  | { vocabularyItemId: string; text?: string; language?: string }
  | { question: string }
  | { text: string; language: string };

export type PlaybackState = "idle" | "loading" | "playing" | "error";

const LOCALES: Record<string, string> = {
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  ml: "ml-IN",
  kn: "kn-IN",
  bn: "bn-IN",
};

const blobUrls = new Map<string, string>(); // shared by every player on the page
let shared: HTMLAudioElement | null = null;

const keyOf = (source: AudioSource) =>
  "question" in source
    ? `q:${source.question}`
    : "vocabularyItemId" in source
      ? `v:${source.vocabularyItemId}`
      : `t:${source.language}:${source.text}`;

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

export function usePhraseAudio() {
  const [state, setState] = useState<PlaybackState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [usedBrowserVoice, setUsedBrowserVoice] = useState(false);
  const active = useRef(0);

  useEffect(
    () => () => {
      shared?.pause();
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    },
    [],
  );

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
      const ticket = ++active.current;
      setMessage(null);
      shared?.pause();
      window.speechSynthesis?.cancel();
      const key = keyOf(source);
      let url = blobUrls.get(key);
      if (!url) {
        setState("loading");
        try {
          const blob = await getSpeechAudio(
            "question" in source
              ? { question: source.question }
              : "vocabularyItemId" in source
                ? { vocabularyItemId: source.vocabularyItemId }
                : { text: source.text, language: source.language },
          );
          url = URL.createObjectURL(blob);
          blobUrls.set(key, url);
        } catch (error) {
          if (ticket !== active.current) return;
          const code = error instanceof ApiError ? error.code : "UNKNOWN";
          const text = "text" in source ? source.text : undefined;
          const language = "language" in source ? source.language : undefined;
          if (SERVER_AUDIO_UNAVAILABLE.has(code) && text && language) {
            if (speakWithBrowser(text, language, rate)) return;
          }
          setState("error");
          setMessage(
            code === "TTS_BROWSER_ONLY" || SERVER_AUDIO_UNAVAILABLE.has(code)
              ? "Audio isn't available right now, and this device has no voice for this language. Read the romanization instead."
              : error instanceof ApiError
                ? error.message
                : "Couldn't play the audio.",
          );
          return;
        }
      }
      if (ticket !== active.current) return;
      shared ??= new Audio();
      shared.src = url;
      shared.playbackRate = rate;
      shared.preservesPitch = true;
      shared.onended = () => setState("idle");
      shared.onerror = () => {
        setState("error");
        setMessage("This audio can't be played in your browser.");
      };
      setUsedBrowserVoice(false);
      setState("playing");
      try {
        await shared.play();
      } catch {
        setState("error");
        setMessage("The browser blocked playback. Click Play again.");
      }
    },
    [speakWithBrowser],
  );

  const stop = useCallback(() => {
    active.current++;
    shared?.pause();
    window.speechSynthesis?.cancel();
    setState("idle");
  }, []);

  return { state, message, usedBrowserVoice, play, stop };
}
