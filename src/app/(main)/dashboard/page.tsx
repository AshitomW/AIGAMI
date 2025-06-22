import { getUserStatistics } from "@/lib/actions/userStatistics";
import React from "react";

export const revalidate = 3600;

export default async function page() {
  const statistics = await getUserStatistics();
  console.log(statistics);

  return (
    <div className="h-[90vh] flex items-center justify-between p-8">
      <div className="max-w-7xl w-full mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Welcome Back,
          </h1>
          <p className="text-xl text-gray-600">
            Ready to capture your thoughts today?
          </p>
        </div>
        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Primary Stats - Left Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Notes */}
              <div className="bg-white rounded-md p-8 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Total Notes
                    </p>
                    <p className="text-5xl font-bold text-gray-900 mb-2">
                      {statistics.noteCount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Your digital collection
                    </p>
                  </div>
                  <div className="w-14 h-14 bg-blue-100 rounded-md flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v0a2 2 0 002 2h14a2 2 0 002-2v0a2 2 0 00-2-2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Characters */}
              <div className="bg-white rounded-md p-8 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Characters
                    </p>
                    <p className="text-5xl font-bold text-gray-900 mb-2">
                      {statistics.characterCount > 999
                        ? `${Math.round(statistics.characterCount / 1000)}K`
                        : statistics.characterCount}
                    </p>
                    <p className="text-sm text-gray-600">Characters captured</p>
                  </div>
                  <div className="w-14 h-14 bg-green-100 rounded-md flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-md p-8 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Weekly Activity
              </h3>
              <div className="flex items-end justify-between h-32 space-x-2">
                {Object.entries(statistics.noteActivity).map(
                  ([day, count], index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <p className="text-xs text-gray-400 mb-1">{count}</p>
                      <div
                        className="w-full bg-gray-900 rounded-t-lg transition-all duration-300 hover:bg-gray-700"
                        style={{ height: `${count * 4}px` }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-2">{day}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Today's Progress */}
            <div className="bg-white rounded-md p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Today's Notes
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {statistics.todayNoteCount}
                </p>
                <p className="text-sm text-gray-600">Keep it going!</p>
              </div>
            </div>

            {/* This Week */}
            <div className="bg-white rounded-md p-6 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  This Week
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {statistics.weekNoteCount}
                </p>
                <p className="text-sm text-gray-600">Notes created</p>
              </div>
            </div>

            {/* Quick Action */}
          </div>
        </div>
      </div>
    </div>
  );
}
