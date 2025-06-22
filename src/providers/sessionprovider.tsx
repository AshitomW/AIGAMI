"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { GetUserDetails } from "@/lib/actions/profile";

const DEFAULT_AVATAR_IMAGE = "/default-avatar.png";

interface SessionUser {
  id: string;
  email: string;
  avatarUrl: string;
}

interface SessionContextType {
  user: SessionUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchUserWithAvatar = async (authUser: User) => {
    try {
      const dbDetails = await GetUserDetails();

      if (
        !dbDetails ||
        typeof dbDetails !== "object" ||
        !("id" in dbDetails) ||
        !("email" in dbDetails) ||
        !("avatarUrl" in dbDetails)
      ) {
        throw new Error("User Not Found");
      }
      setUser({
        id: dbDetails.id,
        email: dbDetails.email,
        avatarUrl: dbDetails.avatarUrl,
      });
    } catch (error) {
      console.error("Error fetching user avatar:", error);
      setUser({
        id: authUser.id,
        email: authUser.email!,
        avatarUrl: DEFAULT_AVATAR_IMAGE,
      });
    }
  };

  const refreshUser = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (authUser) {
        await fetchUserWithAvatar(authUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserWithAvatar(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
