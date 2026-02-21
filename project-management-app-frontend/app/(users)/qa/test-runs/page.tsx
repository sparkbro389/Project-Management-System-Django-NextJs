// qa/test-runs/page.tsx
import QATestRunsClient from "./QATestRunsClientPage";
import { cookies } from "next/headers";

export default async function QATestRunsPage() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) return <div>Unauthorized</div>;

  return <QATestRunsClient accessToken={token} />;
}
