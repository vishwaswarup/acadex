"use client";
// TODO: Fix Firebase Authentication flow
// Register should use createUserWithEmailAndPassword(auth, email, password)
// Login should use signInWithEmailAndPassword(auth, email, password)
// On success -> redirect students to "/dashboard"
// On success -> redirect teachers to "/teacher" (if role exists in Firestore)
// Show error messages if login/register fails
// Disable button + show "loading..." while request is pending


import { ReactNode } from "react";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const value = useAuthProvider();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}