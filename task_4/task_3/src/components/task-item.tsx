import { cn } from "@/utils/cn";
import { useState } from "react";
export const TaskItem = ({
  task,
  onRemove,
  onStatusChange,
  onResetState,
}: any) => {
  const [timeSpent, setTimeSpent] = useState(0);

  const [isExpanded, setIsExpanded] = useState(false);

  console.log(`Render TaskItem: ${task.title} (ID: ${task.id})`);

  return (
    <div className="bg-white border border-slate-200 shadow-sm p-4 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-lg text-slate-800">
              {task.title}
            </h3>
            <span
              className={cn(
                "px-2 py-0.5 text-xs font-medium",
                task.priority === "High"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "Medium"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700",
              )}
            >
              {task.priority}
            </span>
          </div>

          <div className="text-sm text-slate-500 mb-3">
            <span className="font-medium">Status:</span>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task.id, e.target.value)}
              className="ml-2 border border-slate-300 px-1 py-0.5 text-slate-700 bg-white"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Time spent:</span>
              <span className="bg-slate-100 px-2 py-1 font-mono">
                {timeSpent}h
              </span>
              <button
                onClick={() => setTimeSpent((prev) => prev + 1)}
                className="text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:bg-indigo-50 px-2 py-0.5"
              >
                +1h
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
          >
            {isExpanded ? "Hide Details" : "Show Details"}
          </button>

          <button
            onClick={() => onResetState(task.id)}
            className="text-sm px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            title="Reset component's local state by updating its key from parent"
          >
            Reset State
          </button>

          <button
            onClick={() => onRemove(task.id)}
            className="text-sm px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 text-slate-600 text-sm">
          <p>{task.description}</p>
        </div>
      )}
    </div>
  );
};
