"use client";

// Learner settings, saved to the database with PATCH /api/me.
import { useId } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DAILY_GOALS, type DailyGoalId } from "@/data/onboarding-options";
import { useSession } from "@/components/session/session-provider";
import { useLearnerPreferences, useUpdatePreferences } from "@/lib/learner-preferences";

const selectClasses =
  "h-11 w-full rounded-2xl border-2 border-slate-200 bg-white px-3 font-bold text-ink outline-none focus:border-brand-400 disabled:bg-slate-50 disabled:text-slate-500";

/** Settings card on the profile page, plus the log-out button. */
export function SettingsCard() {
  const preferences = useLearnerPreferences();
  const dailyGoalId = useId();
  const interfaceLanguageId = useId();

  const updatePreferences = useUpdatePreferences();
  const { logout } = useSession();

  async function handleLogout() {
    // POST /api/auth/logout makes the old token invalid, then the app goes to "/".
    await logout();
  }

  return (
    <Card>
      <CardHeader title="Settings" description="Changes are saved to your account." />

      <div className="divide-y divide-slate-100">
        <Switch
          label="Show romanization"
          description="Show pronunciation in Latin letters under Indian scripts"
          checked={preferences.showRomanization}
          onChange={(checked) => void updatePreferences({ showRomanization: checked })}
        />
        <Switch
          label="Sound effects"
          description="Play sounds for correct and incorrect answers"
          checked={preferences.soundEffects}
          onChange={(checked) => void updatePreferences({ soundEffects: checked })}
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
                void updatePreferences({ dailyGoal: event.target.value as DailyGoalId })
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

      <Button variant="secondary" onClick={() => void handleLogout()} className="mt-2">
        <LogOut aria-hidden="true" className="size-4" />
        Log out
      </Button>
    </Card>
  );
}
