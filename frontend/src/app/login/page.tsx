"use client";

import { Flower2 } from "lucide-react";
import Image from "next/image";
import HomePage from "../home_page.jpg";
import React, { useMemo, useState, FormEvent } from "react";
import { doSignInWithEmailAndPassword } from "@/auth";
import { useAuth } from "@/authContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { userLoggedIn, setCurrentUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const readyToSubmit = useMemo(() => email && password, [email, password]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      const user = await doSignInWithEmailAndPassword(email, password);
      setCurrentUser(user);
      router.push("/");
    }
  };

  return (
    <div className="authentication-sections">
      <div className="authentication-section-1">
        <div className="logo">
          <Flower2 />
          <p>Assign Me</p>
        </div>
        <div className="authentication-form">
          <h1>Create Account</h1>
          <div className="authentication-fields">
            <div className="authentication-field">
              <label htmlFor="register-email">Email</label>
              <input
                id="register-email"
                type="text"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="authentication-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button onClick={onSubmit} disabled={!readyToSubmit} type="button">
            Login
          </button>
          <p>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
      <div className="authentication-section-2">
        <Image src={HomePage} alt="Home Page Preview" />
      </div>
    </div>
  );
}
