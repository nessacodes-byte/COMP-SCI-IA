"use client";

import AddTaskForm from "../components/AddTaskForm";
import Navbar from "../components/Navbar";
import Sheet from "../components/Sheet";
import TaskList from "../components/TaskList";
import { Task } from "../types";
import { Calendar, Download, Filter, List, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isList, setIsList] = useState(true); //use state is a function -> calls setSearchQuery to re-render, if there's change in searchQuery

  const dummyData: Task[] = [
    {
      id: "0",
      name: "Task Task Task Task Task Task Task Task Task Task",
      category: "Academic",
      priority: "High",
      deadline: new Date(1730290589),
      description: "",
      notes: "",
      reminder: false,
      completed: false,
    },
  ];

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
                    <AddTaskForm />
                  </Sheet.Body>
                </Sheet>
                <button id="export">
                  <Download />
                  <p>Export</p>
                </button>
              </div>
            </div>

            <TaskList tasks={dummyData} />
          </>
        ) : (
          <p>Calendar view</p>
        )}
      </main>
    </>
  );
}
