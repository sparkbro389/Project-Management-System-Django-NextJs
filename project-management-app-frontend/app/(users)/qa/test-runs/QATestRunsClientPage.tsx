"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Badge } from "@/components/ui/Badge";

const API_BASE = "http://localhost:8000/api";

/* ---------------- TYPES ---------------- */

type TestRunStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED";

type TestRun = {
  id: number;
  code: string;
  title: string;
  status: TestRunStatus;
  coverage: number;
  project_title: string;
};

/* ---------------- MOCK DATA ---------------- */

const MOCK_TEST_RUNS: TestRun[] = [
  {
    id: 1,
    code: "TR-101",
    title: "Regression — Client Onboarding",
    status: "IN_PROGRESS",
    coverage: 72,
    project_title: "Client Onboarding Portal",
  },
  {
    id: 2,
    code: "TR-104",
    title: "Smoke — Payments Module",
    status: "PLANNED",
    coverage: 0,
    project_title: "Payments System",
  },
  {
    id: 3,
    code: "TR-098",
    title: "Release Verification — Sprint 6",
    status: "COMPLETED",
    coverage: 100,
    project_title: "HR Management System",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function QATestRuns({
  accessToken,
}: {
  accessToken: string;
}) {
  const [runs, setRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH TEST RUNS ---------------- */

  async function fetchTestRuns() {
    if (!accessToken) {
      setRuns(MOCK_TEST_RUNS);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/qa/test-runs/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error("API not ready");

      const data = await res.json();

      setRuns(
        Array.isArray(data) && data.length > 0 ? data : MOCK_TEST_RUNS
      );
    } catch (err) {
      console.warn("Using mock test runs");
      setRuns(MOCK_TEST_RUNS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTestRuns();
  }, [accessToken]);

  /* ---------------- UI ---------------- */

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="Test Runs"
          subtitle="Verification cycles assigned to you."
        />

        {loading && (
          <div className="text-sm text-slate-500">Loading test runs…</div>
        )}

        <div className="grid gap-3">
          {runs.map((tr) => (
            <div
              key={tr.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {tr.code}
                    </span>
                    <Badge
                      tone={
                        tr.status === "COMPLETED"
                          ? "green"
                          : tr.status === "IN_PROGRESS"
                          ? "indigo"
                          : "gray"
                      }
                    >
                      {tr.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="text-base font-semibold text-slate-900 mt-1">
                    {tr.title}
                  </div>

                  <div className="text-sm text-slate-600 mt-1">
                    Project:{" "}
                    <span className="font-medium text-slate-900">
                      {tr.project_title}
                    </span>
                  </div>

                  <div className="text-sm text-slate-600 mt-2">
                    Coverage:{" "}
                    <span className="font-medium text-slate-900">
                      {tr.coverage}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Actions: view cases, update status, export report
                </div>
              </div>
            </div>
          ))}

          {!loading && runs.length === 0 && (
            <div className="text-sm text-slate-600">
              No test runs assigned.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
