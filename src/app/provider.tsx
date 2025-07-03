"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { UserProvider, useUser } from "./context/UserContext";
import { RouteProvider } from "./context/RouteContext";
import { useEffect } from "react";
import { User } from "@/types";

type Props = {
  children?: React.ReactNode;
};

// Component to sync session with user context
const SessionSync = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { setUser } = useUser();
  console.log("session:", session?.user)
  useEffect(() => {
    const fetchFullUser = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/users/${session.user.id}`);
          if (response.ok) {
            const { user } = await response.json();
            setUser(user);
          } else {
            // Fallback to session data if API call fails
            const user: User = {
              id: session.user.id || '',
              username: session.user.username || '',
              email: session.user.email || '',
              name: session.user.name || '',
              age: session.user.age || 0,
              weight: session.user.weight || 0,
              height: session.user.height || 0,
              gender: session.user.gender || '',
              activityLevel: session.user.activityLevel || '',
              goal: session.user.goal || '',
              goalWeight: session.user.goalWeight || 0,
              pace: session.user.pace || 0,
              walkingroutes: [],
              password: '',
              googleId: session.user.googleId || null,
              lastUsernameChange: session.user.lastUsernameChange || new Date(),
              isUsernameChangeBlocked: session.user.isUsernameChangeBlocked || false,
            };
            setUser(user);
          }
        } catch {
          // Fallback to session data if API call fails
          const user: User = {
            id: session.user.id || '',
            username: session.user.username || '',
            email: session.user.email || '',
            name: session.user.name || '',
            age: session.user.age || 0,
            weight: session.user.weight || 0,
            height: session.user.height || 0,
            gender: session.user.gender || '',
            activityLevel: session.user.activityLevel || '',
            goal: session.user.goal || '',
            goalWeight: session.user.goalWeight || 0,
            pace: session.user.pace || 0,
            walkingroutes: [],
            password: '',
            googleId: session.user.googleId || null,
            lastUsernameChange: session.user.lastUsernameChange || new Date(),
            isUsernameChangeBlocked: session.user.isUsernameChangeBlocked || false,
          };
          setUser(user);
        }
      } else {
        setUser(null);
      }
    };

    fetchFullUser();
  }, [session, setUser]);

  return <>{children}</>;
};

export const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <UserProvider>
        <SessionSync>
          <RouteProvider>
            {children}
          </RouteProvider>
        </SessionSync>
      </UserProvider>
    </SessionProvider>
  );
};