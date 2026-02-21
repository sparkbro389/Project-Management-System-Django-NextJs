"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { formatDate } from "@/app/lib/utils";

/* ===================== TYPES ===================== */

export type BugStatus =
  | "NEW"
  | "TRIAGED"
  | "IN_FIX"
  | "READY_TO_TEST"
  | "CLOSED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type Bug = {
  id: number;
  title: string;
  description: string;
  status: BugStatus;
  severity: Priority;
  project: {
    id: number;
    code: string;
    title: string;
  };
  created_at: string;
};

type Project = {
  id: number;
  code: string;
  title: string;
};

/* ===================== CONFIG ===================== */

const API_BASE = "http://localhost:8000/api";

/* ===================== COMPONENT ===================== */

export default function QABugs({ accessToken }: { accessToken: string }) {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BugStatus | "All">("All");
  const [severity, setSeverity] = useState<Priority | "All">("All");

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    description: "",
    severity: "MEDIUM" as Priority,
    project: "",
  });

  /* ---------------- FETCH DATA ---------------- */

  async function fetchData() {
    if (!accessToken) return;

    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };

      const [bugsRes, projectsRes] = await Promise.all([
        fetch(`${API_BASE}/bugs/qa/`, { headers }),
        fetch(`${API_BASE}/projects/qa/`, { headers }),
      ]);

      const bugsData = await bugsRes.json();
      const projectsData = await projectsRes.json();

      setBugs(Array.isArray(bugsData) ? bugsData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error("Failed to load bugs", err);
      setBugs([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  /* ---------------- CREATE BUG ---------------- */

  async function submitCreate() {
    try {
      const res = await fetch(`${API_BASE}/bugs/create/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          severity: draft.severity,
          project: Number(draft.project),
        }),
      });

      if (!res.ok) throw new Error("Create failed");

      setOpen(false);
      setDraft({
        title: "",
        description: "",
        severity: "MEDIUM",
        project: "",
      });

      fetchData();
    } catch (err) {
      alert("Failed to create bug");
    }
  }

  /* ---------------- FILTER ---------------- */

  const rows = useMemo(() => {
    return bugs
      .filter((b) => (status === "All" ? true : b.status === status))
      .filter((b) => (severity === "All" ? true : b.severity === severity))
      .filter((b) =>
        q.trim() ? b.title.toLowerCase().includes(q.toLowerCase()) : true
      );
  }, [bugs, q, status, severity]);

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="Bugs"
          subtitle="Search and triage reported bugs."
          right={
            <div className="flex gap-2">
              <Input
                className="w-64"
                placeholder="Search bugs..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="All">All Status</option>
                <option value="NEW">New</option>
                <option value="TRIAGED">Triaged</option>
                <option value="IN_FIX">In Fix</option>
                <option value="READY_TO_TEST">Ready to Test</option>
                <option value="CLOSED">Closed</option>
              </Select>

              <Select value={severity} onChange={(e) => setSeverity(e.target.value as any)}>
                <option value="All">All Severity</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </Select>

              <Button onClick={() => setOpen(true)}>Report Bug</Button>
            </div>
          }
        />

        {loading && <div className="text-sm text-slate-500">Loading bugs…</div>}

        <Table>
          <THead>
            <TR>
              <TH>Bug</TH>
              <TH>Project</TH>
              <TH>Status</TH>
              <TH>Severity</TH>
              <TH>Created</TH>
            </TR>
          </THead>

          <TBody>
            {rows.map((b) => (
              <TR key={b.id}>
                <TD>
                  <div className="font-semibold text-slate-900">
                    BUG-{b.id} — {b.title}
                  </div>
                  {b.description && (
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {b.description}
                    </div>
                  )}
                </TD>

                <TD>
                  <div className="font-medium">{b.project.code}</div>
                  <div className="text-xs text-slate-500">
                    {b.project.title}
                  </div>
                </TD>

                <TD>
                  <Badge>{b.status.replace("_", " ")}</Badge>
                </TD>

                <TD>
                  <Badge
                    tone={
                      b.severity === "CRITICAL"
                        ? "red"
                        : b.severity === "HIGH"
                        ? "yellow"
                        : "gray"
                    }
                  >
                    {b.severity}
                  </Badge>
                </TD>

                <TD>{formatDate(b.created_at)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>

        {!loading && rows.length === 0 && (
          <div className="text-sm text-slate-600">
            No bugs match your filters.
          </div>
        )}

        {/* ---------- CREATE BUG MODAL ---------- */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Report New Bug"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitCreate}>Create Bug</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              placeholder="Bug title"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
            />

            <textarea
              className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Describe the bug in detail..."
              value={draft.description}
              onChange={(e) =>
                setDraft((d) => ({ ...d, description: e.target.value }))
              }
            />

            <Select
              value={draft.project}
              onChange={(e) =>
                setDraft((d) => ({ ...d, project: e.target.value }))
              }
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.title}
                </option>
              ))}
            </Select>

            <Select
              value={draft.severity}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  severity: e.target.value as Priority,
                }))
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </Select>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
}
