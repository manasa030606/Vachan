"use client";

// The supported languages from GET /api/languages, with their visual themes.
import { withTheme } from "@/data/languages";
import { getLanguages } from "@/lib/api/endpoints";
import { useApi } from "./use-api";

export function useLanguages() {
  const result = useApi(async () => (await getLanguages()).languages.map(withTheme), "languages");
  return { ...result, languages: result.data ?? [] };
}
