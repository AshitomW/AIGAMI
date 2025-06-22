"use client";

import { useState, useEffect } from "react";
import {
  getLeaderboardData,
  getLeaderboardStats,
  type LeaderboardUser,
} from "@/lib/actions/leaderboards";
import {
  Trophy,
  Medal,
  Award,
  Flame,
  FileText,
  PenTool,
  User,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/providers/sessionprovider";

type LeaderboardType = "characters" | "streak" | "notes";

interface Stats {
  totalCharacters: number;
  bestStreak: number;
  totalNotes: number;
}

export default function LeaderboardsPage() {
  const userSession = useSession();

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
    return user.email.split("@")[0];
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getTabIcon = (type: LeaderboardType) => {
    switch (type) {
      case "characters":
        return <PenTool className="w-4 h-4" />;
      case "streak":
        return <Flame className="w-4 h-4" />;
      case "notes":
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg text-gray-600">
                Loading leaderboards...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Leaderboards
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how you rank among other users and track community progress
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex">
            {[
              { key: "characters" as const, label: "Characters" },
              { key: "streak" as const, label: "Streak" },
              { key: "notes" as const, label: "Notes" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {getTabIcon(tab.key)}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3">
                  {getTabIcon(activeTab)}
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getMetricLabel(activeTab)}
                  </h2>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No users yet
                    </h3>
                    <p className="text-gray-500">
                      Start creating notes to appear on the leaderboard!
                    </p>
                  </div>
                ) : (
                  getSortedUsers(activeTab).map((user, index) => (
                    <div
                      key={user.id}
                      className="p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                            {getRankIcon(index) || (
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-gray-600">
                                  {index + 1}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={user.avatarUrl}
                                alt={`${getUserDisplayName(user)} avatar`}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                                <User className="w-6 h-6" />
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          {/* User Info */}
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">
                              {getUserDisplayName(user)}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Rank #{index + 1}
                            </p>
                          </div>
                        </div>

                        {/* Metric Value */}
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900 mb-1">
                            {getMetricValue(user, activeTab)}
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {getMetricLabel(activeTab)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Community Stats
              </h3>

              <div className="space-y-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                  <PenTool className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.totalCharacters.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Characters</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl">
                  <Flame className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.bestStreak} days
                  </div>
                  <div className="text-sm text-gray-600">Best Streak</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl">
                  <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stats.totalNotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Notes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
