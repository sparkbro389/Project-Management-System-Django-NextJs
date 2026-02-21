import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Buttons";

export default function PMSettings() {
  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <SectionHeader
          title="Settings"
          subtitle="UI placeholders for org-level configuration."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">
              Workspace Name
            </div>
            <Input defaultValue="Nova PM" />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">
              Default SLA
            </div>
            <Select defaultValue="48h">
              <option value="24h">24h</option>
              <option value="48h">48h</option>
              <option value="72h">72h</option>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">
              Notification Rules
            </div>
            <Input placeholder="e.g., Notify on High/Critical only" />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">
              Release Cadence
            </div>
            <Select defaultValue="weekly">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button>Save (UI only)</Button>
        </div>
      </CardContent>
    </Card>
  );
}
