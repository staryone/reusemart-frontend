"use client";
import { UserContext } from "@/context/UserContext";
import { User } from "@/types/auth";

export const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
