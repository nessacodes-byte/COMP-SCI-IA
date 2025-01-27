"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { formatDate } from "@/utils";
import { Calendar, Clock, Shapes } from "lucide-react";
import { categories, priorities, TaskCategory, TaskPriority } from "../types";

export type Filter = {
  startDate: string | undefined;
  endDate: string | undefined;
  category: TaskCategory | "";
  priority: TaskPriority | "";
};

export default function FilterTaskForm({
  filter: initialFilter,
  setFilter: setInitialFilter,
}: {
  filter?: Filter;
  setFilter: (filter: Filter) => void;
}) {
  const [filter, setFilter] = useState<Filter>({
    startDate: undefined,
    endDate: undefined,
    category: "",
    priority: "",
  });

  const readyToSubmit = useMemo(() => {
    if (filter.startDate && filter.endDate) {
      return new Date(filter.startDate) <= new Date(filter.endDate);
    } else if (
      (filter.startDate && !filter.endDate) ||
      (!filter.startDate && filter.endDate)
    ) {
      return false;
    } else {
      return true;
    }
  }, [filter.startDate, filter.endDate]);

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const handleOnSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setInitialFilter(filter);
    },
    [filter]
  );

  const handleReset = useCallback(
    (e) => {
      e.preventDefault();
      setFilter({
        startDate: undefined,
        endDate: undefined,
        category: "",
        priority: "",
      });
    },
    [filter]
  );

  return (
    <form className="filter-form-form">
      <div className="filter-form-start-date">
        <div>
          <Calendar />
          <p>Start Date</p>
        </div>
        <input
          type="datetime-local"
          value={formatDate(filter.startDate) ?? undefined}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              startDate: new Date(e.target.value).toISOString(),
            }))
          }
        />
      </div>
      <div className="filter-form-end-date">
        <div>
          <Calendar />
          <p>End Date</p>
        </div>
        <input
          type="datetime-local"
          value={formatDate(filter.endDate) ?? undefined}
          min={filter.startDate && formatDate(filter.startDate)}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              endDate: new Date(e.target.value).toISOString(),
            }))
          }
        />
      </div>
      <div className="filter-form-category">
        <div>
          <Shapes />
          <p>Category</p>
        </div>
        <select
          value={filter.category ?? ""}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              category: e.target.value as TaskCategory,
            }))
          }
          className="category-dropdown"
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => {
            return (
              <option key={category} value={category}>
                {category}
              </option>
            );
          })}
        </select>
      </div>
      <div className="filter-form-priority">
        <div>
          <Clock />
          <p>Priority</p>
        </div>
        <select
          value={filter.priority ?? ""}
          onChange={(e) =>
            setFilter((prevFilter) => ({
              ...prevFilter,
              priority: e.target.value as TaskPriority,
            }))
          }
          className="priority-dropdown"
        >
          <option value="" disabled>
            Select a priority
          </option>
          {priorities.map((priority) => {
            return (
              <option key={priority} value={priority}>
                {priority}
              </option>
            );
          })}
        </select>
      </div>
      <div className="filter-utility-buttons">
        <button
          onClick={handleReset}
          className="filter-form-reset"
          type="button"
        >
          Reset back to default
        </button>
        <button
          onClick={handleOnSubmit}
          disabled={!readyToSubmit}
          className="filter-form-submit"
          type="submit"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
