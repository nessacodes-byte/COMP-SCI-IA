"use client";

import {
  categories,
  priorities,
  Task,
  TaskCategory,
  TaskPriority,
} from "@/types";
import { format } from "date-fns/format";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Sheet from "./Sheet";
import EditTaskForm from "./EditTaskForm";

const TaskRow = ({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: () => void;
}) => {
  const [taskName, setTaskName] = useState(task.name);
  const [taskCategory, setTaskCategory] = useState(task.category);
  const [taskPriority, setTaskPriority] = useState(task.priority);
  const [taskDeadline, setTaskDeadline] = useState(task.deadline);
  const [taskDescription, setTaskDescription] = useState(task.description);
  const [taskNotes, setTaskNotes] = useState(task.notes);
  const [taskReminder, setTaskReminder] = useState(task.reminder);
  const [taskCompleted, setTaskCompleted] = useState(task.completed);

  useEffect(() => { //useEffect calls a function (that may not return a value) in the first argument when anything inside the dependency array changes
    setTaskName(task.name);
    setTaskCategory(task.category);
    setTaskPriority(task.priority);
    setTaskDeadline(task.deadline);
    setTaskDescription(task.description);
    setTaskNotes(task.notes);
    setTaskReminder(task.reminder);
    setTaskCompleted(task.completed);
  }, [task]);

  useEffect(() => {
    onUpdate({
      id: task.id,
      name: taskName,
      deadline: taskDeadline,
      category: taskCategory,
      priority: taskPriority,
      description: taskDescription,
      notes: taskNotes,
      reminder: taskReminder,
      completed: taskCompleted,
    });
  }, [taskName, taskCategory, taskPriority, taskDeadline, taskCompleted]);

  return (
    <tr className="list">
      <td data-column="task" id="task-list">
        <input
          className="list-checkbox"
          type="checkbox"
          id={`task-${task.id}`}
          checked={taskCompleted}
          onChange={(e) => setTaskCompleted(e.target.checked)}
        />
        <Sheet>
          <Sheet.Button>
            <p className="task-row-name">{taskName}</p>
          </Sheet.Button>
          <Sheet.Body>
            <EditTaskForm task={task} onUpdate={onUpdate} />
          </Sheet.Body>
        </Sheet>
      </td>
      <td id="category-list">
        <div className="custom-select">
          <select
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
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
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
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
        <p>{format(taskDeadline, "MMMM do yyyy, HH:mm aaa")}</p>
      </td>
      <td id="delete-list">
        <Trash2 onClick={onDelete} />
      </td>
    </tr>
  );
};

const ITEMS_PER_PAGE = 10;

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [allTasks, setAllTasks] = useState(tasks);
  const [pageNumber, setPageNumber] = useState(0);

  const tasksChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < allTasks.length; i += ITEMS_PER_PAGE) {
      const chunk = allTasks.slice(i, i + ITEMS_PER_PAGE);
      chunks.push(chunk);
    }
    return chunks;
  }, [allTasks]);

  const completedTaskLength = useMemo(
    () => allTasks.filter((task) => task.completed).length,
    [allTasks]
  );

  const updateTask = (pageNumber: number, index: number, task: Task) => {
    setAllTasks((currentTasks) => {
      const newTasks = [...currentTasks];
      newTasks[pageNumber + index] = task;
      return newTasks;
    });
  };

  const deleteTask = (pageNumber: number, index: number) => {
    setAllTasks((currentTasks) => {
      const newTasks = [...currentTasks];
      newTasks.splice(pageNumber + index, 1);
      return newTasks;
    });
  };

  const incrementPageNumber = () => {
    if (1 <= pageNumber && pageNumber <= tasksChunks.length - 1) {
      setPageNumber((prev) => prev + 1);
    }
  };

  const decrementPageNumber = () => {
    if (1 <= pageNumber && pageNumber <= tasksChunks.length - 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  return (
    <>
      <table className="table">
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
        {tasksChunks.length !== 0 &&
          tasksChunks[pageNumber].map((task, index) => {
            return (
              <TaskRow
                onUpdate={(task) => updateTask(pageNumber, index, task)}
                onDelete={() => deleteTask(pageNumber, index)}
                key={index}
                task={task}
              />
            );
          })}
      </table>
      <div className="completed">
        <p>
          Completed {completedTaskLength} out of {allTasks.length}
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
