"use client";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./context/UserContext";

type Props = {
  children?: React.ReactNode;
};

export const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SessionProvider>
  );
};