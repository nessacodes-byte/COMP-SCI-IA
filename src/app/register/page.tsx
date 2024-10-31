"use client";

import { Flower2 } from "lucide-react";
import Image from "next/image";
import HomePage from "../home_page.jpg";
import { useMemo, useState } from "react";
import validator from "validator";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const readyToSubmit = useMemo(
    () =>
      name &&
      validator.isEmail(email) &&
      password &&
      confirmPassword &&
      password === confirmPassword,
    [name, email, password, confirmPassword]
  );

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
          <button disabled={!readyToSubmit} type="button">
            Sign Up
          </button>
          <p>
            Already have an account instead? <a href="/login">Login</a>
          </p>
        </div>
      </div>
      <div className="authentication-section-2">
        <Image src={HomePage} alt="Home Page Preview" />
      </div>
    </div>
  );
}
