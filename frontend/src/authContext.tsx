"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { User, AuthContextType, Task } from "./types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { changeUserInDatabase, doSignOut } from "@/auth";

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userLoggedIn: false,
  isLoading: true,
  setCurrentUser: () => new Promise(() => {}),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleSetUser = async (newUser: User | null) => {
    if (!newUser) {
      localStorage.removeItem("user");
      setCurrentUser(null);
      return;
    }
    localStorage.setItem("user", JSON.stringify(newUser));
    setCurrentUser(newUser);
    await changeUserInDatabase(newUser);
  };

  const logout = () => {
    handleSetUser(null);
    doSignOut();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userLoggedIn: !!currentUser,
        setCurrentUser: handleSetUser,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
