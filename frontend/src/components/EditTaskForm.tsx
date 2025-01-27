"use client";

import {
  categories,
  priorities,
  Task,
  TaskCategory,
  TaskPriority,
} from "@/types";
import { formatDate } from "@/utils";
import { Calendar, Clock, Shapes } from "lucide-react";
import { FormEvent, useMemo, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useAuth } from "../authContext";

export default function EditTaskForm({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: (task: Task) => void;
}) {
  const [currentTask, setCurrentTask] = useState(task);

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const readyToSubmit = useMemo(
    () => currentTask.name && currentTask.deadline && currentTask.priority && currentTask.category,
    [currentTask]
  );

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    onUpdate(currentTask);
  };

  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  return (
    <form className="task-form-form">
      <input
        className="task-form-title"
        placeholder="Enter Title..."
        type="text"
        value={currentTask.name}
        onChange={(e) => setCurrentTask((prevTask) => ({ ...prevTask, name: e.target.value }))}
      />
      <div className="task-form-deadline">
        <div>
          <Calendar />
          <p>Deadline</p>
        </div>
        <input
          type="datetime-local"
          value={formatDate(currentTask.deadline)}
          onChange={(e) => setCurrentTask((prevTask) => ({ ...prevTask, deadline: new Date(e.target.value).toISOString() }))}
        />
      </div>
      <div className="task-form-category">
        <div>
          <Shapes />
          <p>Category</p>
        </div>
        <select
          value={currentTask.category}
          onChange={(e) => setCurrentTask((prevTask) => ({ ...prevTask, category: e.target.value as TaskCategory }))}
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
      <div className="task-form-priority">
        <div>
          <Clock />
          <p>Priority</p>
        </div>
        <select
          value={currentTask.priority}
          onChange={(e) => setCurrentTask((prevTask) => ({ ...prevTask, priority: e.target.value as TaskPriority }))}
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
      <div className="task-form-description">
        <p>Description</p>
        <textarea
          placeholder="Enter description..."
          value={currentTask.description}
          onChange={(e) => setCurrentTask((prevTask) => ({ ...prevTask, description: e.target.value }))}
        />
      </div>
      <div className="task-form-notes">
        <p>General Notes</p>
        <div>
          <ReactQuill theme="snow" value={currentTask.notes} onChange={(notes) => setCurrentTask((prevTask) => ({ ...prevTask, notes: notes }))} />
        </div>
      </div>
      <div className="task-form-reminder">
        <p>Set Reminder?</p>
        <input
          type="checkbox"
          checked={currentTask.reminder}
          onChange={(e) => setCurrentTask((prevTask) => ({ ...prevTask, reminder: e.target.checked }))}
        />
      </div>
      <div className="task-form-reminder">
        <p>Mark as completed?</p>
        <input
          type="checkbox"
          checked={currentTask.completed}
          onChange={(e) => setCurrentTask((prevTask) => ({ ...prevTask, completed: e.target.checked }))}
        />
      </div>
      <button
        onClick={handleOnSubmit}
        disabled={!readyToSubmit}
        className="task-form-submit"
        type="submit"
      >
        Save Task
      </button>
    </form>
  );
}
