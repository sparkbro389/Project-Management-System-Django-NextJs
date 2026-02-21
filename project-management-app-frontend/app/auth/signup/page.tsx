'use client';
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from 'react';
import { signUp } from './../../features/auth/signup.action';

export default function SignUp() {
  const router = useRouter();
  const [showDropDown, setShowDropDown] = useState(false);
  const [selected, setSelected] = useState('Select Role');
  const [state, formAction, isPending] = useActionState(signUp, undefined);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => router.push("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  useEffect(() => {
    if (state?.values?.role) {
      setSelected(String(state.values.role));
    }
  }, [state]);

  const handleSelect = (option: string) => {
    setSelected(option);
    setShowDropDown(false);
  };
  type FieldName =
  | "name"
  | "username"
  | "role"
  | "email"
  | "password"
  | "confirm_password";
  const fieldError = (name: FieldName) => state?.errors?.[name]?.[0];

  return (
    <div className="min-h-screen bg-slate-950 px-6 pt-28">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur p-8 shadow-xl">

        <h1 className="text-2xl font-bold text-white mb-6">
          Create an account
        </h1>

        {showSuccess && (
          <div className="mb-4 rounded-lg border border-green-700 bg-green-900/30 p-4 text-green-300 text-sm">
            ✅ Account created successfully. Redirecting to login…
          </div>
        )}
        {state?.error && (
        <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3 text-red-300 text-sm">
          {state.error}
        </div>
      )}

        <form className="space-y-5" action={formAction}>

          {/* Name */}
         <div>
        <label className="block mb-1 text-sm text-slate-300">Name</label>
        <input
          name="name"
          required
          defaultValue={state?.values?.name ? String(state.values.name) : ""}
          className={`w-full rounded-lg bg-slate-800/60 border px-3 py-2 text-white focus:ring-2
            ${fieldError("name")
              ? "border-red-500 focus:ring-red-500"
              : "border-slate-700 focus:ring-blue-600"
            }`}
        />
        {fieldError("name") && (
          <p className="mt-1 text-xs text-red-400">
            {fieldError("name")}
          </p>
        )}
      </div>

          {/* Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowDropDown(!showDropDown);
                }}
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
              >
                {selected}
                <svg
                  className="w-2.5 h-2.5 ms-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              <input
                type="hidden"
                name="role"
                value={selected !== 'Select Role' ? selected : ''}
              />

              {showDropDown && (
                <div className="absolute mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    {["Developer", "ProjectManager", "QA"].map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          onClick={() => handleSelect(option)}
                          className="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          {/* Username */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Username</label>
            <input
              name="username"
              required
              defaultValue={state?.values?.username ? String(state.values.username) : ""}
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-600"
            />
            {fieldError("username") && (
            <p className="mt-1 text-xs text-red-400">
              {fieldError("username")}
            </p>
          )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Email</label>
            <input
              name="email"
              required
              defaultValue={state?.values?.email ? String(state.values.email) : ""}
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-600"
            />
            {fieldError("role") && (
            <p className="mt-2 text-xs text-red-400">
              {fieldError("role")}
            </p>
          )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-600"
            />
            {fieldError("password") && (
            <p className="mt-1 text-xs text-red-400">
              {fieldError("password")}
            </p>
          )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm text-slate-300">Confirm password</label>
            <input
              type="password"
              name="confirm_password"
              required
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-white focus:ring-2 focus:ring-blue-600"
            />
            {fieldError("confirm_password") && (
              <p className="mt-1 text-xs text-red-400">
                {fieldError("confirm_password")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 transition"
          >
            {isPending ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>

          {state?.error && (
            <p className="text-sm text-red-400 text-center">{state.error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
