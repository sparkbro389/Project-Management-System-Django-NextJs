/* =======================
   TYPES
======================= */

export type TaskStatus = "Backlog" | "In Progress" | "In Review" | "Done";

export type Priority = "Low" | "Medium" | "High" | "Critical";

export type ProjectStatus = "Active" | "On Hold" | "Completed";

/* =======================
   PROJECTS
======================= */

export const mockProjects = [
  {
    id: "p1",
    code: "PRJ-101",
    name: "Client Onboarding Portal",
    description: "Portal to onboard new enterprise clients.",
    status: "Active" as ProjectStatus,
    startDate: "2026-01-10",
    dueDate: "2026-02-20",
    progress: 65,
  },
  {
    id: "p2",
    code: "PRJ-102",
    name: "Nova Admin Panel",
    description: "Internal admin dashboard for Nova.",
    status: "On Hold" as ProjectStatus,
    startDate: "2026-01-01",
    dueDate: "2026-03-01",
    progress: 40,
  },
];

/* =======================
   TASKS (DEV)
======================= */

export const mockTasks = [
  {
    id: "t1",
    title: "Implement login validation",
    projectId: "p1",
    assigneeId: "u2", // current dev
    status: "In Progress" as TaskStatus,
    priority: "High" as Priority,
    estimatePoints: 5,
    dueDate: "2026-02-10",
  },
  {
    id: "t2",
    title: "Fix dashboard layout bug",
    projectId: "p2",
    assigneeId: "u2",
    status: "In Review" as TaskStatus,
    priority: "Medium" as Priority,
    estimatePoints: 3,
    dueDate: "2026-02-08",
  },
  {
    id: "t3",
    title: "Refactor API error handling",
    projectId: "p1",
    assigneeId: "u2",
    status: "Backlog" as TaskStatus,
    priority: "Low" as Priority,
    estimatePoints: 2,
    dueDate: "2026-02-20",
  },
];

/* =======================
   USERS (OPTIONAL – PM / TEAM)
======================= */

export const mockUsers = [
  {
    id: "u1",
    name: "Ahsan PM",
    email: "pm@nova.dev",
    role: "PM",
  },
  {
    id: "u2",
    name: "Ali Dev",
    email: "dev@nova.dev",
    role: "DEV",
  },
  {
    id: "u3",
    name: "Sara QA",
    email: "qa@nova.dev",
    role: "QA",
  },
];
