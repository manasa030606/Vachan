"use client";

// Learner settings. Phase 1: saved in the browser only. Phase 2 saves them via PATCH /api/me.
import { useId } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DAILY_GOALS, type DailyGoalId } from "@/data/onboarding-options";
import {
  resetPreferences,
  updatePreferences,
  useLearnerPreferences,
} from "@/lib/learner-preferences";

const selectClasses =
  "h-11 w-full rounded-2xl border-2 border-slate-200 bg-white px-3 font-bold text-ink outline-none focus:border-brand-400 disabled:bg-slate-50 disabled:text-slate-500";

export function SettingsCard() {
  const preferences = useLearnerPreferences();
  const router = useRouter();
  const dailyGoalId = useId();
  const interfaceLanguageId = useId();

  function handleLogout() {
    resetPreferences();
    router.push("/");
  }

  return (
    <Card>
      <CardHeader title="Settings" description="Changes are saved on this device (demo mode)." />

      <div className="divide-y divide-slate-100">
        <Switch
          label="Show romanization"
          description="Show pronunciation in Latin letters under Indian scripts"
          checked={preferences.showRomanization}
          onChange={(checked) => updatePreferences({ showRomanization: checked })}
        />
        <Switch
          label="Sound effects"
          description="Play sounds for correct and incorrect answers"
          checked={preferences.soundEffects}
          onChange={(checked) => updatePreferences({ soundEffects: checked })}
        />

        <div className="grid gap-4 py-4 sm:grid-cols-2">
          <div>
            <label htmlFor={dailyGoalId} className="mb-1.5 block font-bold">
              Daily goal
            </label>
            <select
              id={dailyGoalId}
              className={selectClasses}
              value={preferences.dailyGoalId}
              onChange={(event) =>
                updatePreferences({ dailyGoalId: event.target.value as DailyGoalId })
              }
            >
              {DAILY_GOALS.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.label} — {goal.xp} XP / day
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={interfaceLanguageId} className="mb-1.5 block font-bold">
              App language
            </label>
            <select id={interfaceLanguageId} className={selectClasses} disabled defaultValue="en">
              <option value="en">English</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">More interface languages are planned.</p>
          </div>
        </div>
      </div>

      <Button variant="secondary" onClick={handleLogout} className="mt-2">
        <LogOut aria-hidden="true" className="size-4" />
        Log out
      </Button>
    </Card>
  );
}
