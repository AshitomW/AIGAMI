"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Trophy, UserCircle, FileText } from "lucide-react";

const navigationItems = [
  {
    name: "Profile Header",
    href: "/dashboard/profile-header",
    icon: User,
  },
  {
    name: "Leaderboards",
    href: "/dashboard/leaderboards",
    icon: Trophy,
  },
  {
    name: "My Profile",
    href: "/dashboard/my-profile",
    icon: UserCircle,
  },
  {
    name: "My Notes",
    href: "/dashboard/my-notes",
    icon: FileText,
  },
];

export default function CustomSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
