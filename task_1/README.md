# Task 1

**How your closure keeps the task counter private**

- createTask function defines a local variable count.
- It returns an object with methods run, getCount, reset that reference count.
- Because these methods are defined in the same scope, they retain access to count even after createTask has finished executing, but code thats outside cannot access or modify count directly.

**How the call stack works in one example from your application**

- When the user clicks the "Compare" button, the event listener is pushed to the Call Stack.
- Then, inside it calls performance.now(), which pushes onto the stack, executed, and immediately popped off.
- Then, task.run() is called, pushed to the stack, initiates the Promise, and gets popped off, leaving the stack empty while waiting.

**How JavaScript can continue while setTimeout is waiting**

- setTimeout is provided by the Web APIs.
- setTimeout delegates the timer to the Web API and immediately moves on to the next line of code, allowing the main thread to continue processing.

**Your predicted and actual Event Loop output**

- **Predicted:** Sync Start -> Async Start -> Sync End -> Promise 1 -> Promise 2 -> Async End -> Timer 1 -> Timer 2.
- **Actual Output:** Matches exactly.
- **Explanation:** Async function executes synchronously until the first await. Promises and the code after await go to the Microtask Queue. setTimeout callbacks go to the Macrotask Queue. The Event Loop clears the Microtask Queue completely before moving to the Task Queue.

**The difference between tasks and microtasks**

- **Macrotasks:** setTimeout, setInterval, UI events. The Event Loop processes one task, then checks the microtask queue.
- **Microtasks:** Promises .then, .catch and queueMicrotask(). The Event Loop will empty the entire Microtask Queue before executing the next Macrotask.

**How you handle multiple Promises and errors**

- In the "Run All Tasks" feature, I use Promise.allSettled().
- This allows all tasks to run concurrently and waits for every single one to finish, regardless of whether they resolve (Complete) or reject (Fail), avoiding unhandled promise rejections.

**The difference between sequential and concurrent execution**

- **Sequential:** await inside a for...of loop forces JS to pause at each task. Task 2 only starts after Task 1 finishes.
- **Concurrent:** Promise.all() or Promise.allSettled(), all timers start simultaneously. The total execution time is roughly equal to the duration of the single longest task.
