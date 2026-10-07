"use client";

// Play / Replay / speed controls for a phrase. Every control has visible text (spec §8: audio
// controls need visible text/context), and the state is announced to screen readers.
import { Loader2, RotateCcw, Volume2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { usePhraseAudio, type AudioSource } from "./use-phrase-audio";

export const SPEEDS = [1, 0.75, 0.5] as const;
type Speed = (typeof SPEEDS)[number];

type PhraseAudioProps = {
  source: AudioSource;
  /** What is being played, for screen readers: "నమస్కారం (Hello)". */
  label: string;
  /** Small "Listen" button only (lists, chat bubbles). */
  compact?: boolean;
  className?: string;
};

export function PhraseAudio({ source, label, compact = false, className }: PhraseAudioProps) {
  const audio = usePhraseAudio();
  const [speed, setSpeed] = useState<Speed>(1);
  const [played, setPlayed] = useState(false);
  const busy = audio.state === "loading";

  const play = (rate: Speed = speed) => {
    setPlayed(true);
    void audio.play(source, rate);
  };

  if (compact) {
    return (
      <span className={cn("inline-flex flex-col items-start", className)}>
        <button
          type="button"
          onClick={() => play()}
          disabled={busy}
          aria-label={`Listen: ${label}`}
          className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-extrabold text-brand-700 transition hover:bg-brand-100 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          ) : (
            <Volume2 aria-hidden="true" className="size-3.5" />
          )}
          Listen
        </button>
        {audio.state === "error" && audio.message && (
          <span role="status" className="mt-1 max-w-56 text-xs text-rose-700">
            {audio.message}
          </span>
        )}
      </span>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => play()}
          disabled={busy}
          aria-label={`Play: ${label}`}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-brand-600 px-5 font-extrabold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 active:scale-[0.97] disabled:bg-brand-300"
        >
          {busy ? (
            <Loader2 aria-hidden="true" className="size-5 animate-spin" />
          ) : (
            <Volume2 aria-hidden="true" className="size-5" />
          )}
          {busy ? "Loading…" : audio.state === "playing" ? "Playing…" : "Play"}
        </button>
        {played && (
          <button
            type="button"
            onClick={() => play()}
            disabled={busy}
            aria-label={`Replay: ${label}`}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-4 font-extrabold text-brand-700 ring-2 ring-brand-100 transition ring-inset hover:bg-brand-50"
          >
            <RotateCcw aria-hidden="true" className="size-4" /> Replay
          </button>
        )}
        <div
          role="group"
          aria-label="Playback speed"
          className="flex rounded-full bg-slate-100 p-1"
        >
          {SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={speed === value}
              onClick={() => {
                setSpeed(value);
                if (played) play(value);
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-extrabold transition",
                speed === value
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-slate-500 hover:text-ink",
              )}
            >
              {value === 1 ? "1×" : `${value}×`}
              <span className="sr-only">{value === 1 ? " normal speed" : " slower"}</span>
            </button>
          ))}
        </div>
      </div>
      <p
        role="status"
        className={cn(
          "min-h-5 text-sm",
          audio.state === "error" ? "font-bold text-rose-700" : "text-slate-500",
        )}
      >
        {audio.state === "error"
          ? audio.message
          : audio.usedBrowserVoice && audio.state === "playing"
            ? "Playing with your browser's voice (server audio unavailable)."
            : speed !== 1
              ? `Slow mode: ${speed}× speed.`
              : ""}
      </p>
    </div>
  );
}
