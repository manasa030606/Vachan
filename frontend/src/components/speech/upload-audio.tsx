"use client";

// "Upload a recording" button for learners without a microphone (also handy for testing).
// The file is converted to 16 kHz mono WAV in the browser before it is sent.
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { AudioFileError, fileToUploadWav } from "@/lib/audio/convert";
import type { Recording } from "./use-recorder";

type UploadAudioProps = {
  onRecording: (recording: Recording) => void;
  maxDurationMs: number;
  disabled?: boolean;
};

export function UploadAudio({ onRecording, maxDurationMs, disabled }: UploadAudioProps) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const choose = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      onRecording(await fileToUploadWav(file, maxDurationMs));
    } catch (cause) {
      setError(cause instanceof AudioFileError ? cause.message : "This file can't be used.");
    } finally {
      setBusy(false);
      // Clear the input so choosing the same file again still fires onChange.
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        ref={input}
        type="file"
        accept="audio/*,.wav,.mp3,.m4a,.ogg,.webm"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => void choose(event.target.files?.[0])}
      />
      <button
        type="button"
        disabled={disabled || busy}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50 disabled:text-slate-400"
      >
        <Upload aria-hidden="true" className="size-4" />
        {busy ? "Reading the file…" : "or upload a recording"}
      </button>
      {error && (
        <p role="alert" className="text-sm font-bold text-rose-700">
          {error}
        </p>
      )}
    </div>
  );
}
