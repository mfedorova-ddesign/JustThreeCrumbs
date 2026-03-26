"use client";

import { Button } from "@/components/ui/Button";
import { useGeneratorStore } from "@/lib/generator/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { continueAsGuest } = useGeneratorStore();
  const [mode, setMode] = useState<AuthMode>("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-8">
          <button
            type="button"
            className="text-[14px] text-brand-text/70 hover:text-brand-text"
            onClick={() => {
              if (typeof window !== "undefined" && window.history.length > 1) {
                router.back();
                return;
              }
              router.push("/");
            }}
          >
            ← Back
          </button>
          <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          <div className="h-6 w-14" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-[560px] px-4 py-10 md:px-8">
        <div className="rounded-xl border border-brand-border bg-white p-6 shadow-sm">
          <h1 className="text-[28px] font-medium text-brand-text">
            {mode === "register" ? "Create your account" : "Sign in"}
          </h1>
          <p className="mt-2 text-[14px] text-brand-text/70">
            Your profile data will be used to personalize nutrition targets and meal generation.
          </p>

          <div className="mt-5 flex gap-2 rounded-lg bg-brand-bg p-1">
            <button
              type="button"
              className={`flex-1 rounded-md px-3 py-2 text-[13px] ${mode === "register" ? "bg-white font-medium text-brand-text" : "text-brand-text/60"}`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
            <button
              type="button"
              className={`flex-1 rounded-md px-3 py-2 text-[13px] ${mode === "login" ? "bg-white font-medium text-brand-text" : "text-brand-text/60"}`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {mode === "register" ? (
              <label className="block text-[14px] font-medium text-brand-text/80">
                Name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-border px-4 py-2 text-[15px] focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                  placeholder="Your name"
                />
              </label>
            ) : null}

            <label className="block text-[14px] font-medium text-brand-text/80">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-border px-4 py-2 text-[15px] focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                placeholder="you@email.com"
              />
            </label>

            <label className="block text-[14px] font-medium text-brand-text/80">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-border px-4 py-2 text-[15px] focus:outline-none focus:ring-4 focus:ring-brand-primary/20"
                placeholder="At least 6 characters"
              />
            </label>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="primary"
              className="w-full"
              onClick={() => {
                continueAsGuest();
                router.push("/profile");
              }}
            >
              {mode === "register" ? "Create account" : "Sign in"}
            </Button>

            <button
              type="button"
              className="mt-3 w-full rounded-xl border border-brand-border bg-white px-4 py-2 text-[14px] text-brand-text/80 hover:bg-brand-bg"
              onClick={() => {
                continueAsGuest();
                router.push("/profile");
              }}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
