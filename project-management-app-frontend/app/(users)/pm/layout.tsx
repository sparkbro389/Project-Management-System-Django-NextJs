import { AppShell } from "../../../components/app-shell/AppShell";

const nav = [
  {
    title: "Workspace",
    items: [
      { href: "/pm", label: "Overview" },
      { href: "/pm/projects", label: "Projects" },
      { href: "/pm/tasks", label: "tasks" },
      { href: "/pm/assignments", label: "Assignments" },
    ],
  },
  {
    title: "Management",
    items: [
      { href: "/pm/team", label: "Team" },
      { href: "/pm/settings", label: "Settings" },
    ],
  },
];

export default function PMLayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="PM" nav={nav} hint="Plan, assign, track delivery & quality." children={children} />;
}
