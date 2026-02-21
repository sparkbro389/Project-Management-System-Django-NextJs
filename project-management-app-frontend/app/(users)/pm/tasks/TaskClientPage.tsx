"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/app/lib/utils";

const API_BASE = "http://localhost:8000/api";

/* ---------------- TYPES ---------------- */

type TaskStatus = "BACKLOG" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type Task = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  due_date: string | null;
  project: { id: number; title: string };
  assignee: { id: number; name: string } | null;
};

type Project = { id: number; title: string };
type User = { id: number; name: string };

export default function PMTasks({ accessToken }: { accessToken: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TaskStatus | "All">("All");

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState<null | Task>(null);

  const [draft, setDraft] = useState({
    title: "",
    description: "",
    status: "BACKLOG" as TaskStatus,
    priority: "MEDIUM" as Priority,
    project: "",
    assignee: "",
    due_date: "",
  });

  /* ---------------- FETCH ---------------- */

  async function fetchAll() {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const [t, p, d, q] = await Promise.all([
        fetch(`${API_BASE}/tasks/list/`, { headers }),
        fetch(`${API_BASE}/projects/pm/`, { headers }),
        fetch(`${API_BASE}/users/developers/`, { headers }),
        fetch(`${API_BASE}/users/qas/`, { headers }),
      ]);

      setTasks(await t.json());
      setProjects(await p.json());
      setUsers([...(await d.json()), ...(await q.json())]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  /* ---------------- CREATE ---------------- */

  async function submitCreate() {
    await fetch(`${API_BASE}/tasks/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...draft,
        project: Number(draft.project),
        assignee: draft.assignee ? Number(draft.assignee) : null,
      }),
    });

    setOpenCreate(false);
    setDraft({
      title: "",
      description: "",
      status: "BACKLOG",
      priority: "MEDIUM",
      project: "",
      assignee: "",
      due_date: "",
    });

    fetchAll();
  }

  /* ---------------- DELETE ---------------- */

  async function confirmDelete() {
    if (!openDelete) return;

    await fetch(`${API_BASE}/tasks/${openDelete.id}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setOpenDelete(null);
    fetchAll();
  }

  /* ---------------- FILTER ---------------- */

  const rows = useMemo(() => {
    return tasks
      .filter((t) => (status === "All" ? true : t.status === status))
      .filter((t) =>
        q ? t.title.toLowerCase().includes(q.toLowerCase()) : true
      );
  }, [tasks, q, status]);

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="Tasks"
          subtitle="Create, track, and complete tasks."
          right={
            <div className="flex gap-2">
              <Input
                className="w-64"
                placeholder="Search tasks…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="All">All Status</option>
                <option value="BACKLOG">Backlog</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="IN_REVIEW">In Review</option>
                <option value="DONE">Done</option>
              </Select>
              <Button onClick={() => setOpenCreate(true)}>Create Task</Button>
            </div>
          }
        />

        {loading && <div className="text-sm text-slate-500">Loading tasks…</div>}

        <div className="grid gap-3">
          {rows.map((t) => (
            <div key={t.id} className="rounded-xl border bg-white p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <div className="flex gap-2">
                    <Badge>{t.status.replace("_", " ")}</Badge>
                    <Badge tone="yellow">{t.priority}</Badge>
                  </div>

                  <div className="font-semibold mt-1">{t.title}</div>
                  <div className="text-sm text-slate-600">{t.description}</div>

                  <div className="text-xs text-slate-500 mt-2">
                    Project: {t.project.title}
                    {t.assignee && ` • Assigned to ${t.assignee.name}`}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm">
                    Due: {t.due_date ? formatDate(t.due_date) : "—"}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => setOpenDelete(t)}
                  >
                    Mark Complete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE MODAL */}
        <Modal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          title="Create Task"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpenCreate(false)}>
                Cancel
              </Button>
              <Button onClick={submitCreate}>Create</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input placeholder="Title" value={draft.title} onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))} />
            <Input placeholder="Description" value={draft.description} onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))} />

            <Select value={draft.status} onChange={(e) => setDraft(d => ({ ...d, status: e.target.value as TaskStatus }))}>
              <option value="BACKLOG">Backlog</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="DONE">Done</option>
            </Select>

            <Select value={draft.priority} onChange={(e) => setDraft(d => ({ ...d, priority: e.target.value as Priority }))}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </Select>

            <Select value={draft.project} onChange={(e) => setDraft(d => ({ ...d, project: e.target.value }))}>
              <option value="">Select Project</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </Select>

            <Select value={draft.assignee} onChange={(e) => setDraft(d => ({ ...d, assignee: e.target.value }))}>
              <option value="">Assign To</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>

            <Input type="date" value={draft.due_date} onChange={(e) => setDraft(d => ({ ...d, due_date: e.target.value }))} />
          </div>
        </Modal>

        {/* DELETE CONFIRM */}
        <Modal
          open={!!openDelete}
          onClose={() => setOpenDelete(null)}
          title="Mark task as complete?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpenDelete(null)}>
                Cancel
              </Button>
              <Button onClick={confirmDelete}>Yes, Complete</Button>
            </>
          }
        >
          This action will permanently delete the task.
        </Modal>
      </CardContent>
    </Card>
  );
}
