"use client";

import { useState, useEffect } from "react";
import { getLeaderboardData } from "@/lib/actions/leaderboards";
import { createClient } from "@/utils/supabase/client";

interface UserRanking {
  user: {
    id: string;
    email: string;
    characterCount: number;
    streak: number;
    noteCount: number;
  };
  charactersRank: number;
  streakRank: number;
  notesRank: number;
  totalUsers: number;
}

export default function MyProfilePage() {
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    }
    getSession();
  }, []);

  useEffect(() => {
    const fetchUserRanking = async () => {
      if (!session?.user?.email) return;

      try {
        const allUsers = await getLeaderboardData();
        const currentUser = allUsers.find(
          (user) => user.email === session.user.email
        );

        if (!currentUser) {
          setLoading(false);
          return;
        }

        // Calculate rankings
        const charactersSorted = [...allUsers].sort(
          (a, b) => b.characterCount - a.characterCount
        );
        const streakSorted = [...allUsers].sort((a, b) => b.streak - a.streak);
        const notesSorted = [...allUsers].sort(
          (a, b) => b.noteCount - a.noteCount
        );

        const charactersRank =
          charactersSorted.findIndex((user) => user.id === currentUser.id) + 1;
        const streakRank =
          streakSorted.findIndex((user) => user.id === currentUser.id) + 1;
        const notesRank =
          notesSorted.findIndex((user) => user.id === currentUser.id) + 1;

        setUserRanking({
          user: currentUser,
          charactersRank,
          streakRank,
          notesRank,
          totalUsers: allUsers.length,
        });
      } catch (error) {
        console.error("Error fetching user ranking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRanking();
  }, [session]);

  const getUserDisplayName = () => {
    if (!session?.user?.email) return "Guest";
    return session.user.email.split("@")[0];
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-black";
    if (rank === 2) return "text-gray-700";
    if (rank === 3) return "text-gray-600";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-md shadow-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-3"></div>
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-black">My Profile</h1>
            <p className="text-gray-600 text-sm mt-1">
              Your writing statistics and achievements
            </p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">
                {getUserDisplayName()}
              </h2>
              <p className="text-gray-600">{session?.user?.email}</p>
              <p className="text-gray-500 text-sm mt-1">
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

        {userRanking ? (
          <>
            {/* Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Characters Rank
                  </h3>
                  <span className="text-lg">
                    {getRankBadge(userRanking.charactersRank)}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold ${getRankColor(
                    userRanking.charactersRank
                  )}`}
                >
                  #{userRanking.charactersRank}
                </div>
                <div className="text-gray-500 text-sm">
                  out of {userRanking.totalUsers} users
                </div>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Streak Rank</h3>
                  <span className="text-lg">
                    {getRankBadge(userRanking.streakRank)}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold ${getRankColor(
                    userRanking.streakRank
                  )}`}
                >
                  #{userRanking.streakRank}
                </div>
                <div className="text-gray-500 text-sm">
                  out of {userRanking.totalUsers} users
                </div>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Notes Rank</h3>
                  <span className="text-lg">
                    {getRankBadge(userRanking.notesRank)}
                  </span>
                </div>
                <div
                  className={`text-2xl font-bold ${getRankColor(
                    userRanking.notesRank
                  )}`}
                >
                  #{userRanking.notesRank}
                </div>
                <div className="text-gray-500 text-sm">
                  out of {userRanking.totalUsers} users
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Total Characters
                </h3>
                <div className="text-2xl font-bold text-black">
                  {userRanking.user.characterCount.toLocaleString()}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  characters written
                </div>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Current Streak
                </h3>
                <div className="text-2xl font-bold text-black">
                  {userRanking.user.streak}
                </div>
                <div className="text-gray-500 text-sm mt-1">days in a row</div>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Total Notes
                </h3>
                <div className="text-2xl font-bold text-black">
                  {userRanking.user.noteCount}
                </div>
                <div className="text-gray-500 text-sm mt-1">notes created</div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-12 rounded-md shadow-sm border border-gray-200 text-center">
            <div className="text-gray-600 mb-2 text-lg">No data found</div>
            <div className="text-gray-500 text-sm">
              Start creating notes to see your profile statistics!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
