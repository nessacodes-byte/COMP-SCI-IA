"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { defaultProfilePicture } from "@/types";
import { CheckCircle, List, XOctagon } from "lucide-react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { useAuth } from "@/authContext";
import { getFirebaseErrorMessage } from "@/utils";
import { doEmailChange, doPasswordChange } from "@/auth";
import { useRouter } from "next/navigation";

Chart.register(...registerables);

export default function User() {
  const router = useRouter();
  const { currentUser, setCurrentUser, isLoading, userLoggedIn } = useAuth();
  const [userProfile, setUserProfile] = useState(currentUser);
  const [password, setPassword] = useState({
    password: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    reminderDays: "",
  });

  useEffect(() => {
    setUserProfile(currentUser);
  }, [currentUser]);

  const changeName = useCallback(() => {
    if (!currentUser || !userProfile) return;
    setCurrentUser({ ...currentUser, name: userProfile.name })
      .then(() => setErrors((prevErrors) => ({ ...prevErrors, name: "" })))
      .catch((error) =>
        setErrors((prevErrors) => ({
          ...prevErrors,
          name: getFirebaseErrorMessage(error),
        }))
      );
  }, [currentUser, userProfile, setCurrentUser]);

  const changeEmail = useCallback(() => {
    if (!currentUser || !userProfile) return;
    setCurrentUser({ ...currentUser, email: userProfile.email })
      .then(() => doEmailChange(userProfile.email))
      .then(() => setErrors((prevErrors) => ({ ...prevErrors, email: "" })))
      .catch((error) =>
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: getFirebaseErrorMessage(error),
        }))
      );
  }, [currentUser, userProfile, setCurrentUser]);

  const changePassword = useCallback(() => {
    if (!currentUser || !userProfile) return;
    doPasswordChange(password.password, password.newPassword)
      .then(() => setErrors((prevErrors) => ({ ...prevErrors, password: "" })))
      .catch((error) =>
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: getFirebaseErrorMessage(error),
        }))
      );
  }, [currentUser, password, setCurrentUser]);

  const changeReminderDays = useCallback(() => {
    if (!currentUser || !userProfile) return;
    setCurrentUser({
      ...currentUser,
      reminderDays: userProfile.reminderDays,
    })
      .then(() =>
        setErrors((prevErrors) => ({ ...prevErrors, reminderDays: "" }))
      )
      .catch((error) =>
        setErrors((prevErrors) => ({
          ...prevErrors,
          reminderDays: getFirebaseErrorMessage(error),
        }))
      );
  }, [currentUser, userProfile, setCurrentUser]);

  const deleteProfilePicture = useCallback(() => {
    if (!currentUser || !userProfile) return;
    setCurrentUser({
      ...currentUser,
      profilePicture: defaultProfilePicture,
    })
      .then(() =>
        setErrors((prevErrors) => ({ ...prevErrors, profilePicture: "" }))
      )
      .catch((error) =>
        setErrors((prevErrors) => ({
          ...prevErrors,
          profilePicture: getFirebaseErrorMessage(error),
        }))
      );
  }, [currentUser, userProfile, setCurrentUser]);

  const changeProfilePicture = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const file = target?.files?.[0];
      if (!file || !currentUser || !userProfile) return;

      const photoURL = URL.createObjectURL(file);
      if (!photoURL) return;
      setCurrentUser({ ...currentUser, profilePicture: photoURL }).catch(
        (error) => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            profilePicture: getFirebaseErrorMessage(error),
          }));
        }
      );
    },
    [currentUser, userProfile, setCurrentUser, setUserProfile, setErrors]
  );

  if (isLoading) {
    return null;
  }

  if (!currentUser || !userLoggedIn) {
    router.push("/login");
    return null;
  }

  const completedTasks =
    userProfile?.tasks.filter((task) => task.completed).length ?? 0;
  const incompleteTasks =
    userProfile?.tasks.filter((task) => !task.completed).length ?? 0;
  const totalTasks = userProfile?.tasks.length ?? 0;

  return (
    <>
      <Navbar></Navbar>
      <div className="profile-page">
        <div className="profile-section">
          <h1>Hi, {currentUser?.name}! 👋</h1>
          <div className="profile-field">
            <div className="profile-picture-section">
              <p>Profile Picture</p>
              <div>
                <img
                  src={userProfile?.profilePicture || ""}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  className="profile-picture"
                />
                <div>
                  <label htmlFor="change-profile-picture">Change picture</label>
                  <input
                    type="file"
                    id="change-profile-picture"
                    onChange={changeProfilePicture}
                    accept="image/*"
                  />
                  <button type="button" onClick={deleteProfilePicture}>
                    Delete profile picture
                  </button>
                </div>
              </div>
              {errors.profilePicture && (
                <p className="profile-error">{errors.profilePicture}</p>
              )}
            </div>
          </div>
          <div className="profile-field">
            <label htmlFor="change-name-input">Name</label>
            <div>
              <input
                type="text"
                id="change-name-input"
                placeholder="Enter name..."
                defaultValue={userProfile?.name}
                onChange={(e) =>
                  setUserProfile((prevUserProfile) => {
                    if (!prevUserProfile) return null;
                    return {
                      ...prevUserProfile,
                      name: e.target.value,
                    };
                  })
                }
              />
              <button
                type="button"
                disabled={!userProfile?.name}
                onClick={changeName}
              >
                Change Name
              </button>
            </div>
            {errors.name && <p className="profile-error">{errors.name}</p>}
          </div>
          <div className="profile-field">
            <label htmlFor="change-email-input">Email</label>
            <div>
              <input
                type="text"
                id="change-email-input"
                placeholder="Enter email..."
                defaultValue={userProfile?.email}
                onChange={(e) =>
                  setUserProfile((prevUserProfile) => {
                    if (!prevUserProfile) return null;
                    return {
                      ...prevUserProfile,
                      email: e.target.value,
                    };
                  })
                }
              />
              <button
                type="button"
                disabled={!userProfile?.email}
                onClick={changeEmail}
              >
                Change Email
              </button>
            </div>
            {errors.email && <p className="profile-error">{errors.email}</p>}
          </div>
          <div className="profile-field">
            <label htmlFor="set-reminder-days-input">Set reminder days</label>
            <div>
              <input
                type="number"
                id="set-reminder-days-input"
                placeholder="Enter reminder days..."
                defaultValue={userProfile?.reminderDays}
                onChange={(e) =>
                  setUserProfile((prevUserProfile) => {
                    if (!prevUserProfile) return null;
                    return {
                      ...prevUserProfile,
                      reminderDays: parseInt(e.target.value, 10),
                    };
                  })
                }
                min={1}
              />
              <button
                type="button"
                disabled={
                  !userProfile?.reminderDays || userProfile?.reminderDays <= 0
                }
                onClick={changeReminderDays}
              >
                Set Reminder Days
              </button>
            </div>
            {errors.reminderDays && (
              <p className="profile-error">{errors.reminderDays}</p>
            )}
          </div>
          <div className="profile-field">
            <label htmlFor="change-password-input">Change password</label>
            <input
              id="change-password-input"
              type="password"
              placeholder="Enter current password..."
              value={password.password}
              onChange={(e) => {
                setPassword((prevPassword) => ({
                  ...prevPassword,
                  password: e.target.value,
                }));
              }}
            />
            <input
              type="password"
              placeholder="Enter new password..."
              value={password.newPassword}
              onChange={(e) => {
                setPassword((prevPassword) => ({
                  ...prevPassword,
                  newPassword: e.target.value,
                }));
              }}
            />
            {errors.password && (
              <p className="profile-error">{errors.password}</p>
            )}
            <button
              type="button"
              disabled={
                !password.password ||
                !password.newPassword ||
                password.password === password.newPassword
              }
              onClick={changePassword}
            >
              Change Password
            </button>
          </div>
        </div>
        <div className="analytics-section">
          <div className="analytics-graph">
            <p>Task Progress</p>
            <p>
              {completedTasks} out of {totalTasks}
            </p>
            <div className="pie-graph">
              {totalTasks > 0 ? (
                <Pie
                  data={{
                    labels: ["Completed", "Incomplete"],
                    datasets: [
                      {
                        label: "Task Progress",
                        data: [completedTasks, incompleteTasks],
                        backgroundColor: ["#F0FAF5", "#FDCDD6"],
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
              ) : (
                <p>
                  Nothing to see here yet. Try adding a task in the home page!
                </p>
              )}
            </div>
          </div>
          <div className="analytics-info completed">
            <div>
              <p>{completedTasks}</p>
              <p>Completed Tasks</p>
            </div>
            <CheckCircle />
          </div>
          <div className="analytics-info incomplete">
            <div>
              <p>{incompleteTasks}</p>
              <p>Incomplete Tasks</p>
            </div>
            <XOctagon />
          </div>
          <div className="analytics-info total">
            <div>
              <p>{totalTasks}</p>
              <p>Total Tasks</p>
            </div>
            <List />
          </div>
        </div>
      </div>
    </>
  );
}
