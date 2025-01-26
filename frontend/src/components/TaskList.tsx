"use client";

import {
  categories,
  priorities,
  Task,
  TaskCategory,
  TaskPriority,
  FirestoreTask,
} from "@/types";
import { format } from "date-fns/format";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import Sheet from "./Sheet";
import EditTaskForm from "./EditTaskForm";
import { useAuth } from "../authContext";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

const ITEMS_PER_PAGE = 10;

export default function TaskList({
  tasks,
  flatTasks,
  setTasks,
}: {
  tasks: Task[];
  flatTasks: Task[];
  setTasks: (tasks: Task[]) => void;
}) {
  const [pageNumber, setPageNumber] = useState(0);

  const tasksChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < tasks.length; i += ITEMS_PER_PAGE) {
      const chunk = tasks.slice(i, i + ITEMS_PER_PAGE);
      chunks.push(chunk);
    }
    return chunks;
  }, [tasks]);

  const completedTaskLength = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  const updateTask = useCallback(
    (pageNumber: number, index: number, newTask: Task) => {
      // Change filtered tasks
      const newTasks = [...tasks];
      let targetTask = newTasks[pageNumber + index];
      targetTask = newTask;

      // Change flat tasks
      setTasks(flatTasks.map(task => 
        task.id === targetTask.id ? newTask : task
      ));
    },
    [tasks, flatTasks, setTasks]
  );

  const deleteTask = useCallback(
    (pageNumber: number, index: number) => {
      // Delete from filtered tasks
      const actualIndex = pageNumber * ITEMS_PER_PAGE + index;
      const newTasks = [...tasks];
      const targetTask = newTasks.splice(actualIndex, 1)[0];

      // Delete from flat tasks
      const newFlatTasks = [...flatTasks];
      setTasks(newFlatTasks.filter((task) => task.id !== targetTask.id));
    },
    [tasks, setTasks, tasksChunks]
  );

  const incrementPageNumber = () => {
    if (pageNumber < tasksChunks.length - 1) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const decrementPageNumber = () => {
    if (pageNumber > 0) {
      setPageNumber((prev) => prev - 1);
    }
  };

  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th>
              <p>Task</p>
              <ChevronsUpDown />
            </th>
            <th>
              <p>Category</p>
              <ChevronsUpDown />
            </th>
            <th>
              <p>Priority</p>
              <ChevronsUpDown />
            </th>
            <th>
              <p>Deadline</p>
              <ChevronsUpDown />
            </th>
            <th>
              <p>Delete?</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {tasksChunks.length !== 0 &&
            tasksChunks[pageNumber].map((task, index) => {
              return (
                <TaskRow
                  key={index}
                  task={task}
                  onUpdate={(task) => updateTask(pageNumber, index, task)}
                  onDelete={() => deleteTask(pageNumber, index)}
                />
              );
            })}
        </tbody>
      </table>
      <div className="completed">
        <p>
          Completed {completedTaskLength} out of {tasks.length}
        </p>
        <div id="page">
          <ChevronLeft onClick={decrementPageNumber} />
          <p>
            {pageNumber + 1} /{" "}
            {tasksChunks.length !== 0 ? tasksChunks.length : 1}
          </p>
          <ChevronRight onClick={incrementPageNumber} />
        </div>
      </div>
    </>
  );
}

const TaskRow = ({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
}) => {
  const [currentTask, setCurrentTask] = useState(task);

  useEffect(() => {
    onUpdate(currentTask);
  }, [currentTask]);

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  return (
    <tr className="list">
      <td data-column="task" id="task-list">
        <input
          className="list-checkbox"
          type="checkbox"
          id={`task-${task.id}`}
          checked={currentTask.completed}
          onChange={(e) =>
            setCurrentTask((prevTask) => ({
              ...prevTask,
              completed: e.target.checked,
            }))
          }
        />
        <Sheet>
          <Sheet.Button>
            <p className="task-row-name">{currentTask.name}</p>
          </Sheet.Button>
          <Sheet.Body>
            <EditTaskForm task={currentTask} onUpdate={setCurrentTask} />
          </Sheet.Body>
        </Sheet>
      </td>
      <td id="category-list">
        <div className="custom-select">
          <select
            value={currentTask.category}
            onChange={(e) =>
              setCurrentTask((prevTask) => ({
                ...prevTask,
                category: e.target.value as TaskCategory,
              }))
            }
            name="category"
            className="category-dropdown"
          >
            {categories.map((category) => {
              return (
                <option key={category} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
        </div>
      </td>
      <td id="priority-list">
        <div className="custom-select">
          <select
            value={currentTask.priority}
            onChange={(e) =>
              setCurrentTask((prevTask) => ({
                ...prevTask,
                priority: e.target.value as TaskPriority,
              }))
            }
            name="priority"
            className="priority-dropdown"
          >
            {priorities.map((priority) => {
              return (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              );
            })}
          </select>
        </div>
      </td>
      <td id="dline-list">
        <p>{format(currentTask.deadline, "MMMM do yyyy, HH:mm aaa")}</p>
      </td>
      <td id="delete-list">
        <Trash2 onClick={onDelete} />
      </td>
    </tr>
  );
};
