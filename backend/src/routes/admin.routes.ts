// Admin API — every route requires login AND the ADMIN role (checked on the server,
// from the database, on every request). Learners get 403 ADMIN_ONLY.
//
// Content      GET    /api/admin/languages                        languages + counts
//              POST   /api/admin/languages                        create (hidden until published)
//              PATCH  /api/admin/languages/:code                  edit
//              POST   /api/admin/languages/:code/publish          { published }
//              DELETE /api/admin/languages/:code?force=true
//              GET    /api/admin/content?language=te              courses → units → lessons tree
//              POST   /api/admin/courses · units · lessons        create (start unpublished)
//              PATCH  /api/admin/{courses|units|lessons}/:id      edit
//              POST   /api/admin/{courses|units|lessons}/:id/publish   { published }
//              POST   /api/admin/{units|lessons|exercises}/:id/move    { direction: up|down }
//              DELETE /api/admin/{courses|units|lessons|exercises}/:id?force=true
//              GET    /api/admin/lessons/:id                      lesson + exercises WITH answers
//              POST   /api/admin/exercises · PUT /api/admin/exercises/:id
//              GET    /api/admin/vocabulary?language=te&search=   · POST · PATCH /:id · DELETE /:id
// Knowledge    GET    /api/admin/knowledge?language=&origin=&status=
//              GET    /api/admin/knowledge/:id(*)                 document + chunks
//              POST   /api/admin/knowledge                        new admin note (draft)
//              PATCH  /api/admin/knowledge/:id                    edit admin note
//              GET    /api/admin/knowledge/:id/preview            chunks it would produce (dry run)
//              POST   /api/admin/knowledge/:id/publish            { published }
//              POST   /api/admin/knowledge/:id/reindex            re-index one document
//              POST   /api/admin/knowledge-reindex                re-index everything that changed
//              DELETE /api/admin/knowledge/:id
// Analytics    GET    /api/admin/analytics?days=30&language=te
// Audit        GET    /api/admin/audit-log
//
// Knowledge ids contain slashes (e.g. "admin/te/at-the-station"), so they are sent URL-encoded.
import { Router, type Request } from "express";
import { getUserId, requireAdmin, requireAuth } from "../middleware/auth.ts";
import { RateLimiter, rateLimitByUser } from "../middleware/rate-limit.ts";
import {
  analyticsQuerySchema,
  courseCreateSchema,
  courseUpdateSchema,
  exerciseCreateSchema,
  exerciseSchema,
  forceQuerySchema,
  knowledgeCreateSchema,
  knowledgeListQuerySchema,
  knowledgeUpdateSchema,
  languageCreateSchema,
  languageQuerySchema,
  languageUpdateSchema,
  lessonCreateSchema,
  lessonUpdateSchema,
  moveSchema,
  publishSchema,
  unitCreateSchema,
  unitUpdateSchema,
  vocabularyCreateSchema,
  vocabularySchema,
} from "../schemas/admin.schemas.ts";
import { getAnalytics } from "../services/admin/analytics.service.ts";
import * as content from "../services/admin/content.service.ts";
import * as knowledge from "../services/admin/knowledge.service.ts";

export const adminRouter = Router();

const adminLimiter = new RateLimiter([{ name: "minute", limit: 300, windowMs: 60_000 }]);

adminRouter.use(requireAuth, requireAdmin, rateLimitByUser(adminLimiter, "admin"));

const id = (req: Request) => String(req.params.id);
const force = (req: Request) => forceQuerySchema.parse(req.query).force === "true";

// Languages
adminRouter.get("/languages", async (_req, res) => {
  res.json({ languages: await content.listLanguages() });
});
adminRouter.post("/languages", async (req, res) => {
  res.status(201).json({
    language: await content.createLanguage(getUserId(req), languageCreateSchema.parse(req.body)),
  });
});
adminRouter.patch("/languages/:id", async (req, res) => {
  res.json({
    language: await content.updateLanguage(
      getUserId(req),
      id(req),
      languageUpdateSchema.parse(req.body),
    ),
  });
});
adminRouter.post("/languages/:id/publish", async (req, res) => {
  const { published } = publishSchema.parse(req.body);
  res.json(await content.setLanguageActive(getUserId(req), id(req), published));
});
adminRouter.delete("/languages/:id", async (req, res) => {
  await content.deleteLanguage(getUserId(req), id(req), force(req));
  res.json({ message: "Language deleted" });
});

// Content tree
adminRouter.get("/content", async (req, res) => {
  const { language } = languageQuerySchema.parse(req.query);
  res.json(await content.getContentTree(language));
});

// Courses / units / lessons
adminRouter.post("/courses", async (req, res) => {
  const { languageCode, ...input } = courseCreateSchema.parse(req.body);
  res.status(201).json({ course: await content.createCourse(getUserId(req), languageCode, input) });
});
adminRouter.patch("/courses/:id", async (req, res) => {
  res.json({
    course: await content.updateCourse(getUserId(req), id(req), courseUpdateSchema.parse(req.body)),
  });
});
adminRouter.delete("/courses/:id", async (req, res) => {
  await content.deleteCourse(getUserId(req), id(req), force(req));
  res.json({ message: "Course deleted" });
});

