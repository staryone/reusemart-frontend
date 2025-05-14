import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types/auth";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: (user: User | null) => ReactNode;
}

export default async function AuthProvider({ children }: AuthProviderProps) {
  const user = await getCurrentUser();
  return <>{children(user)}</>;
}
