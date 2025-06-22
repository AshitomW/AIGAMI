"use server";

import { prisma } from "@/db/prisma";
import { getUser } from "@/utils/supabase/server";

export async function getNoteCount() {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error("You must be logged in to see note count!");
    }
    let noteCount = await prisma.note.count({
      where: {
        authorId: user?.id,
      },
    });
    return noteCount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCharacterCount() {
  try {
    const user = await getUser();
    if (!user) throw new Error("Log In First !");
    const notes = await prisma.note.findMany({
      where: {
        authorId: user?.id,
      },
    });
    const totalCharacters = notes.reduce((sum, note) => {
      return sum + note.text.length;
    }, 0);

    return totalCharacters;
  } catch (error) {
    console.log(error);
  }
}

export async function noteCreatedToday() {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("You must be logged in to see note count!");
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    const noteCount = await prisma.note.count({
      where: {
        authorId: user.id,
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
    });

    return noteCount;
  } catch (error) {
    console.log(error);
  }
}

export async function noteCreatedThisWeek() {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("You must be logged in to see note count!");
    }

    const now = new Date();
    const day = now.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfNextWeek = new Date(startOfWeek);
    startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

    const noteCount = await prisma.note.count({
      where: {
        authorId: user.id,
        createdAt: {
          gte: startOfWeek,
          lt: startOfNextWeek,
        },
      },
    });

    return noteCount;
  } catch (error) {
    console.log(error);
  }
}

export async function noteActivityCounterThisWeek() {
  try {
    const user = await getUser();

    if (!user) {
      throw new Error("You must be logged in to see activity!");
    }

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const now = new Date();
    const currentDay = now.getDay();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    const activity: Record<string, number> = {};

    for (let i = 0; i < 7; i++) {
      const dayStart = new Date(startOfWeek);
      dayStart.setDate(startOfWeek.getDate() + i);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const count = await prisma.note.count({
        where: {
          authorId: user.id,
          createdAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      activity[dayNames[i]] = count;
    }

    return activity;
  } catch (error) {
    console.log(error);
    return {};
  }
}

export async function getUserStatistics() {
  try {
    const noteCount = (await getNoteCount()) || 0;
    const todayNoteCount = (await noteCreatedToday()) || 0;
    const weekNoteCount = (await noteCreatedThisWeek()) || 0;
    const noteActivity = (await noteActivityCounterThisWeek()) || [];
    const characterCount = (await getCharacterCount()) || 0;

    return {
      noteCount,
      todayNoteCount,
      weekNoteCount,
      noteActivity,
      characterCount,
    };
  } catch (error) {
    console.log(error);
    return {
      noteCount: 0,
      todayNoteCount: 0,
      weekNoteCount: 0,
      noteActivity: [],
      characterCount: 0,
    };
  }
}
