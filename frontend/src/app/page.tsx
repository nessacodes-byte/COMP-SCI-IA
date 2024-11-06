"use client";

import AddTaskForm from "../components/AddTaskForm";
import Navbar from "../components/Navbar";
import Sheet from "../components/Sheet";
import TaskList from "../components/TaskList";
import { Task, User } from "../types";
import { Calendar, Download, Filter, List, Plus, Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../authContext";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const router = useRouter();
  const { currentUser, setCurrentUser, userLoggedIn, isLoading } = useAuth();
  // State for the search bar to filter for tasks
  const [searchQuery, setSearchQuery] = useState("");
  // State to change between list and calendar view
  const [isList, setIsList] = useState(true);
  // State to track user tasks
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Redirects user to login if they are not logged in
    if (!isLoading && (!currentUser || !userLoggedIn)) {
      router.push("/login");
    }
  }, [currentUser, userLoggedIn, isLoading, router]);

  useEffect(() => {
    if (!currentUser) return;
    
    // TODO: Fix
    if (tasks.length > 0) {
      setCurrentUser({
        ...currentUser,
        tasks,
      });
    }
  }, [tasks]);

  if (isLoading) {
    return null;
  }

  if (!isLoading && (!currentUser || !userLoggedIn)) {
    return null;
  }

  return (
    <>
      <Navbar></Navbar>
      <div id="search-bar">
        <label id="search-bar-label" htmlFor="search-bar-input">
          <Search></Search>
          <input
            id="search-bar-input"
            type="text"
            placeholder="Search for tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
        </label>
        <button id="filter-btn">
          <Filter />
          <p>Filter</p>
        </button>
        <div className="search-btns">
          <button
            style={
              isList
                ? {
                    border: "1px solid var(--primary-shadow-color)",
                    background: "var(--primary-shadow-color)",
                  }
                : {
                    background: "none",
                    border: "1px solid var(--foreground)",
                  }
            }
            onClick={() => setIsList(true)}
            id="list-btn"
          >
            <List />
            <p>List</p>
          </button>
          <button
            style={
              !isList
                ? {
                    border: "1px solid var(--primary-shadow-color)",
                    background: "var(--primary-shadow-color)",
                  }
                : { background: "none", border: "1px solid var(--foreground)" }
            }
            onClick={() => setIsList(false)}
            id="calendar-btn"
          >
            <Calendar />
            <p>Calendar</p>
          </button>
        </div>
      </div>
      <main>
        {isList ? (
          <>
            <div className="table-header">
              <div id="task-header">
                <Calendar />
                <p>Tasks List</p>
              </div>
              <div id="utility-btns">
                <Sheet>
                  <Sheet.Button>
                    <div id="create-new-task-button">
                      <Plus />
                      <p>Create New Task</p>
                    </div>
                  </Sheet.Button>
                  <Sheet.Body>
                    <AddTaskForm tasks={tasks} setTasks={setTasks} />
                  </Sheet.Body>
                </Sheet>
                <button id="export">
                  <Download />
                  <p>Export</p>
                </button>
              </div>
            </div>

            {!isLoading && currentUser && (
              <TaskList tasks={tasks} setTasks={setTasks} />
            )}
          </>
        ) : (
          <p>Calendar view</p>
        )}
      </main>
    </>
  );
}
