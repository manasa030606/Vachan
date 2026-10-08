# Admin dashboard

The admin dashboard (`/admin`) lets a content team manage everything learners see, without
changing code.

## Getting access

There is no sign-up for admins and no API to become one. An admin is created from a terminal that
can reach the database:

```bash
npm run admin:grant  -w backend -- you@example.com   # the account must exist (register first)
npm run admin:list   -w backend
npm run admin:revoke -w backend -- you@example.com
```

After reloading the app, an **Admin** link appears in the sidebar.

## Sections

| Tab            | What you can do                                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Analytics      | Active learners, lesson completion and drop-off, accuracy, common mistakes, language usage, streaks, AI tutor and speaking usage |
| Content        | Languages, courses, units and lessons: create, edit, reorder, publish, unpublish, delete                                         |
| Lesson editor  | Lesson details, the words it teaches, and its exercises with answers                                                             |
| Vocabulary     | Words, letters and phrases for each language                                                                                     |
| Knowledge base | The notes the AI tutor searches: write, preview, publish, re-index                                                               |
| Audit log      | The latest 100 changes: who did what and when                                                                                    |

## Publishing

A learner sees a lesson only when its **language, course, unit and the lesson itself** are all
published. Everything new starts unpublished, so a whole unit can be prepared before it goes live.

- A lesson needs at least one exercise before it can be published.
- Unpublishing hides content immediately but keeps learners' progress.

## Adding a lesson

1. **Content** → choose the language → **Add lesson** in a unit.
2. Pick the words it teaches (add new ones in **Vocabulary** first).
3. **Add exercise** → choose the type → fill in the prompt and options. The form shows problems
   while you type, and the server checks the same rules before saving.
4. **Publish lesson**.

## Safe deleting

- If learners already have progress in something, deleting it first shows a warning. You can
  unpublish it instead, or confirm **Delete anyway**.
- Exercises used by the placement test can't be deleted.

## Knowledge base

Notes come from three places:

| Source         | Where the text lives                                                 | What you can do here              |
| -------------- | -------------------------------------------------------------------- | --------------------------------- |
| Dashboard note | The database                                                         | Everything: edit, publish, delete |
| File           | `backend/knowledge-base/*.md`                                        | Publish, unpublish, re-index      |
| Course content | Generated from the course words and phrases (with their usage notes) | Publish, unpublish, re-index      |

Workflow: **write** (saved as a draft, never searched) → **preview chunks** → **publish** (indexed and
searchable) → edit later → **re-index**.

Why it is safe:

- Text is checked before saving (it needs `## ` section headings).
- Re-indexing replaces a note's chunks in one database transaction, so the old version stays
  searchable until the new one is ready. If it fails, the error is shown and the old chunks are kept.
- Only one indexing job runs at a time.
- Unpublishing removes the chunks immediately.

## Analytics and privacy

Analytics only show totals and percentages, calculated from data the app already stores. No names,
emails or user ids are shown, and no extra tracking was added.
