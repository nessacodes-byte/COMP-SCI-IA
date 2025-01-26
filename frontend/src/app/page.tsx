"use client";

import AddTaskForm from "../components/AddTaskForm";
import Navbar from "../components/Navbar";
import Sheet from "../components/Sheet";
import TaskList from "../components/TaskList";
import EditTaskForm from "../components/EditTaskForm";
import { Task, User } from "../types";
import {
  Calendar as CalendarIcon,
  Download,
  Filter,
  List,
  Plus,
  Search,
} from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../authContext";
import { useRouter } from "next/navigation";
import { Calendar, dateFnsLocalizer, Navigate } from "react-big-calendar";
import { format } from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";

import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const router = useRouter();
  const { currentUser, setCurrentUser, userLoggedIn, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isList, setIsList] = useState(false);

  const flatTasks = useMemo(
    () => (currentUser ? currentUser.tasks : []),
    [currentUser]
  );

  const filteredTasks = useMemo(
    () => flatTasks.filter((task) => task.name.includes(searchQuery)),
    [flatTasks, searchQuery]
  );

  const setTasks = useCallback(
    (tasks: Task[]) => {
      if (currentUser) {
        setCurrentUser({ ...currentUser, tasks }).catch((e) =>
          console.error(e)
        );
      }
    },
    [currentUser, setCurrentUser]
  );

  useEffect(() => {
    // Redirects user to login if they are not logged in
    if (!isLoading && (!currentUser || !userLoggedIn)) {
      router.push("/login");
    }
  }, [currentUser, userLoggedIn, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (!currentUser || !userLoggedIn) {
    router.push("/login");
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
            <CalendarIcon />
            <p>Calendar</p>
          </button>
        </div>
      </div>
      <main>
        {isList ? (
          <>
            <div className="table-header">
              <div id="task-header">
                <CalendarIcon />
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
                    <AddTaskForm
                      tasks={filteredTasks}
                      flatTasks={flatTasks}
                      setTasks={setTasks}
                    />
                  </Sheet.Body>
                </Sheet>
                <button id="export">
                  <Download />
                  <p>Export</p>
                </button>
              </div>
            </div>

            {!isLoading && currentUser && (
              <TaskList
                tasks={filteredTasks}
                flatTasks={flatTasks}
                setTasks={setTasks}
              />
            )}
          </>
        ) : (
          <div>
            <Calendar
              localizer={localizer}
              events={flatTasks.map((task) => ({
                title: `${task.id}.${task.name}`,
                start: new Date(task.deadline),
                end: new Date(task.deadline),
              }))}
              components={{
                toolbar: ({ label, localizer: { messages }, onNavigate }) => {
                  return (
                    <div className="calendar-toolbar">
                      <button
                        type="button"
                        onClick={() => onNavigate(Navigate.TODAY)}
                      >
                        Today
                      </button>
                      <p>{label}</p>
                      <div className="navigation-buttons">
                        <button
                          type="button"
                          onClick={() => onNavigate(Navigate.PREVIOUS)}
                        >
                          &#60;
                        </button>
                        <button
                          type="button"
                          onClick={() => onNavigate(Navigate.NEXT)}
                        >
                          &#62;
                        </button>
                      </div>
                    </div>
                  );
                },
                event: (props) => {
                  const dotIndex = props.title.indexOf(".");
                  const taskIndex = flatTasks.findIndex((task) => {
                    return task.id === props.title.substring(0, dotIndex);
                  });
                  return (
                    taskIndex !== -1 && (
                      <Sheet>
                        <Sheet.Button>
                          <div className="event-block">
                            <i className="text-wrap">
                              {props.title.substring(dotIndex + 1)}
                            </i>
                          </div>
                        </Sheet.Button>
                        <Sheet.Body>
                          <EditTaskForm
                            task={flatTasks[taskIndex]}
                            onUpdate={(newTask) => {
                              const newTasks = [...flatTasks];
                              newTasks[taskIndex] = newTask;
                              setTasks(newTasks);
                            }}
                          />
                        </Sheet.Body>
                      </Sheet>
                    )
                  );
                },
              }}
              date={calendarDate}
              onNavigate={setCalendarDate}
              defaultView="month"
              views={{
                month: true,
              }}
              startAccessor="start"
              endAccessor="end"
              popup
              style={{ height: 500 }}
            />
          </div>
        )}
      </main>
    </>
  );
}
