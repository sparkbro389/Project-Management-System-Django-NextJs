"use client";

import { useActionState } from "react";
import { login } from "./../../features/auth/login.action";

export default function Login() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen bg-slate-950 px-6 pt-32">
    <div className="flex justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur p-8 shadow-xl">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue to <span className="text-blue-500 font-medium">ProjectFlow</span>
          </p>
        </div>

        {/* Form */}
        <form action={action} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="your_username"
            />
            {state?.errors?.username && (
              <p className="mt-1 text-sm text-red-400">
                {state.errors.username[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-2 block w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none"
              placeholder="••••••••"
            />
            {state?.errors?.password && (
              <p className="mt-1 text-sm text-red-400">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          {/* Global error */}
          {state?.error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60 transition"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400">
            Don’t have an account?{" "}
            <a
              href="/auth/signup"
              className="font-medium text-blue-500 hover:underline"
            >
              Create one
            </a>
          </p>
        </form>
      </div>
    </div>
    </div>
  );
}
