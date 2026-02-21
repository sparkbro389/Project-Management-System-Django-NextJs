"use client";

import { useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/dashboard/StateCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/app/lib/utils";

const API_BASE = "http://localhost:8000/api";

/* ---------------- TYPES ---------------- */

type BugStatus = "NEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type Bug = {
  id: number;
  title: string;
  status: BugStatus;
  severity: Severity;
  project: {
    id: number;
    title: string;
  };
  created_at: string;
};

type Project = {
  id: number;
  title: string;
};

/* ---------------- COMPONENT ---------------- */

export default function QAOverview({ accessToken }: { accessToken: string }) {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [reported, setReported] = useState<Bug[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH DATA ---------------- */

  async function fetchQAData() {
    if (!accessToken) return;

    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const [bugsRes, reportedRes, projectsRes] = await Promise.all([
        fetch(`${API_BASE}/bugs/qa/`, { headers }),
        fetch(`${API_BASE}/bugs/qa/reported/`, { headers }),
        fetch(`${API_BASE}/projects/qa/`, { headers }),
      ]);

      const bugsData = await bugsRes.json();
      const reportedData = await reportedRes.json();
      const projectsData = await projectsRes.json();

      setBugs(Array.isArray(bugsData) ? bugsData : []);
      setReported(Array.isArray(reportedData) ? reportedData : []);
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      console.error("QA overview fetch failed", err);
      setBugs([]);
      setReported([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQAData();
  }, [accessToken]);

  /* ---------------- DERIVED DATA ---------------- */

  const openBugs = useMemo(
    () => bugs.filter((b) => b.status !== "CLOSED"),
    [bugs]
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-4">
      {/* ---------- STATS ---------- */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Open Bugs"
          value={loading ? "…" : `${openBugs.length}`}
          hint="Not closed yet"
        />
        <StatCard
          label="My Reported"
          value={loading ? "…" : `${reported.length}`}
          hint="Bugs logged by you"
        />
        <StatCard
          label="Assigned Projects"
          value={loading ? "…" : `${projects.length}`}
          hint="Where you verify changes"
        />
      </div>

      {/* ---------- VERIFICATION QUEUE ---------- */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <SectionHeader
            title="Verification Queue"
            subtitle="Bugs awaiting QA verification."
          />

          {loading && (
            <div className="text-sm text-slate-500">Loading bugs…</div>
          )}

          <div className="grid gap-3">
            {openBugs.slice(0, 5).map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-slate-600">
                      {b.project.title}
                    </div>

                    <div className="text-base font-semibold text-slate-900 mt-1">
                      {b.title}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        tone={
                          b.status === "CLOSED"
                            ? "green"
                            : b.status === "NEW"
                            ? "gray"
                            : "indigo"
                        }
                      >
                        {b.status.replace("_", " ")}
                      </Badge>

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
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 shrink-0">
                    Created:{" "}
                    <span className="font-medium text-slate-900">
                      {formatDate(b.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {!loading && openBugs.length === 0 && (
              <div className="text-sm text-slate-600">
                No bugs pending verification.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
