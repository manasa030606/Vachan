# Vachan knowledge base (RAG)

Curated language-learning notes that the retrieval system and the AI tutor use as **grounding**. The tutor may only explain what is written here or in the course content — it must not invent grammar rules.

```
knowledge-base/
  README.md          ← this file (the format)
  hi/ te/ ta/ ml/ kn/ bn/
    alphabet.md        script, vowels, consonants, vowel signs, conjuncts
    pronunciation.md   sounds that are hard for beginners
    phrases.md         greetings and everyday phrases
    vocabulary.md      family, food, numbers, colours, time words
    grammar.md         word order, pronouns, case endings, questions, negation…
    verbs.md           "to be", present / past / future forms, polite commands
    examples.md        example sentences with a word-by-word breakdown
    idioms.md          common sayings with meaning and usage
    culture.md         forms of address, etiquette, festivals, the language itself
    beginner-guide.md  how to start, how romanization works, study tips
    sentence-patterns.md  reusable patterns: I want ___, I like ___, Where is ___?, Do you have ___?…
    questions.md       question words and how questions are built
    requests.md        please, help, wait, say it again, polite commands
    emotions.md        feelings and relationships (I love you, I miss you, sorry, take care…)
    food.md            hungry/thirsty, ordering, taste, the bill
    travel.md          transport, tickets, directions, the bathroom
    shopping.md        prices, bargaining, sizes, paying
    college.md         college and work
    numbers-time.md    numbers, age, time, days, months
    everyday-life.md   daily routine, home, weather, phone, invitations
    common-mistakes.md mistakes English speakers make, and words that are easy to confuse
    dialogues.md       GENERATED from the course — edit prisma/content/languages/<code>.ts, then
                       run `npm run content:dialogues -w backend`
```

The course itself (words and phrases in the `VocabularyItem` table, with their usage notes) is
indexed too, as `source: Vachan course content` — no file needed.

Phrase sections end with an `Also asked as:` line listing other ways a learner might ask for the
same thing ("how can I tell someone I love them", "what's I love you in Telugu"). This is how the
search finds a note when the question is worded differently — prefer it to changing the search code.

## File format

```markdown
---
language: te
title: Telugu greetings and common phrases
type: phrase
level: beginner
skill: conversation
topic: greetings
source: Vachan curated notes
---

# Telugu greetings and common phrases

## Hello — నమస్కారం (namaskaaram)

Text of the section…

## How are you? — మీరు ఎలా ఉన్నారు? (meeru elaa unnaaru?)

<!-- topic: everyday-phrases; level: elementary -->

Text…
```

- **Front matter** sets the defaults for every section in the file.
- **One `##` section = one concept = one chunk.** Keep sections self-contained (40–180 words) and name the language and the concept in the text, because a chunk is read on its own.
- A section can override metadata with an HTML comment right under its heading: `<!-- topic: pronouns; level: elementary; type: grammar; skill: grammar -->`.
- `###` sub-headings and paragraphs stay inside their section. Very long sections are split automatically (at `###`, then at paragraphs).
- Write native script + simple romanization (doubled vowels for long sounds: `aa`, `ee`, `oo`) + English meaning, like the course does.

## Metadata values

| Key      | Allowed values                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------ |
| language | `hi` `te` `ta` `ml` `kn` `bn`                                                                                            |
| type     | `alphabet` `pronunciation` `vocabulary` `grammar` `example` `phrase` `verb-form` `idiom` `culture` `explanation`         |
| level    | `beginner` (script, first words) · `elementary` (simple sentences) · `intermediate` (tenses, idioms, nuance)             |
| skill    | `script` `pronunciation` `vocabulary` `grammar` `conversation` `culture`                                                 |
| topic    | a short lowercase slug, e.g. `greetings`, `vowels`, `pronouns`, `past-tense` (see the existing files for the usual ones) |
| source   | where the text comes from, e.g. `Vachan curated notes`                                                                   |

## After editing

```bash
npm run rag:index -w backend   # re-index (only changed documents are re-embedded)
npm run rag:eval -w backend    # check retrieval quality still passes
```
