import { AppShell } from "@/components/app-shell/AppShell";

const nav = [
  {
    title: "Workspace",
    items: [
      { href: "/qa", label: "Overview" },
      { href: "/qa/test-runs", label: "Test Runs" },
      { href: "/qa/bugs", label: "Bugs" },
      { href: "/qa/my-projects", label: "My Projects" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { href: "/qa/settings", label: "Settings" },
    ],
  },
];

export default function QALayout({ children }: { children: React.ReactNode }) {
  return <AppShell role="QA" nav={nav} hint="Verify releases, log bugs, protect quality." children={children} />;
}
