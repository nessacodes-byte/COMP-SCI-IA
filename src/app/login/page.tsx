"use client";

import { Flower2 } from "lucide-react";
import Image from "next/image";
import HomePage from "../home_page.jpg";
import { useMemo, useState } from "react";
import validator from "validator";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const readyToSubmit = useMemo(
    () => validator.isEmail(email) && password,
    [email, password]
  );

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
          <button disabled={!readyToSubmit} type="button">
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
