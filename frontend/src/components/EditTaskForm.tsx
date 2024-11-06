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
import { FormEvent, useMemo, useState } from "react";
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
  const { currentUser, setCurrentUser } = useAuth();
  const [title, setTitle] = useState(task.name);
  const [deadline, setDeadline] = useState<Date>(task.deadline);
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [description, setDescription] = useState(task.description);
  const [notes, setNotes] = useState(task.notes);
  const [reminder, setReminder] = useState(task.reminder);
  const [completed, setCompleted] = useState(task.completed);

  const ReactQuill = useMemo(
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

    const updatedTask = {
      id: task.id,
      name: title,
      deadline,
      category,
      priority,
      description,
      notes,
      reminder,
      completed,
    };

    onUpdate(updatedTask);

    const userRef = await doc(db, "users", currentUser.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) return;

    const currentTasks = userSnap.data().tasks || [];

    const taskIndex = currentTasks.findIndex(
      (task) => task.id === updatedTask.id
    );
    const updatedTasks = [...currentTasks];
    updatedTasks[taskIndex] = updatedTask;

    await updateDoc(userRef, {
      tasks: updatedTasks,
    });

    const updatedUser = {
      ...currentUser,
      tasks: updatedTasks,
    };
    setCurrentUser(updatedUser);
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
      <div className="task-form-reminder">
        <p>Mark as completed?</p>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
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
