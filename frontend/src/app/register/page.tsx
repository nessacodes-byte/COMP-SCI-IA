"use client";

import { Flower2 } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState, FormEvent } from "react";
import { doCreateUserWithEmailAndPassword } from "@/auth";
import { useAuth } from "@/authContext";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const { userLoggedIn, setCurrentUser } = useAuth();

  const [name, setName] = useState(""); //useState = [name, setName] = Array, SetName is called then name is changed. Usestate triggers a rerender / refresh
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const readyToSubmit = useMemo(
    () =>
      name &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword,
    [name, email, password, confirmPassword]
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isRegistering) {
      setIsRegistering(true);
      const user = await doCreateUserWithEmailAndPassword(
        name,
        email,
        password
      );
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
          <h1>Welcome Back</h1>
          <div className="authentication-fields">
            <div className="authentication-field">
              <label htmlFor="register-name">Name</label>
              <input
                id="register-name"
                type="text"
                placeholder="Enter name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
            <div className="authentication-field">
              <label htmlFor="register-ponfirm">Confirm Password</label>
              <input
                id="register-ponfirm"
                type="password"
                placeholder="Enter confirm password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <button onClick={onSubmit} disabled={!readyToSubmit} type="button">
            Sign Up
          </button>
          <p>
            Already have an account instead? <a href="/login">Login</a>
          </p>
        </div>
      </div>
      <div className="authentication-section-2">
        <Image src={require("../home_page.jpg")} alt="Home Page Preview" />
      </div>
    </div>
  );
}
