export const TASKS: {
  id: string;
  componentKey: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}[] = [
  {
    id: "1",
    componentKey: "1-0",
    title: "Design Database Schema",
    description:
      "Create ER diagrams and define tables for the new user management system.",
    status: "Todo",
    priority: "High",
  },
  {
    id: "2",
    componentKey: "2-0",
    title: "Implement Auth Middleware",
    description: "Write JWT validation middleware for Express API routes.",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "3",
    componentKey: "3-0",
    title: "Update API Documentation",
    description: "Add new endpoints to Swagger documentation.",
    status: "Todo",
    priority: "Medium",
  },
  {
    id: "4",
    componentKey: "4-0",
    title: "Setup CI/CD Pipeline",
    description:
      "Configure GitHub Actions to build and deploy to staging environment.",
    status: "Done",
    priority: "Low",
  },
];
