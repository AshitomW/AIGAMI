"use client";

import { useState, useEffect } from "react";
import {
  getLeaderboardData,
  getLeaderboardStats,
  type LeaderboardUser,
} from "@/lib/actions/leaderboards";

type LeaderboardType = "characters" | "streak" | "notes";

interface Stats {
  totalCharacters: number;
  bestStreak: number;
  totalNotes: number;
}

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("characters");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCharacters: 0,
    bestStreak: 0,
    totalNotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardData, statsData] = await Promise.all([
          getLeaderboardData(),
          getLeaderboardStats(),
        ]);
        setUsers(leaderboardData);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSortedUsers = (type: LeaderboardType) => {
    const sorted = [...users].sort((a, b) => {
      switch (type) {
        case "characters":
          return b.characterCount - a.characterCount;
        case "streak":
          return b.streak - a.streak;
        case "notes":
          return b.noteCount - a.noteCount;
        default:
          return 0;
      }
    });
    return sorted;
  };

  const getMetricValue = (user: LeaderboardUser, type: LeaderboardType) => {
    switch (type) {
      case "characters":
        return user.characterCount.toLocaleString();
      case "streak":
        return `${user.streak} days`;
      case "notes":
        return user.noteCount.toLocaleString();
      default:
        return "";
    }
  };

  const getMetricLabel = (type: LeaderboardType) => {
    switch (type) {
      case "characters":
        return "Characters Written";
      case "streak":
        return "Current Streak";
      case "notes":
        return "Notes Created";
      default:
        return "";
    }
  };

  const getUserDisplayName = (user: LeaderboardUser) => {
    return user.email.split("@")[0]; // Use email username as display name
  };

  const getRandomAvatar = (userId: string) => {
    const avatars = [
      "👨‍💻",
      "👩‍💻",
      "👨‍🎓",
      "👩‍🎓",
      "👨‍🔬",
      "👩‍🔬",
      "👨‍💼",
      "👩‍💼",
      "👨‍🎨",
      "👩‍🎨",
    ];
    const index = userId.charCodeAt(0) % avatars.length;
    return avatars[index];
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading leaderboards...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Leaderboards
      </h1>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 inline-flex">
          {[
            { key: "characters" as const, label: "Characters" },
            { key: "streak" as const, label: "Streak" },
            { key: "notes" as const, label: "Notes" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {getMetricLabel(activeTab)}
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No users found. Start creating notes to appear on the leaderboard!
            </div>
          ) : (
            getSortedUsers(activeTab).map((user, index) => (
              <div
                key={user.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {index < 3 ? (
                      <span className="text-2xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                    ) : (
                      <span className="text-lg font-bold text-gray-500">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    {getRandomAvatar(user.id)}
                  </div>

                  {/* User Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getUserDisplayName(user)}
                    </h3>
                    <p className="text-sm text-gray-500">Rank #{index + 1}</p>
                  </div>
                </div>

                {/* Metric Value */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {getMetricValue(user, activeTab)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getMetricLabel(activeTab)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Characters",
            value: stats.totalCharacters.toLocaleString(),
            icon: "📝",
          },
          {
            title: "Best Streak",
            value: `${stats.bestStreak} days`,
            icon: "🔥",
          },
          {
            title: "Total Notes",
            value: stats.totalNotes.toLocaleString(),
            icon: "📚",
          },
        ].map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg p-6 border border-gray-200 text-center"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
