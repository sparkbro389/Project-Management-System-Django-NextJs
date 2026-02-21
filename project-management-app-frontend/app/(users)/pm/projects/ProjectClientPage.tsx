"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { Project, ProjectStatus } from "@/app/features/projects/projects.types";
import { formatDate } from "@/app/lib/utils";

const API_BASE = "http://localhost:8000/api";

/* ---------------- COMPONENT ---------------- */

export default function PMProjects({
  accessToken,
}: {
  accessToken: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "All">("All");

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    project_description: "",
    status: "Active" as ProjectStatus,
    due_date: "",
  });

  /* ---------------- FETCH PROJECTS ---------------- */

  async function fetchProjects() {
    setLoading(true);
    try {
      if (!accessToken) throw new Error("No access token");
      
      const res = await fetch(`${API_BASE}/projects/pm/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ---------------- CREATE PROJECT ---------------- */

  async function submitCreate() {
    try {
      if (!accessToken) throw new Error("No access token");

      const res = await fetch(`${API_BASE}/projects/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(draft),
      });
      console.log(res.json())
      if (!res.ok) throw new Error("Create failed");

      setOpen(false);
      setDraft({
        title: "",
        project_description: "",
        status: "Active",
        due_date: "",
      });

      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  }

  /* ---------------- FILTER ---------------- */

  const rows = useMemo(() => {
    return projects
      .filter((p) => (status === "All" ? true : p.status === status))
      .filter((p) =>
        q.trim() ? p.title.toLowerCase().includes(q.toLowerCase()) : true
      );
  }, [projects, q, status]);

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="Projects"
          subtitle="Search, filter, and manage projects."
          right={
            <div className="flex gap-2">
              <Input
                className="w-64"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects..."
              />
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </Select>
              <Button onClick={() => setOpen(true)}>Create Project</Button>
            </div>
          }
        />

        {loading && (
          <div className="text-sm text-slate-500">Loading projects…</div>
        )}

        <div className="grid gap-3">
          {rows.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    tone={
                      p.status === "Active"
                        ? "green"
                        : p.status === "On Hold"
                        ? "yellow"
                        : "gray"
                    }
                  >
                    {p.status}
                  </Badge>

                  <div className="text-base font-semibold text-slate-900 mt-1">
                    {p.title}
                  </div>

                  <div className="text-sm text-slate-600 mt-1">
                    {p.project_description}
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  Due:{" "}
                  <span className="font-medium text-slate-900">
                    {formatDate(p.due_date)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {!loading && rows.length === 0 && (
            <div className="text-sm text-slate-600">
              No projects match your filters.
            </div>
          )}
        </div>

        {/* CREATE PROJECT MODAL */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Create New Project"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitCreate}>Create Project</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              placeholder="Project title"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
            />

            <Input
              placeholder="Project description"
              value={draft.project_description}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  project_description: e.target.value,
                }))
              }
            />

            <Input
              type="date"
              value={draft.due_date}
              onChange={(e) =>
                setDraft((d) => ({ ...d, due_date: e.target.value }))
              }
            />

            <Select
              value={draft.status}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  status: e.target.value as ProjectStatus,
                }))
              }
            >
              <option value="Active">Active</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </Select>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
}
