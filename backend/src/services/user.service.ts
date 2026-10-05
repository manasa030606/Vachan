// Reading and updating the logged-in user's account and profile.
import type { DailyGoal, Prisma } from "../generated/prisma/client.ts";
import { HttpError, notFound } from "../lib/http-error.ts";
import { prisma } from "../lib/prisma.ts";
import type { UpdateMeInput } from "../schemas/me.schemas.ts";

const userWithProfile = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
  profile: {
    include: {
      currentLanguage: { select: { code: true, name: true, nativeName: true } },
    },
  },
} satisfies Prisma.UserSelect;

type UserWithProfile = Prisma.UserGetPayload<{ select: typeof userWithProfile }>;

/**
 * The public shape of a user. Notice what is NOT here: passwordHash and tokenVersion
 * never leave the server.
 */
export function toUserDto(user: UserWithProfile) {
  const profile = user.profile;
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    profile: profile
      ? {
          displayName: profile.displayName,
          currentLanguage: profile.currentLanguage,
          interfaceLanguage: profile.interfaceLanguage,
          learningGoal: profile.learningGoal,
          dailyGoal: profile.dailyGoal.toLowerCase(),
          selfAssessment: profile.selfAssessment,
          showRomanization: profile.showRomanization,
          soundEffects: profile.soundEffects,
          onboardingDone: profile.onboardingDone,
          timeZone: profile.timeZone,
        }
      : null,
  };
}

export type UserDto = ReturnType<typeof toUserDto>;

export async function getUserById(userId: string): Promise<UserDto> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: userWithProfile });
  if (!user) throw notFound("USER_NOT_FOUND", "User not found");
  return toUserDto(user);
}

export async function updateUserProfile(userId: string, input: UpdateMeInput): Promise<UserDto> {
  let currentLanguageId: string | undefined;
  if (input.languageCode) {
    const language = await prisma.language.findUnique({ where: { code: input.languageCode } });
    if (!language || !language.isActive) {
      throw new HttpError(
        400,
        "UNKNOWN_LANGUAGE",
        `Language "${input.languageCode}" is not supported`,
      );
    }
    currentLanguageId = language.id;
  }

  const data = {
    displayName: input.displayName,
    currentLanguageId,
    learningGoal: input.learningGoal,
    dailyGoal: input.dailyGoal?.toUpperCase() as DailyGoal | undefined,
    selfAssessment: input.selfAssessment,
    showRomanization: input.showRomanization,
    soundEffects: input.soundEffects,
    onboardingDone: input.onboardingDone,
    timeZone: input.timeZone,
  };

  await prisma.userProfile.upsert({
    where: { userId },
    update: data,
    create: { ...data, userId, displayName: input.displayName ?? "Learner" },
  });

  return getUserById(userId);
}
