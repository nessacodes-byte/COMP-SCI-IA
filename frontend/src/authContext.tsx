"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, AuthContextType } from "./types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userLoggedIn: false,
  isLoading: true,
  setCurrentUser: () => {},
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

  const handleSetUser = (newUser: User | null) => {
    const changeUserInDb = async (user: User) => {
      // const userRef = await doc(db, "users", user.id);
      // await updateDoc(userRef, user);
      // TODO: Fix
      console.log(user);
    };

    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      changeUserInDb(newUser);
    } else {
      localStorage.removeItem("user");
    }
    setCurrentUser(newUser);
  };

  const logout = () => {
    handleSetUser(null);
    localStorage.removeItem("user");
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
