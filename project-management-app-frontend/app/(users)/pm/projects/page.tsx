// app/pm/projects/page.tsx  (SERVER COMPONENT)
import PMProjectsClient from "./ProjectClientPage";
import { cookies } from "next/headers";

export default async function PMProjectsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  console.log("token:",{token})
  if (!token) {
    return <div>Unauthorized</div>;
  }

  return <PMProjectsClient accessToken={token} />;
}
