import { useState } from "react";
import { TaskItem } from "@/components/task-item";
import { TASKS } from "@/utils/data";
import { ControlPanel } from "@/components/control-panel";

export const HomePage = () => {
  const [tasks, setTasks] = useState<any[]>(TASKS);
  const [filter, setFilter] = useState<any>("All");
  const [sortOrder, setSortOrder] = useState<any>("Default");
  const [isReversed, setIsReversed] = useState(false);

  const handleAddTask = (title: any, priority: any) => {
    const newId = Date.now().toString();
    const newTask: any = {
      id: newId,
      componentKey: `${newId}-0`,
      title: title,
      description: "No description provided",
      status: "Todo",
      priority: priority,
    };

    setTasks([newTask, ...tasks]);
  };

  const handleRemoveTask = (id: any) => {
    setTasks(tasks.filter((t: any) => t.id !== id));
  };

  const handleStatusChange = (id: any, newStatus: any) => {
    setTasks(
      tasks.map((t: any) => (t.id === id ? { ...t, status: newStatus } : t)),
    );
  };

  const handleResetTaskState = (id: any) => {
    setTasks(
      tasks.map((t: any) => {
        if (t.id === id) {
          const [base, version] = t.componentKey.split("-");
          return { ...t, componentKey: `${base}-${parseInt(version) + 1}` };
        }
        return t;
      }),
    );
  };

  let displayTasks = tasks.filter(
    (t: any) => filter === "All" || t.status === filter,
  );

  if (sortOrder === "TitleAsc") {
    displayTasks.sort((a: any, b: any) => a.title.localeCompare(b.title));
  } else if (sortOrder === "TitleDesc") {
    displayTasks.sort((a: any, b: any) => b.title.localeCompare(a.title));
  }

  if (isReversed) {
    displayTasks.reverse();
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="my-4">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Project Tasks
        </h1>
      </header>

      <ControlPanel
        onAddTask={handleAddTask}
        filter={filter}
        setFilter={setFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isReversed={isReversed}
        setIsReversed={setIsReversed}
      />

      <div className="space-y-4">
        {displayTasks.length === 0 ? (
          <div className="text-center text-gray-500">
            No tasks found matching your criteria.
          </div>
        ) : (
          displayTasks.map((task: any) => (
            <TaskItem
              key={task.componentKey}
              task={task}
              onRemove={handleRemoveTask}
              onStatusChange={handleStatusChange}
              onResetState={handleResetTaskState}
            />
          ))
        )}
      </div>
    </div>
  );
};
