"use client";

import {
  categories,
  priorities,
  TaskCategory,
  TaskPriority,
  Task,
} from "@/types";
import { formatDate } from "@/utils";
import { Calendar, Clock, Shapes } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../authContext";
import { useRouter } from "next/navigation";

export default function AddTaskForm({
  tasks,
  setTasks,
}: {
  tasks: Task[],
  setTasks: (tasks: Task[]) => void;
}) {
  const { currentUser, setCurrentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState<string>(new Date().toISOString());
  const [category, setCategory] = useState<TaskCategory>("Academic");
  const [priority, setPriority] = useState<TaskPriority>("High");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(false);

  const ReactQuill = useMemo(
    // from this domain, do this -> stores previous value, will not run from the start if same task = will just give previous calculated value
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const readyToSubmit = useMemo(
    () => title && deadline && priority && category,
    [title, deadline, priority, category]
  );

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!currentUser) return;

    const newTask: Task = {
      id: uuidv4(), // or use a UUID library
      name: title,
      category,
      priority,
      deadline,
      description,
      notes,
      reminder,
      completed: false,
    };

    setTasks([...tasks, newTask]);

    // Reset form
    setTitle("");
    setDeadline(new Date().toISOString());
    setCategory("Academic");
    setPriority("High");
    setDescription("");
    setNotes("");
    setReminder(false);
  };

  return (
    <form className="task-form-form">
      <input
        className="task-form-title"
        placeholder="Enter Title..."
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="task-form-deadline">
        <div>
          <Calendar />
          <p>Deadline</p>
        </div>
        <input
          type="datetime-local"
          value={formatDate(deadline)}
          onChange={(e) => setDeadline(new Date(e.target.value).toISOString())}
        />
      </div>
      <div className="task-form-priority">
        <div>
          <Shapes />
          <p>Category</p>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as TaskCategory)}
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
      <div className="task-form-category">
        <div>
          <Clock />
          <p>Priority</p>
        </div>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="task-form-notes">
        <p>General Notes</p>
        <div>
          <ReactQuill theme="snow" value={notes} onChange={setNotes} />
        </div>
      </div>
      <div className="task-form-reminder">
        <p>Set Reminder?</p>
        <input
          type="checkbox"
          checked={reminder}
          onChange={(e) => setReminder(e.target.checked)}
        />
      </div>
      <button
        onClick={handleOnSubmit}
        disabled={!readyToSubmit}
        className="task-form-submit"
        type="submit"
      >
        Add Task
      </button>
    </form>
  );
}
