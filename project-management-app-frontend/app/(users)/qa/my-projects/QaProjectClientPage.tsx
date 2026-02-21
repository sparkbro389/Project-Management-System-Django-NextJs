"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/app/lib/utils";

const API_BASE = "http://localhost:8000/api";

type ProjectStatus = "ACTIVE" | "ON_HOLD" | "COMPLETED";

type Project = {
  id: number;
  title: string;
  project_description: string;
  status: ProjectStatus;
  due_date: string | null;
};

export default function QAProjects({ accessToken }: { accessToken: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/projects/qa/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, [accessToken]);

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="My Projects"
          subtitle="Projects where you’re assigned as QA."
        />

        {loading && (
          <div className="text-sm text-slate-500">Loading projects…</div>
        )}

        <div className="grid gap-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge
                    tone={
                      p.status === "ACTIVE"
                        ? "green"
                        : p.status === "ON_HOLD"
                        ? "yellow"
                        : "gray"
                    }
                  >
                    {p.status.replace("_", " ")}
                  </Badge>

                  <div className="text-base font-semibold text-slate-900 mt-1">
                    {p.title}
                  </div>

                  <div className="text-sm text-slate-600 mt-1">
                    {p.project_description}
                  </div>
                </div>

                <div className="text-sm text-slate-600 shrink-0">
                  Due:{" "}
                  <span className="font-medium text-slate-900">
                    {p.due_date ? formatDate(p.due_date) : "—"}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {!loading && projects.length === 0 && (
            <div className="text-sm text-slate-600">
              No assigned projects.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
