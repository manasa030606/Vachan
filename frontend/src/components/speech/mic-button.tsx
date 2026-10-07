"use client";

// The microphone button: tap to start, tap again to stop (it also stops by itself at the time
// limit). While recording it shows a pulsing ring, a timer and a live input-level meter, so the
// learner can see the microphone is hearing them.
import { Mic, MicOff, Square } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Recording, useRecorder } from "./use-recorder";

type MicButtonProps = {
  recorder: ReturnType<typeof useRecorder>;
  onRecording: (recording: Recording) => void;
  disabled?: boolean;
  /** "Record" by default */
  idleLabel?: string;
  size?: "md" | "lg";
};

const seconds = (ms: number) => `0:${String(Math.floor(ms / 1000)).padStart(2, "0")}`;

export function MicButton({
  recorder,
  onRecording,
  disabled,
  idleLabel = "Record",
  size = "lg",
}: MicButtonProps) {
  const recording = recorder.isRecording;
  const starting = recorder.state === "starting";

  const toggle = async () => {
    if (recording) {
      recorder.stop();
      return;
    }
    const result = await recorder.start();
    if (result) onRecording(result);
  };

  const big = size === "lg";
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => void toggle()}
        disabled={(disabled && !recording) || starting}
        aria-pressed={recording}
        aria-label={recording ? "Stop recording" : idleLabel}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-extrabold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          big ? "size-20" : "size-12",
          recording
            ? "bg-rose-600 shadow-lg shadow-rose-600/30 hover:bg-rose-700"
            : "bg-brand-600 shadow-lg shadow-brand-600/25 hover:bg-brand-700",
        )}
      >
        {recording && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-ping rounded-full bg-rose-500/40 motion-reduce:hidden"
          />
        )}
        {recording ? (
          <Square aria-hidden="true" className={big ? "size-7" : "size-5"} fill="currentColor" />
        ) : recorder.error === "denied" ? (
          <MicOff aria-hidden="true" className={big ? "size-8" : "size-5"} />
        ) : (
          <Mic aria-hidden="true" className={big ? "size-8" : "size-5"} />
        )}
      </button>

      {/* Recording indicator: text + timer + level meter (not colour alone). */}
      <div aria-live="polite" className="flex min-h-6 items-center gap-2 text-sm font-bold">
        {recording ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-rose-700">
              <span
                aria-hidden="true"
                className="size-2.5 animate-pulse rounded-full bg-rose-600"
              />
              Recording {seconds(recorder.elapsedMs)} / {seconds(recorder.maxDurationMs)}
            </span>
            <span aria-hidden="true" className="flex h-5 items-end gap-0.5">
              {[0.15, 0.3, 0.45, 0.6, 0.75].map((threshold) => (
                <span
                  key={threshold}
                  className={cn(
                    "w-1.5 rounded-sm transition-all",
                    recorder.inputLevel >= threshold ? "bg-rose-500" : "bg-slate-200",
                  )}
                  style={{ height: `${8 + threshold * 16}px` }}
                />
              ))}
            </span>
          </>
        ) : starting ? (
          <span className="text-slate-500">Asking for the microphone…</span>
        ) : (
          <span className="text-slate-500">{big ? `${idleLabel} — tap again to stop` : ""}</span>
        )}
      </div>

      {recorder.errorMessage && !recording && (
        <p
          role="alert"
          className="max-w-sm rounded-2xl bg-rose-50 px-4 py-2 text-center text-sm font-bold text-rose-700"
        >
          {recorder.errorMessage}
        </p>
      )}
    </div>
  );
}
