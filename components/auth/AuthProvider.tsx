"use client";


import { ReactNode } from "react";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const value = useAuthProvider();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}