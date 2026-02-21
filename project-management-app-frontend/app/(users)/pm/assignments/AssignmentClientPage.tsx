"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Buttons";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";

import { Project, User } from "@/app/features/projects/projects.types";

/* ---------------- TYPES ---------------- */

type AssignDraft = {
  projectId: number | null;
  devIds: number[];
  qaIds: number[];
};

type ApiError = { detail?: string };

const API_BASE = "http://localhost:8000/api";

/* ---------------- COMPONENT ---------------- */

export default function PMAssignments({
  accessToken,
}: {
  accessToken: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<User[]>([]);
  const [qas, setQAs] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AssignDraft>({
    projectId: null,
    devIds: [],
    qaIds: [],
  });

  /* ---------------- FETCH DATA ---------------- */

  async function fetchData() {
    setLoading(true);
    setError("");

    try {
      if (!accessToken) throw new Error("No access token found");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const [projectsRes, devRes, qaRes] = await Promise.all([
        fetch(`${API_BASE}/projects/pm/`, { headers }),
        fetch(`${API_BASE}/users/developers/`, { headers }),
        fetch(`${API_BASE}/users/qas/`, { headers }),
      ]);

      if (!projectsRes.ok || !devRes.ok || !qaRes.ok) {
        const err: ApiError = await projectsRes.json();
        throw new Error(err.detail || "Unauthorized");
      }

      setProjects(await projectsRes.json());
      setDevelopers(await devRes.json());
      setQAs(await qaRes.json());
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      setProjects([]);
      setDevelopers([]);
      setQAs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- HELPERS ---------------- */

  function toggleId(list: number[], id: number) {
    return list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
  }

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === draft.projectId),
    [draft.projectId, projects]
  );

  /* ---------------- SUBMIT ASSIGNMENT ---------------- */

  async function submitAssignment() {
    if (!draft.projectId) return;

    try {
      if (!accessToken) throw new Error("No access token");

      const res = await fetch(
        `${API_BASE}/projects/${draft.projectId}/assign/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            developers: draft.devIds,
            qas: draft.qaIds,
          }),
        }
      );

      if (!res.ok) {
        const err: ApiError = await res.json();
        throw new Error(err.detail || "Assignment failed");
      }

      setOpen(false);
      setDraft({ projectId: null, devIds: [], qaIds: [] });
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to assign project");
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="Assignments"
          subtitle="Assign projects to developers and QAs."
          right={<Button onClick={() => setOpen(true)}>New Assignment</Button>}
        />

        {loading && <div className="text-sm text-slate-500">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        <Table>
          <THead>
            <TR>
              <TH>Project</TH>
              <TH>Status</TH>
              <TH>Developers</TH>
              <TH>QAs</TH>
              <TH className="text-right">Action</TH>
            </TR>
          </THead>
          <TBody>
            {projects.map((p) => (
              <TR key={p.id}>
                <TD className="font-semibold">{p.title}</TD>
                <TD>
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
                </TD>
                <TD>{p.developers.map((u) => u.name).join(", ") || "—"}</TD>
                <TD>{p.qas.map((u) => u.name).join(", ") || "—"}</TD>
                <TD className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setDraft({
                        projectId: p.id,
                        devIds: p.developers.map((d) => d.id),
                        qaIds: p.qas.map((q) => q.id),
                      });
                      setOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>

        {/* MODAL */}
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Assign Team to Project"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitAssignment}>Save Assignment</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Select
              value={draft.projectId ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  projectId: Number(e.target.value),
                }))
              }
            >
              <option value="" disabled>
                Select project
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </Select>

            <div className="grid md:grid-cols-2 gap-4">
              {/* DEVELOPERS */}
              <div>
                <div className="font-semibold mb-2">Developers</div>
                {developers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        devIds: toggleId(d.devIds, u.id),
                      }))
                    }
                    className={`w-full text-left px-3 py-2 rounded-xl border mb-2 ${
                      draft.devIds.includes(u.id)
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {u.name}
                  </button>
                ))}
              </div>

              {/* QAS */}
              <div>
                <div className="font-semibold mb-2">QAs</div>
                {qas.map((u) => (
                  <button
                    key={u.id}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        qaIds: toggleId(d.qaIds, u.id),
                      }))
                    }
                    className={`w-full text-left px-3 py-2 rounded-xl border mb-2 ${
                      draft.qaIds.includes(u.id)
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedProject && (
              <div className="text-xs text-slate-500">
                Assigning team to:{" "}
                <span className="font-medium">{selectedProject.title}</span>
              </div>
            )}
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
}
