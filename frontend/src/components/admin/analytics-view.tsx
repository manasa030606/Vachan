"use client";

// /admin — learning analytics. Everything is an aggregate count or percentage: no names,
// e-mails or per-learner rows are sent to the browser (see backend/src/services/admin/analytics.service.ts).
import { Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { admin } from "@/lib/api/admin";
import { BarList, Field, Notice, Select, StatTile } from "./admin-ui";
import { useLoad } from "./use-load";

/** 42 → "42%", missing → "–" */
const pct = (value: number | null) => (value === null ? "–" : `${value}%`);
/** 1500 ms → "1.5 s", missing → "–" */
const seconds = (ms: number | null) => (ms === null ? "–" : `${(ms / 1000).toFixed(1)} s`);
/** "MULTIPLE_CHOICE" → "multiple choice" */
const readable = (value: string) => value.toLowerCase().replace(/_/g, " ");
/** "2026-10-07" → "7 Oct" in the admin's locale */
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" });

export function AnalyticsView() {
  const [days, setDays] = useState(30);
  const [language, setLanguage] = useState("");
  const languages = useLoad(() => admin.languages(), "languages");
  const { data, error, loading } = useLoad(
    () => admin.analytics(days, language || undefined),
    `${days}|${language}`,
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Field label="Period">
            {(id) => (
              <Select
                id={id}
                value={String(days)}
                onChange={(event) => setDays(Number(event.target.value))}
                options={[
                  { value: "7", label: "Last 7 days" },
                  { value: "30", label: "Last 30 days" },
                  { value: "90", label: "Last 90 days" },
                  { value: "365", label: "Last year" },
                ]}
              />
            )}
          </Field>
        </div>
        <div className="w-48">
          <Field label="Language">
            {(id) => (
              <Select
                id={id}
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                options={[
                  { value: "", label: "All languages" },
                  ...(languages.data?.languages ?? []).map((l) => ({
                    value: l.code,
                    label: l.name,
                  })),
                ]}
              />
            )}
          </Field>
        </div>
        {loading && (
          <Loader2 aria-label="Loading" className="mb-3 size-5 animate-spin text-brand-600" />
        )}
      </div>

      {error && <Notice>{error}</Notice>}

      {data && (
        <>
          <p className="flex items-start gap-2 text-sm text-slate-600">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            {data.privacy}
          </p>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="Active today"
              value={data.activeLearners.today}
              hint="learners who answered something"
            />
            <StatTile label="Active, last 7 days" value={data.activeLearners.last7Days} />
            <StatTile label="Active in this period" value={data.activeLearners.inWindow} />
            <StatTile
              label="Learners"
              value={data.learners.total}
              hint={`${data.learners.newInWindow} new in this period`}
            />
            <StatTile
              label="Lessons completed"
              value={data.lessons.completedInWindow}
              hint={`${data.lessons.startedInWindow} started`}
            />
            <StatTile
              label="Completion rate"
              value={pct(data.lessons.completionRate)}
              hint="completed ÷ started"
            />
            <StatTile
              label="Answer accuracy"
              value={pct(data.accuracy.percentCorrect)}
              hint={`${data.accuracy.answers} answers`}
            />
            <StatTile
              label="Average streak"
              value={data.streaks.averageCurrent}
              hint={`longest ever: ${data.streaks.longestEver} days`}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <BarList
                title="Active learners per day"
                rows={data.activeLearners.perDay.map((d) => ({
                  label: shortDate(d.date),
                  value: d.learners,
                }))}
              />
            </Card>
            <Card>
              <BarList
                title="Accuracy by exercise type"
                max={100}
                format={(v) => `${v}%`}
                rows={data.accuracy.byExerciseType.map((t) => ({
                  label: readable(t.type),
                  value: t.percentCorrect,
                  note: `${t.answers} answers`,
                }))}
              />
            </Card>
            <Card>
              <BarList
                title="Learners by language"
                rows={data.languages.map((l) => ({
                  label: `${l.name}${l.isActive ? "" : " (hidden)"}`,
                  value: l.learnersStudying,
                  note: `${l.activeLearnersInWindow} active, ${l.answersInWindow} answers`,
                }))}
              />
            </Card>
            <Card>
              <BarList
                title="Current streaks"
                rows={data.streaks.distribution.map((b) => ({ label: b.label, value: b.learners }))}
              />
            </Card>
          </div>

          <Card>
            <CardHeader
              title="Lesson drop-off"
              description={
                data.lessons.dropOff.course
                  ? `${data.lessons.dropOff.course}: learners who started each lesson but have not finished it.`
                  : "No lessons started in this period."
              }
            />
            {data.lessons.dropOff.lessons.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th scope="col" className="py-2 pr-3 font-bold">
                        Lesson
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-bold">
                        Started
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-bold">
                        Completed
                      </th>
                      <th scope="col" className="py-2 text-right font-bold">
                        Drop-off
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 tabular-nums">
                    {data.lessons.dropOff.lessons.map((l) => (
                      <tr key={l.lessonId}>
                        <td className="py-2 pr-3 text-ink">{l.label}</td>
                        <td className="py-2 pr-3 text-right">{l.started}</td>
                        <td className="py-2 pr-3 text-right">{l.completed}</td>
                        <td className="py-2 text-right font-bold text-ink">{pct(l.dropOffRate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <CardHeader
              title="Common mistakes"
              description="Exercises answered wrongly most often (at least 3 answers). Good candidates for a clearer explanation."
            />
            {data.commonMistakes.length === 0 ? (
              <p className="text-sm text-slate-500">Not enough answers yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-slate-500">
                    <tr>
                      <th scope="col" className="py-2 pr-3 font-bold">
                        Exercise
                      </th>
                      <th scope="col" className="py-2 pr-3 font-bold">
                        Lesson
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-bold">
                        Answers
                      </th>
                      <th scope="col" className="py-2 text-right font-bold">
                        Wrong
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.commonMistakes.map((m) => (
                      <tr key={m.exerciseId}>
                        <td className="py-2 pr-3">
                          <span className="font-bold text-ink">{m.prompt || "(no prompt)"}</span>
                          <span className="block text-xs text-slate-500">
                            {readable(m.type)} · {m.language}
                          </span>
                        </td>
                        <td className="py-2 pr-3 text-slate-700">{m.lesson}</td>
                        <td className="py-2 pr-3 text-right tabular-nums">{m.answers}</td>
                        <td className="py-2 text-right font-bold text-ink tabular-nums">
                          {pct(m.percentWrong)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="space-y-4">
              <CardHeader
                as="h3"
                title="AI Tutor usage"
                description="Questions asked in this period."
              />
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Questions" value={data.tutor.questions} />
                <StatTile label="Average answer time" value={seconds(data.tutor.averageAnswerMs)} />
              </div>
              <BarList
                title="Answers by outcome"
                rows={data.tutor.byStatus.map((s) => ({
                  label: readable(s.status),
                  value: s.answers,
                }))}
              />
            </Card>
            <Card className="space-y-4">
              <CardHeader
                as="h3"
                title="Speaking usage"
                description="Recordings and role-plays in this period."
              />
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Recordings" value={data.speaking.attempts} />
                <StatTile
                  label="Average content score"
                  value={pct(data.speaking.averageContentScore)}
                />
              </div>
              <BarList
                title="Recordings by result"
                rows={data.speaking.byVerdict.map((v) => ({
                  label: readable(v.verdict),
                  value: v.attempts,
                }))}
              />
              <BarList
                title="Role-play sessions by scenario"
                rows={data.speaking.conversations.map((c) => ({
                  label: c.scenario,
                  value: c.sessions,
                  note: `${c.ended} finished, ${c.avgReplies} replies on average`,
                }))}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
