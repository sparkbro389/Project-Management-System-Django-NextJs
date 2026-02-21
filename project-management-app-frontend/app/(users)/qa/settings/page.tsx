import { Card, CardContent } from "@/components/ui/Card";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Buttons";

export default function QASettings() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <SectionHeader title="Settings" subtitle="QA preferences (UI-only)." />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">Default Bug Severity</div>
            <Select defaultValue="Medium">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-700">Test Report Format</div>
            <Input placeholder="e.g., PDF / CSV / Jira sync later" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button>Save (UI only)</Button>
        </div>
      </CardContent>
    </Card>
  );
}
