"use client";
import Navbar from "@/components/Navbar";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Filter,
  List,
  Plus,
  Search,
  SquareCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [isList, setIsList] = useState(true);

  const dummyData = [
    {
      task: "task",
      category: "Academic",
      priority: "High",
      deadline: new Date(),
    },
  ];

  useEffect(() => {
    console.log(isList);
  }, [isList]);

  return (
    <>
      <Navbar></Navbar>
      <div id="search-bar">
        <label id="search-bar-label" htmlFor="search-bar-input">
          <Search></Search>
          <input
            id="search-bar-input"
            type="text"
            placeholder="search for tasks..."
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
                <button id="create-new-task">
                  <Plus />
                  <p>Create New Task</p>
                </button>
                <button id="export">
                  <Download />
                  <p>Export</p>
                </button>
              </div>
            </div>

            <table>
              <tr className="table">
                <th id="task">
                  <p>Task</p>
                  <ChevronsUpDown />
                </th>
                <th id="category">
                  <p>Category</p>
                  <ChevronsUpDown />
                </th>
                <th id="priority">
                  <p>Priority</p>
                  <ChevronsUpDown />
                </th>
                <th id="deadline">
                  <p>Deadline</p>
                  <ChevronsUpDown />
                </th>
                <th id="delete">
                  <p>Delete?</p>
                </th>
              </tr>
              {dummyData.map((task) => {
                return (
                  <tr className="list">
                    <td id="task-list">
                      <SquareCheck />
                      <p>{task.task}</p>
                    </td>
                    <td id="category-list">
                      <p>{task.category}</p>
                      <ChevronDown />
                    </td>
                    <td id="priority-list">
                      <p>{task.priority}</p>
                      <ChevronDown />
                    </td>
                    <td id="dline-list">
                      <p>{task.deadline.toLocaleDateString()}</p>
                    </td>
                    <td id="delete-list">
                      <Trash2 />
                    </td>
                  </tr>
                );
              })}
            </table>
            <div className="completed">
              <p>Completed 8 out of 8</p>
              <div id="page">
                <ChevronLeft />
                <p>1 / 1</p>
                <ChevronRight />
              </div>
            </div>
          </>
        ) : (
          <p>Calendar view</p>
        )}
      </main>
    </>
  );
}
