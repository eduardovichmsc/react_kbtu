console.log("=== 1. Variables and Data Types ===");
const studentName = "Alex";
let studentAge = 20;
let isActive = true;
const courses = ["Math", "React"];
const address = { city: "Almaty" };

console.log(studentName, typeof studentName);
console.log(studentAge, typeof studentAge);
console.log(isActive, typeof isActive);
console.log(courses, typeof courses);
console.log(address, typeof address);

const emptyValue = null;
let notAssigned;
console.log(
  `Student ${studentName} is ${studentAge} years old and lives in ${address.city}.`,
);

console.log("2. Arrays");
const nums = [3, 7, 2, 10, 5];
console.log(
  "Multiply by 2:",
  nums.map((n) => n * 2),
);
console.log(
  "Greater than 5:",
  nums.filter((n) => n > 5),
);
console.log(
  "First greater than 5:",
  nums.find((n) => n > 5),
);
console.log(
  "Sum:",
  nums.reduce((acc, curr) => acc + curr, 0),
);
console.log("Includes 10:", nums.includes(10));

console.log("3. Arrays of Objects");
const students = [
  { id: 1, name: "Anna", grade: 85 },
  { id: 2, name: "John", grade: 62 },
  { id: 3, name: "Sara", grade: 91 },
  { id: 4, name: "Mike", grade: 55 },
];

console.log(
  "Grade >= 70:",
  students.filter((s) => s.grade >= 70),
);
console.log(
  "Names:",
  students.map((s) => s.name),
);
console.log(
  "ID = 3:",
  students.find((s) => s.id === 3),
);
console.log(
  "Highest grade:",
  students.reduce((max, s) => (s.grade > max.grade ? s : max), students[0]),
);
const avgGrade =
  students.reduce((sum, s) => sum + s.grade, 0) / students.length;
console.log("Average grade:", avgGrade);
console.log(
  "Passed (>= 60):",
  students.map((s) => ({ ...s, passed: s.grade >= 60 })),
);

console.log("4. Objects");
const user = {
  id: 101,
  name: "David",
  age: 25,
  address: { city: "Astana", street: "Abay Ave" },
};
console.log("Name & City:", user.name, user.address.city);
user.age = 26; // Change age
user.email = "david@example.com"; // Add email
delete user.address.street; // Remove street

const { name: destrName, age: destrAge } = user;
const {
  address: { city: destrCity },
} = user;
const { name: userName } = user;
console.log("Destructuring:", userName, destrAge, destrCity);

console.log("5. Values and References");
const original = { name: "Alice", score: 10 };
const copy = original;
copy.score = 20;
console.log("Original score (changed!):", original.score);

const spreadCopy = { ...original };
spreadCopy.score = 99;
console.log(
  "Original after spread change:",
  original.score,
  "| Spread copy:",
  spreadCopy.score,
);

const nestedUser = { name: "Alice", address: { city: "Almaty" } };
// Correct way to copy nested objects:
const deepCopyUser = { ...nestedUser, address: { ...nestedUser.address } };
deepCopyUser.address.city = "Astana";
console.log(
  "Nested Original City:",
  nestedUser.address.city,
  "| Deep Copy City:",
  deepCopyUser.address.city,
);

console.log("6. Functions");
function isEven(number) {
  return number % 2 === 0;
}
const getFullName = (firstName, lastName) => `${firstName} ${lastName}`;
const calculatePrice = (price, quantity) => price * quantity;
const calculateDiscount = (price, percent) => price - price * (percent / 100);
const getMax = (a, b) => (a > b ? a : b);
console.log("isEven(4):", isEven(4));
console.log("getMax(10, 20):", getMax(10, 20));

console.log("7. Functions as Values");
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const calculate = (a, b, operation) => operation(a, b);
console.log("Calculate Add:", calculate(5, 3, add));
console.log("Calculate Multiply:", calculate(5, 3, multiply));

console.log("8. Scope");
const globalMessage = "global";
function testScope() {
  const fnMessage = "function";
  if (true) {
    const blockMessage = "block";
    var varMessage = "var is function scoped";
    console.log("Inside block:", globalMessage, fnMessage, blockMessage);
  }
  console.log("Outside block (var works):", varMessage);
  // console.log(blockMessage); // This would cause an error (let/const are block scoped)
}
testScope();

console.log("9. Closure");
function createCounter() {
  let count = 0;
  return () => ++count;
}
const counter1 = createCounter();
console.log("Counter1:", counter1(), counter1(), counter1());
const counter2 = createCounter();
console.log("Counter2 (independent):", counter2());

function createAdder(value) {
  return (num) => value + num;
}
const addFive = createAdder(5);
console.log("AddFive(10):", addFive(10));
console.log("AddFive(20):", addFive(20));

console.log("10. Destructuring, Spread and Rest");
const numbers = [10, 20, 30, 40];
const [firstNum, secondNum] = numbers;
console.log("First two:", firstNum, secondNum);

const u = { id: 1, name: "Anna", age: 21 };
const { name: uName, age: uAge } = u;

const newNumbers = [...numbers, 50];
const newUser = { ...u, age: 22 };
const userWithEmail = { ...u, email: "anna@mail.com" };
const combinedArrays = [...numbers, ...newNumbers];

function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr, 0);
}
console.log("Rest Sum:", sum(1, 2, 3, 4));

console.log("11. Optional Chaining and Default Values");
const u1 = { name: "Bob", address: { city: "Paris" } };
const u2 = { name: "Tom" }; // No address
console.log("City 1:", u1.address?.city ?? "City not specified");
console.log("City 2:", u2.address?.city ?? "City not specified");

console.log("0 || 10 =>", 0 || 10); // 10 (falsy)
console.log("0 ?? 10 =>", 0 ?? 10); // 0 (not null/undefined)

console.log("FINAL TASK");
const finalStudents = [
  { id: 1, name: "Ali", age: 20, grades: [80, 90, 85] },
  { id: 2, name: "Bea", age: 22, grades: [50, 60, 55] },
  { id: 3, name: "Cam", age: 21, grades: [95, 100, 98] },
  { id: 4, name: "Dan", age: 23, grades: [40, 45, 50] },
  { id: 5, name: "Eva", age: 20, grades: [70, 75, 80] },
];

const getAverage = (grades) =>
  grades.reduce((a, b) => a + b, 0) / grades.length;
const getStudentAverage = (student) => getAverage(student.grades);
const getPassedStudents = (studentsList) =>
  studentsList.filter((s) => getStudentAverage(s) >= 60);
const getStudentNames = (studentsList) => studentsList.map((s) => s.name);
const findStudent = (studentsList, id) => studentsList.find((s) => s.id === id);
const getTopStudent = (studentsList) =>
  studentsList.reduce(
    (top, s) => (getStudentAverage(s) > getStudentAverage(top) ? s : top),
    studentsList[0],
  );

const processedStudents = finalStudents.map((student) => {
  const avg = getStudentAverage(student);
  return {
    id: student.id,
    name: student.name,
    average: Number(avg.toFixed(2)),
    passed: avg >= 60,
  };
});

console.log("Top Student:", getTopStudent(finalStudents));
console.log("Final Processed Array:", processedStudents);
console.log("Original Array is untouched:", finalStudents);
