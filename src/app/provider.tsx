"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { UserProvider, useUser } from "./context/UserContext";
import { RouteProvider } from "./context/RouteContext";
import { useEffect } from "react";
import { User } from "@/types";
import { Session } from "next-auth";

type Props = {
  children?: React.ReactNode;
};

// Component to sync session with user context
const SessionSync = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { setUser } = useUser();

  // Log session only when it changes to avoid spamming logs
  useEffect(() => {
    console.log("session:", session);
    console.log("session?.accessToken:", session?.accessToken);
  }, [session]);

  useEffect(() => {
    const fetchFullUser = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`, {
            headers: {
              // Pass the access token for authorization if needed
              Authorization: `Bearer ${session.accessToken || ""}`,
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
          } else {
            // fallback to session user data if API call fails
            setUser(createUserFromSession(session));
          }
        } catch {
          // fallback to session user data if fetch throws error
          setUser(createUserFromSession(session));
        }
      } else {
        setUser(null);
      }
    };

    fetchFullUser();
  }, [session, setUser]);

  // Helper to create User object fallback from session data
  const createUserFromSession = (session: Session): User => ({
    id: session?.user?.id || "",
    username: session?.user?.username || "",
    email: session?.user?.email || "",
    name: session?.user?.name || "",
    age: session?.user?.age || 0,
    weight: session?.user?.weight || 0,
    height: session?.user?.height || 0,
    gender: session?.user?.gender || "",
    activityLevel: session?.user?.activityLevel || "",
    goal: session?.user?.goal || "",
    goalWeight: session?.user?.goalWeight || 0,
    pace: session?.user?.pace || 0,
    walkingroutes: [],
    password: "",
    googleId: session?.user?.googleId || null,
    lastUsernameChange: session?.user?.lastUsernameChange || new Date(),
    isUsernameChangeBlocked: session?.user?.isUsernameChangeBlocked || false,
  });

  return <>{children}</>;
};

export const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <UserProvider>
        <SessionSync>
          <RouteProvider>{children}</RouteProvider>
        </SessionSync>
      </UserProvider>
    </SessionProvider>
  );
};