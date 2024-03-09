"use client";

import { Profile } from "@prisma/client";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type UserContextProviderProps = {
  children: React.ReactNode;
  value: Profile | null;
};

export const UserContext = createContext<Profile | null>(null);

export default function UserContextProvider({
  ...props
}: UserContextProviderProps) {
  return (
    <UserContext.Provider value={props.value}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider",
    );
  }
  return context;
}
