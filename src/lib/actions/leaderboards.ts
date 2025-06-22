"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface LeaderboardUser {
  id: string;
  email: string;
  characterCount: number;
  streak: number;
  avatarUrl: string;
  noteCount: number;
}

function calculateStreak(notes: { updatedAt: Date }[]): number {
  if (notes.length === 0) return 0;

  const uniqueDays = [
    ...new Set(notes.map((note) => note.updatedAt.toISOString().split("T")[0])),
  ]
    .sort()
    .reverse();

  if (uniqueDays.length === 0) return 0;

  let streak = 0;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  if (uniqueDays[0] !== today && uniqueDays[0] !== yesterday) {
    return 0;
  }

  let previousDate = new Date(uniqueDays[0]);
  streak = 1;

  for (let i = 1; i < uniqueDays.length; i++) {
    const currentDate = new Date(uniqueDays[i]);
    const dayDifference = Math.floor(
      (previousDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDifference === 1) {
      streak++;
      previousDate = currentDate;
    } else {
      break;
    }
  }

  return streak;
}

export async function getLeaderboardData(): Promise<LeaderboardUser[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        notes: {
          select: {
            text: true,
            updatedAt: true,
          },
        },
      },
    });

    const leaderboardData: LeaderboardUser[] = users.map((user) => {
      const characterCount = user.notes.reduce(
        (total, note) => total + note.text.length,
        0
      );
      const noteCount = user.notes.length;
      const streak = calculateStreak(user.notes);

      return {
        id: user.id,
        email: user.email,
        characterCount,
        avatarUrl: user.avatarUrl,
        streak,
        noteCount,
      };
    });

    return leaderboardData;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return [];
  }
}

export async function getLeaderboardStats() {
  try {
    const users = await getLeaderboardData();

    const totalCharacters = users.reduce(
      (sum, user) => sum + user.characterCount,
      0
    );
    const bestStreak = Math.max(...users.map((user) => user.streak), 0);
    const totalNotes = users.reduce((sum, user) => sum + user.noteCount, 0);

    return {
      totalCharacters,
      bestStreak,
      totalNotes,
    };
  } catch (error) {
    console.error("Error fetching leaderboard stats:", error);
    return {
      totalCharacters: 0,
      bestStreak: 0,
      totalNotes: 0,
    };
  }
}
