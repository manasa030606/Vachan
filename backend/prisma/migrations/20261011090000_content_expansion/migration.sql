-- Content expansion: usage notes for vocabulary (polite/casual forms, gender, alternatives).
-- Additive only: existing rows keep working (notes is optional).
ALTER TABLE "VocabularyItem" ADD COLUMN "notes" TEXT;
