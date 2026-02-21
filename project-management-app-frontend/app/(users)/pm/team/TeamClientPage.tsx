"use client";

import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { UserService } from "@/app/features/users/user.service";

type User = {
  id: number;
  name: string;
  username: string;
  role: "Developer" | "QA" | "ProjectManager";
};

export default function PMTeam({
  accessToken,
}: {
  accessToken: string;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTeam() {
    setLoading(true);
    setError("");

    try {
      const [devs, qas] = await Promise.all([
        UserService.getDevelopers(accessToken),
        UserService.getQAs(accessToken),
      ]);

      // ✅ devs and qas are already arrays
      setUsers([
        ...devs.map((u: any) => ({ ...u, role: "Developer" })),
        ...qas.map((u: any) => ({ ...u, role: "QA" })),
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to load team members");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeam();
  }, [accessToken]);

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="Team"
          subtitle="Directory view. Wire invitations & roles later."
        />

        {loading && (
          <div className="text-sm text-slate-500">Loading team…</div>
        )}

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-slate-900">
                    {u.name}
                  </div>
                  <div className="text-sm text-slate-600">
                    @{u.username}
                  </div>
                </div>

                <Badge
                  tone={
                    u.role === "ProjectManager"
                      ? "indigo"
                      : u.role === "Developer"
                      ? "blue"
                      : "green"
                  }
                >
                  {u.role}
                </Badge>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                Placeholder actions: invite, deactivate, role change, workload view.
              </div>
            </div>
          ))}
        </div>

        {!loading && users.length === 0 && (
          <div className="text-sm text-slate-600">
            No team members found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
