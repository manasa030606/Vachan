// Step 4 of the pipeline: EMBEDDINGS.
//
// An embedding is a list of 384 numbers that represents the MEANING of a text. Texts with similar
// meaning get vectors that point in a similar direction, so "How do I say hello in Telugu?" lands
// close to the chunk about నమస్కారం even though they share almost no words.
//
// The model (multilingual-e5-small) runs locally through Transformers.js + ONNX Runtime:
//   - no API key and no per-request cost; the text never leaves the server
//   - first use downloads the model (~130 MB) into backend/.cache/models (or RAG_MODEL_DIR)
//   - it is loaded lazily, on the first RAG request, so the rest of the API is unaffected.
import { mkdirSync } from "node:fs";
import { env } from "../config/env.ts";
import { RAG_CONFIG, RAG_PATHS } from "./config.ts";

type Extractor = (
  texts: string[],
  options: { pooling: "mean"; normalize: boolean },
) => Promise<{ tolist(): number[][] }>;

let extractorPromise: Promise<Extractor> | null = null;

export class EmbeddingModelError extends Error {
  constructor(cause: unknown) {
    super(
      `The embedding model "${RAG_CONFIG.embedding.model}" could not be loaded: ${
        cause instanceof Error ? cause.message : String(cause)
      }. The first run needs internet access to download it (see docs/RAG.md → Troubleshooting).`,
    );
    this.name = "EmbeddingModelError";
  }
}

export const modelDirectory = () => env.RAG_MODEL_DIR ?? RAG_PATHS.defaultModelDir;

async function loadExtractor(): Promise<Extractor> {
  // Imported here (not at the top) so the API starts quickly and only RAG requests pay the cost.
  const transformers = await import("@huggingface/transformers");
  const directory = modelDirectory();
  mkdirSync(directory, { recursive: true });
  transformers.env.cacheDir = directory; // where downloads are saved
  transformers.env.localModelPath = directory; // look here first (works offline once downloaded)
  transformers.env.allowRemoteModels = env.RAG_ALLOW_DOWNLOAD === "true";

  const extractor = await transformers.pipeline("feature-extraction", RAG_CONFIG.embedding.model, {
    dtype: RAG_CONFIG.embedding.dtype,
  });
  return extractor as unknown as Extractor;
}

function getExtractor(): Promise<Extractor> {
  extractorPromise ??= loadExtractor().catch((error: unknown) => {
    extractorPromise = null; // allow a retry on the next request
    throw new EmbeddingModelError(error);
  });
  return extractorPromise;
}

async function embed(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor();
  const vectors: number[][] = [];
  const { batchSize, dimensions } = RAG_CONFIG.embedding;
  for (let start = 0; start < texts.length; start += batchSize) {
    // Mean pooling + L2 normalisation → cosine similarity is a simple dot product.
    const output = await extractor(texts.slice(start, start + batchSize), {
      pooling: "mean",
      normalize: true,
    });
    vectors.push(...output.tolist());
  }
  for (const vector of vectors) {
    if (vector.length !== dimensions) {
      throw new Error(`Expected ${dimensions}-dimension embeddings, got ${vector.length}`);
    }
  }
  return vectors;
}

/** Embeds knowledge-base chunks ("passage: …" as the e5 model card asks). */
export const embedPassages = (texts: string[]) =>
  embed(texts.map((text) => RAG_CONFIG.embedding.passagePrefix + text));

/** Embeds a learner question ("query: …"). */
export async function embedQuery(text: string): Promise<number[]> {
  const [vector] = await embed([RAG_CONFIG.embedding.queryPrefix + text]);
  return vector!;
}

/** True once the model has been loaded in this process (used by /api/rag/stats). */
export const isModelLoaded = async () => {
  if (!extractorPromise) return false;
  try {
    await extractorPromise;
    return true;
  } catch {
    return false;
  }
};
