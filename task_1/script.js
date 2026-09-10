function createTask(name) {
  let count = 0;

  return {
    name,
    run: function () {
      count++;
      return new Promise((resolve, reject) => {
        const time = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        setTimeout(() => {
          if (Math.random() < 0.3) {
            reject(new Error("Failed"));
          } else {
            resolve("Completed");
          }
        }, time);
      });
    },
    getCount: () => count,
    reset: () => {
      count = 0;
    },
  };
}

const tasks = [
  createTask("Load Users"),
  createTask("Load Posts"),
  createTask("Load Comments"),
];

const tasksContainer = document.getElementById("tasks-container");
const statusMessage = document.getElementById("status-message");
const consoleOutput = document.getElementById("console-output");

function renderTasks() {
  tasksContainer.innerHTML = "";
  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";
    div.innerHTML = `
            <span>${task.name} (Runs: ${task.getCount()})</span>
            <span id="task-status-${index}">Ready</span>
        `;
    tasksContainer.appendChild(div);
  });
}

function updateTaskUI(index, status, className) {
  const statusSpan = document.getElementById(`task-status-${index}`);
  statusSpan.textContent = status;
  statusSpan.className = className;
}

function logToScreen(msg) {
  consoleOutput.textContent += msg + "\n";
}

document.getElementById("run-all-btn").addEventListener("click", async () => {
  statusMessage.textContent = "Running all tasks...";
  tasks.forEach((_, i) => updateTaskUI(i, "Loading...", "status-loading"));
  renderTasks();

  const promises = tasks.map(async (task, index) => {
    try {
      await task.run();
      updateTaskUI(index, "Completed", "status-completed");
    } catch (error) {
      updateTaskUI(index, "Failed", "status-failed");
    }
  });

  await Promise.allSettled(promises);
  statusMessage.textContent = "Tasks finished";
  renderTasks();
});

document.getElementById("compare-btn").addEventListener("click", async () => {
  consoleOutput.textContent = "";

  logToScreen("Sequential Execution");
  const startSeq = performance.now();
  for (const task of tasks) {
    try {
      await task.run();
    } catch (e) {}
  }
  const endSeq = performance.now();
  logToScreen(`Sequential time: ${(endSeq - startSeq).toFixed(2)} ms`);

  logToScreen("Concurrent Execution");
  const startConc = performance.now();
  const concurrentPromises = tasks.map((t) => t.run().catch((e) => {}));
  await Promise.all(concurrentPromises);
  const endConc = performance.now();
  logToScreen(`Concurrent time: ${(endConc - startConc).toFixed(2)} ms`);
});

document.getElementById("event-loop-btn").addEventListener("click", () => {
  consoleOutput.textContent =
    "Expected Output:\n1. Sync Start\n2. Async Start\n3. Sync End\n4. Promise 1\n5. Promise 2\n6. Async End\n7. Timer 1\n8. Timer 2\n\nActual Output:\n";

  console.log("1. Sync Start");
  logToScreen("1. Sync Start");

  setTimeout(() => {
    console.log("7. Timer 1");
    logToScreen("7. Timer 1");
  }, 0);

  setTimeout(() => {
    console.log("8. Timer 2");
    logToScreen("8. Timer 2");
  }, 0);

  Promise.resolve().then(() => {
    console.log("4. Promise 1");
    logToScreen("4. Promise 1");
  });

  Promise.resolve().then(() => {
    console.log("5. Promise 2");
    logToScreen("5. Promise 2");
  });

  async function runAsync() {
    console.log("2. Async Start");
    logToScreen("2. Async Start");
    await Promise.resolve();
    console.log("6. Async End");
    logToScreen("6. Async End");
  }

  runAsync();

  console.log("3. Sync End");
  logToScreen("3. Sync End");
});

renderTasks();
