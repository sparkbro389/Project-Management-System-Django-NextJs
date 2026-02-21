import QAProjects from "./QaProjectClientPage";
import { cookies } from "next/headers";

export default async function QAMyProjectsPage() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return <div>Unauthorized</div>;
  }

  return <QAProjects accessToken={token} />;
}
