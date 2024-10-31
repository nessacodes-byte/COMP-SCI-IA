"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Image from "next/image";
import { defaultProfilePicture } from "@/types";
import { CheckCircle, List, XOctagon } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default function User() {
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const [name, setName] = useState("Vernessa Graceanna");
  const [email, setEmail] = useState("vannessagrace150907@gmail.com");
  const [reminderDays, setReminderDays] = useState(3);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changeProfilePicture = () => {};
  const deleteProfilePicture = () => {};

  return (
    <>
      <Navbar></Navbar>
      <div className="profile-page">
        <div className="profile-section">
          <h1>Hi, {name}! 👋</h1>
          <div className="profile-field">
            <div className="profile-picture-section">
              <p>Profile Picture</p>
              <div>
                <Image
                  src={profilePicture}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                />
                <div>
                  <label htmlFor="change-profile-picture">Change picture</label>
                  <input
                    type="file"
                    id="change-profile-picture"
                    onChange={changeProfilePicture}
                  />
                  <button type="button" onClick={deleteProfilePicture}>
                    Delete profile picture
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="change-name-input">Name</label>
            <div>
              <input
                type="text"
                id="change-name-input"
                placeholder="Enter name..."
                defaultValue={name}
              />
              <button type="button">Change Name</button>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="change-email-input">Email</label>
            <div>
              <input
                type="text"
                id="change-email-input"
                placeholder="Enter email..."
                defaultValue={email}
              />
              <button type="button">Change Email</button>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="set-reminder-days-input">Set reminder days</label>
            <div>
              <input
                type="number"
                id="set-reminder-days-input"
                placeholder="Enter reminder days..."
                defaultValue={reminderDays}
                min={0}
              />
              <button type="button">Set Reminder Days</button>
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="change-password-input">Change password</label>
            <input
              id="change-password-input"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter confirm password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="button">Change Password</button>
          </div>
        </div>
        <div className="analytics-section">
          <div className="analytics-graph">
            <p>Task Progress</p>
            <p>4 out of 9</p>
            <div className="pie-graph">
              <Pie
                data={{
                  labels: ["Completed", "Incomplete"],
                  datasets: [
                    {
                      label: "Task Progress",
                      data: [4, 5],
                      backgroundColor: ["#FDCDD6", "#F1E8FD"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: false,
                    },
                  },
                  responsive: true,
                }}
              />
            </div>
          </div>
          <div className="analytics-info completed">
            <div>
              <p>4</p>
              <p>Completed Tasks</p>
            </div>
            <CheckCircle />
          </div>
          <div className="analytics-info incomplete">
            <div>
              <p>5</p>
              <p>Incomplete Tasks</p>
            </div>
            <XOctagon />
          </div>
          <div className="analytics-info total">
            <div>
              <p>9</p>
              <p>Total Tasks</p>
            </div>
            <List />
          </div>
        </div>
      </div>
    </>
  );
}
