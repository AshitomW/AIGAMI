"use client";

import { useState, useEffect } from "react";
import { getLeaderboardData } from "@/lib/actions/leaderboards";
import { createClient } from "@/utils/supabase/client";
import ProfileUpdateModal from "../_components/updateModal";
import { useSession } from "@/providers/sessionprovider";
import { Flame, LucideNotebookPen, SwatchBookIcon } from "lucide-react";

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
  const userSession = useSession();

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log(`session details:${session}`);

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
          (user) =>
            user.email.toLowerCase() === session.user.email.toLowerCase()
        );

        console.log(`current user: ${currentUser}`);

        console.log(`current user: ${session.user.email}`);
        if (!currentUser) {
          setLoading(false);
          return;
        }

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
      <div className="min-h-screen flex items-center justify-center">
        <div className=" p-8 rounded-md  text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-3"></div>
          <div className="text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto h-full">
        {/* Header Banner */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 mb-12 overflow-hidden relative">
          <div className="p-8 pb-4">
            <h1 className="text-3xl font-bold text-black mb-4">My Profile</h1>
            <p className="text-gray-600 text-lg">
              Your writing statistics and achievements
            </p>
          </div>
        </div>

        {userRanking ? (
          <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-280px)]">
            {/* Left Column - Profile Info */}
            <div className="col-span-12  lg:col-span-4">
              <div className="bg-white shadow-md rounded-sm border border-gray-200 h-full relative overflow-hidden min-h-[500px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10 p-12 h-full flex flex-col justify-center">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-gray-100 mb-6">
                      <img
                        src={userSession.user?.avatarUrl!}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-3xl font-bold text-black mb-2">
                      {getUserDisplayName()}
                    </h2>
                    <p className="text-gray-600 text-base mb-3">
                      {session?.user?.email}
                    </p>
                    <p className="text-gray-500 text-base mb-4">
                      Member since {new Date().getFullYear()}
                    </p>
                    <ProfileUpdateModal
                      currentAvatarUrl={
                        session?.user?.user_metadata?.avatar_url
                      }
                      userEmail={session?.user?.email}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Rankings and Stats */}
            <div className="col-span-12 lg:col-span-8 flex flex-col">
              {/* Rankings Row */}
              <div className="bg-white  shadow-sm rounded-md border border-gray-200 mb-8 overflow-hidden flex-1">
                <div className="border-b border-gray-100 px-8 py-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Rankings
                  </h3>
                </div>
                <div className="p-8">
                  <div className="flex flex-wrap gap-12 w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Characters
                        </span>
                        <span className="text-2xl">
                          {getRankBadge(userRanking.charactersRank)}
                        </span>
                      </div>
                      <div
                        className={`text-4xl font-bold ${getRankColor(
                          userRanking.charactersRank
                        )}`}
                      >
                        #{userRanking.charactersRank}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        of {userRanking.totalUsers} users
                      </div>
                    </div>

                    <div className="w-px bg-gray-200 self-stretch"></div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Streak
                        </span>
                        <span className="text-2xl">
                          {getRankBadge(userRanking.streakRank)}
                        </span>
                      </div>
                      <div
                        className={`text-4xl font-bold ${getRankColor(
                          userRanking.streakRank
                        )}`}
                      >
                        #{userRanking.streakRank}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        of {userRanking.totalUsers} users
                      </div>
                    </div>

                    <div className="w-px bg-gray-200 self-stretch"></div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-gray-600">
                          Notes
                        </span>
                        <span className="text-2xl">
                          {getRankBadge(userRanking.notesRank)}
                        </span>
                      </div>
                      <div
                        className={`text-4xl font-bold ${getRankColor(
                          userRanking.notesRank
                        )}`}
                      >
                        #{userRanking.notesRank}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        of {userRanking.totalUsers} users
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                <div className="bg-white shadow-sm rounded-md border border-gray-200 relative overflow-hidden group hover:shadow-lg transition-shadow duration-200 min-h-[180px]">
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-600 mb-4">
                          Total Characters
                        </h4>
                        <div className="text-4xl font-bold text-black mb-2">
                          {userRanking.user.characterCount.toLocaleString()}
                        </div>
                        <div className="text-base text-gray-500">
                          characters written
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center ml-6">
                        <span className="text-gray-600 text-xl">
                          <LucideNotebookPen />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-sm rounded-md border border-gray-200 relative overflow-hidden group hover:shadow-lg transition-shadow duration-200 min-h-[180px]">
                  <div className="p-8 h-full flex flex-col rounded-md justify-center">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-600 mb-4">
                          Current Streak
                        </h4>
                        <div className="text-4xl font-bold text-black mb-2">
                          {userRanking.user.streak}
                        </div>
                        <div className="text-base text-gray-500">
                          days in a row
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center ml-6">
                        <span className="text-gray-600 text-xl">
                          <Flame />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-sm border rounded-md border-gray-200 relative overflow-hidden group hover:shadow-lg transition-shadow duration-200 min-h-[180px]">
                  <div className="p-8 h-full flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-600 mb-4">
                          Total Notes
                        </h4>
                        <div className="text-4xl font-bold text-black mb-2">
                          {userRanking.user.noteCount}
                        </div>
                        <div className="text-base text-gray-500">
                          notes created
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center ml-6">
                        <span className="text-gray-600 text-xl">
                          <SwatchBookIcon />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 text-center relative overflow-hidden min-h-[400px] flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
            <div className="p-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-gray-400 text-3xl">📊</span>
              </div>
              <div className="text-gray-600 mb-3 text-xl">No data found</div>
              <div className="text-gray-500 text-base">
                Start creating notes to see your profile statistics!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
