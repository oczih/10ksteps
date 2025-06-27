"use client";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./context/UserContext";
import { RouteProvider } from "./context/RouteContext";

type Props = {
  children?: React.ReactNode;
};

export const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <UserProvider>
        <RouteProvider>
          {children}
        </RouteProvider>
      </UserProvider>
    </SessionProvider>
  );
};