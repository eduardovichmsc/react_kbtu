import { useState } from "react";

export const ControlPanel = ({
  onAddTask,
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
  isReversed,
  setIsReversed,
}: any) => {
  const [newTaskTitle, setNewTaskTitle] = useState<any>("");
  const [newTaskPriority, setNewTaskPriority] = useState<any>("Medium");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle, newTaskPriority);
    setNewTaskTitle("");
    setNewTaskPriority("Medium");
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Top */}
      <div className="flex flex-col md:flex-row md:items-end gap-4">
        <form onSubmit={handleSubmit} className="flex-1 flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Type here"
              className="w-full border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="w-full border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 transition"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Bottom */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-slate-300 px-2 py-1 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">Sort:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-slate-300 px-2 py-1 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Default">Default</option>
            <option value="TitleAsc">Title (A-Z)</option>
            <option value="TitleDesc">Title (Z-A)</option>
          </select>
        </div>

        {/* <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsReversed(!isReversed)}
            className={`text-sm px-3 py-1.5 font-medium border transition-colors ${
              isReversed
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {isReversed ? "Un-reverse List" : "Reverse List"}
          </button>
        </div> */}
      </div>
    </div>
  );
};