adminRouter.post("/units", async (req, res) => {
  const { courseId, ...input } = unitCreateSchema.parse(req.body);
  res.status(201).json({ unit: await content.createUnit(getUserId(req), courseId, input) });
});
adminRouter.patch("/units/:id", async (req, res) => {
  res.json({
    unit: await content.updateUnit(getUserId(req), id(req), unitUpdateSchema.parse(req.body)),
  });
});
adminRouter.delete("/units/:id", async (req, res) => {
  await content.deleteUnit(getUserId(req), id(req), force(req));
  res.json({ message: "Unit deleted" });
});

adminRouter.get("/lessons/:id", async (req, res) => {
  res.json({ lesson: await content.getLessonForEditing(id(req)) });
});
adminRouter.post("/lessons", async (req, res) => {
  const { unitId, ...input } = lessonCreateSchema.parse(req.body);
  res.status(201).json({ lesson: await content.createLesson(getUserId(req), unitId, input) });
});
adminRouter.patch("/lessons/:id", async (req, res) => {
  res.json({
    lesson: await content.updateLesson(getUserId(req), id(req), lessonUpdateSchema.parse(req.body)),
  });
});
adminRouter.delete("/lessons/:id", async (req, res) => {
  await content.deleteLesson(getUserId(req), id(req), force(req));
  res.json({ message: "Lesson deleted" });
});

for (const type of ["course", "unit", "lesson"] as const) {
  adminRouter.post(`/${type}s/:id/publish`, async (req, res) => {
    const { published } = publishSchema.parse(req.body);
    res.json(await content.setPublished(getUserId(req), type, id(req), published));
  });
}
for (const type of ["unit", "lesson", "exercise"] as const) {
  adminRouter.post(`/${type}s/:id/move`, async (req, res) => {
    const { direction } = moveSchema.parse(req.body);
    res.json(await content.move(getUserId(req), type, id(req), direction));
  });
}

// Exercises
adminRouter.post("/exercises", async (req, res) => {
  const { lessonId, ...input } = exerciseCreateSchema.parse(req.body);
  res.status(201).json({ exercise: await content.createExercise(getUserId(req), lessonId, input) });
});
adminRouter.put("/exercises/:id", async (req, res) => {
  res.json({
    exercise: await content.updateExercise(getUserId(req), id(req), exerciseSchema.parse(req.body)),
  });
});
adminRouter.delete("/exercises/:id", async (req, res) => {
  await content.deleteExercise(getUserId(req), id(req), force(req));
  res.json({ message: "Exercise deleted" });
});

// Vocabulary
adminRouter.get("/vocabulary", async (req, res) => {
  const { language, search } = languageQuerySchema.parse(req.query);
  res.json({ vocabulary: await content.listVocabulary(language, search) });
});
adminRouter.post("/vocabulary", async (req, res) => {
  const { languageCode, ...input } = vocabularyCreateSchema.parse(req.body);
  res
    .status(201)
    .json({ item: await content.createVocabulary(getUserId(req), languageCode, input) });
});
adminRouter.patch("/vocabulary/:id", async (req, res) => {
  res.json({
    item: await content.updateVocabulary(
      getUserId(req),
      id(req),
      vocabularySchema.partial().parse(req.body),
    ),
  });
});
adminRouter.delete("/vocabulary/:id", async (req, res) => {
  await content.deleteVocabulary(getUserId(req), id(req));
  res.json({ message: "Word deleted" });
});

// Knowledge base (RAG)
adminRouter.get("/knowledge", async (req, res) => {
  res.json(await knowledge.listDocuments(knowledgeListQuerySchema.parse(req.query)));
});
adminRouter.post("/knowledge", async (req, res) => {
  const { languageCode, ...input } = knowledgeCreateSchema.parse(req.body);
  res
    .status(201)
    .json({ document: await knowledge.createDocument(getUserId(req), languageCode, input) });
});
adminRouter.post("/knowledge-reindex", async (req, res) => {
  res.json({ report: await knowledge.reindexAll(getUserId(req)) });
});
adminRouter.get("/knowledge/:id/preview", async (req, res) => {
  res.json(await knowledge.previewDocument(id(req)));
});
adminRouter.post("/knowledge/:id/publish", async (req, res) => {
  const { published } = publishSchema.parse(req.body);
  res.json(await knowledge.setDocumentPublished(getUserId(req), id(req), published));
});
adminRouter.post("/knowledge/:id/reindex", async (req, res) => {
  res.json(await knowledge.reindexDocument(getUserId(req), id(req)));
});
adminRouter.get("/knowledge/:id", async (req, res) => {
  res.json({ document: await knowledge.getDocument(id(req)) });
});
adminRouter.patch("/knowledge/:id", async (req, res) => {
  res.json({
    document: await knowledge.updateDocument(
      getUserId(req),
      id(req),
      knowledgeUpdateSchema.parse(req.body),
    ),
  });
});
adminRouter.delete("/knowledge/:id", async (req, res) => {
  await knowledge.deleteDocument(getUserId(req), id(req));
  res.json({ message: "Document deleted" });
});

// Analytics & audit
adminRouter.get("/analytics", async (req, res) => {
  res.json(await getAnalytics(analyticsQuerySchema.parse(req.query)));
});
adminRouter.get("/audit-log", async (_req, res) => {
  res.json({ entries: await content.listAuditLog(100) });
});
