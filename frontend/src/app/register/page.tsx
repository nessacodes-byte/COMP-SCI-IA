"use client";

import { Flower2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, FormEvent, useCallback } from "react";
import { doCreateUserWithEmailAndPassword } from "@/auth";
import { getFirebaseErrorMessage } from "@/utils";
import { useAuth } from "@/authContext";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const { userLoggedIn, setCurrentUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
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

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      setIsRegistering(true);
      setError("");

      try {
        const user = await doCreateUserWithEmailAndPassword(
          name,
          email,
          password
        );
        await setCurrentUser(user);
        router.push("/");
      } catch (error) {
        setError(getFirebaseErrorMessage(error));
      } finally {
        setIsRegistering(false);
      }
    },
    [
      name,
      email,
      password,
      readyToSubmit,
      isRegistering,
      setCurrentUser,
      router,
    ]
  );

  return (
    <div className="authentication-sections">
      <div className="authentication-section-1">
        <div className="logo">
          <Flower2 />
          <p>Assign Me</p>
        </div>
        <form className="authentication-form" onSubmit={onSubmit}>
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
          {error && <p className="authentication-error">{error}</p>}
          <button type="submit" disabled={!readyToSubmit || isRegistering}>
            {!isRegistering ? "Register an account" : "Loading..."}
          </button>
          <p>
            Already have an account instead? <a href="/login">Login</a>
          </p>
        </form>
      </div>
      <div className="authentication-section-2">
        <Image src={require("../home_page.jpg")} alt="Home Page Preview" />
      </div>
    </div>
  );
}
