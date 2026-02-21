"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "../../../components/dashboard/StateCard";
import { SectionHeader } from "../../../components/dashboard/SectionHeader";
import { Card, CardContent } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Project } from "@/app/features/projects/projects.types";
import { formatDate, clampText } from "../../lib/utils";

/* ---------------- TYPES ---------------- */

type ApiError = {
  detail?: string;
};

export default function PMOverview({
  accessToken,
}: {
  accessToken: string;
}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- FETCH PROJECTS ---------------- */

  async function fetchProjects() {
    setLoading(true);
    setError("");

    try {

      if (!accessToken) {
        setError("No access token found. Please login again.");
        return;
      }

      const res = await fetch("http://localhost:8000/api/projects/pm/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const err: ApiError = await res.json();
        throw new Error(err.detail || "Unauthorized");
      }

      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  /* ---------------- STATS ---------------- */

  const activeProjects = useMemo(
    () => projects.filter((p) => p.status === "Active"),
    [projects]
  );

  const backlogTasksCount = 0; // API later
  const openBugsCount = 0;     // API later

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4 p-4">
      {/* STATS */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Active Projects"
          value={loading ? "…" : `${activeProjects.length}`}
          hint="Currently in delivery"
        />
        <StatCard
          label="Backlog Tasks"
          value={`${backlogTasksCount}`}
          hint="Connect task API later"
        />
        <StatCard
          label="Open Bugs"
          value={`${openBugsCount}`}
          hint="Connect bug API later"
        />
      </div>

      {/* PROJECT LIST */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <SectionHeader
            title="Delivery Snapshot"
            subtitle="Projects with dates and team overview."
          />

          {loading && (
            <div className="text-sm text-slate-500">
              Loading projects…
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid gap-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
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
                      {clampText(p.project_description, 120)}
                    </div>
                  </div>

                  <div className="shrink-0 text-sm text-slate-600">
                    Due:{" "}
                    <span className="font-medium text-slate-900">
                      {formatDate(p.due_date)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-600">
                  Team:{" "}
                  <span className="font-medium text-slate-900">
                    {p.developers.length} Dev • {p.qas.length} QA
                  </span>{" "}
                  • PM: <span className="font-medium text-slate-900">You</span>
                </div>
              </div>
            ))}

            {!loading && !error && projects.length === 0 && (
              <div className="text-sm text-slate-600">
                No projects found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
