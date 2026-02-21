'use server';
import { getSession } from "./../app/features/auth/sessions"
import { redirect } from "next/navigation";
export default async function LandingPage() {
  const session = await getSession()
  if (!session){
    return (
    <main className="bg-slate-950 text-white min-h-screen">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10" />

        <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Manage Projects <br />
              <span className="text-blue-500">Without Chaos</span>
            </h2>

            <p className="mt-6 text-slate-300 max-w-xl">
              A role-based project management platform built for
              developers, project managers, and QA teams.
              Track progress, assign tasks, and deliver faster.
            </p>

            <div className="mt-8 flex gap-4">
              <a
                href="/signup"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium"
              >
                Start Free
              </a>
              <a
                href="#features"
                className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 font-medium"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Mock dashboard */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
            <div className="h-4 w-32 bg-slate-700 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="h-10 bg-slate-800 rounded flex items-center px-4 text-sm text-slate-400"
                >
                  Project #{i} — In Progress
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <h3 className="text-3xl font-bold text-center">
          Everything your team needs
        </h3>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Role-based Access',
              desc: 'Developers, QAs, and Project Managers see only what they should.',
            },
            {
              title: 'Project Tracking',
              desc: 'Track status, assignments, and progress in real time.',
            },
            {
              title: 'Secure & Scalable',
              desc: 'JWT authentication, permissions, and clean architecture.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-600 transition"
            >
              <h4 className="text-lg font-semibold text-blue-500">
                {f.title}
              </h4>
              <p className="mt-3 text-slate-400 text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ROLES ================= */}
      <section id="roles" className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h3 className="text-3xl font-bold text-center">
            Built for every role
          </h3>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              {
                role: 'Project Manager',
                text: 'Create projects, assign developers and QA, track delivery.',
              },
              {
                role: 'Developer',
                text: 'See assigned projects, tasks, and updates only.',
              },
              {
                role: 'QA',
                text: 'Focus on testing, bug tracking, and approvals.',
              },
            ].map((r) => (
              <div
                key={r.role}
                className="rounded-xl border border-slate-800 p-6 bg-slate-950"
              >
                <h4 className="text-lg font-semibold text-white">
                  {r.role}
                </h4>
                <p className="mt-3 text-slate-400 text-sm">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h3 className="text-4xl font-bold">
          Ready to organize your workflow?
        </h3>
        <p className="mt-4 text-slate-400">
          Create an account and start managing projects today.
        </p>

        <a
          href="/auth/signup"
          className="inline-block mt-8 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold"
        >
          Create Account
        </a>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between text-sm text-slate-500">
          <span>© 2025 ProjectFlow</span>
          <span>Built with Django + Next.js</span>
        </div>
      </footer>

    </main>
  );
  }

  const { role, username } = session.user;

  if (role === "Developer") redirect(`/devs/${username}`);
  if (role === "QA") redirect(`/qa/${username}`);
  if (role === "ProjectManager") redirect(`/manager/${username}`);

  redirect("/dashboard");
  
}
