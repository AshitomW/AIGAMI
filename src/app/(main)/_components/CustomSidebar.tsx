"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  UserCircle,
  FileText,
  User,
  LogOut,
  Home,
  Settings,
  Info,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useSession } from "@/providers/sessionprovider";
import Image from "next/image";
import { DEFAULT_AVATAR_IMAGE } from "@/constants";
const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "My Notes",
    href: "/notes",
    icon: FileText,
  },
  {
    name: "My Profile",
    href: "/my-profile",
    icon: UserCircle,
  },
  {
    name: "Leaderboards",
    href: "/leaderboards",
    icon: Trophy,
  },
  {
    name: "About",
    href: "/about",
    icon: Info,
  },
];

export default function CustomSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      window.location.href = "/auth/signin";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const userSession = useSession();

  console.log(userSession);
  const avatar = userSession.user?.avatarUrl!;

  return (
    <div className="w-64 top-0 left-0 fixed h-screen  bg-white border-r border-gray-200 flex flex-col">
      {/* Profile Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={avatar}
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            {loading ? (
              <>
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-gray-900">
                  {user?.user_metadata?.full_name ||
                    user?.email?.split("@")[0] ||
                    "User"}
                </h3>
                <p className="text-xs text-gray-500">
                  {user?.email || "No email"}
                </p>
              </>
            )}
          </div>
        </div>
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
                  className={`flex  items-center px-4 py-3 rounded-md text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-gray-100  text-gray-900"
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

      {/* Logout Button */}
      <div className="p-4   border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-red-500">Log Out</span>
        </button>
      </div>
    </div>
  );
}
