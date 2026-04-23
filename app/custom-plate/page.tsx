"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CustomPlatePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="w-full border-b border-brand-border/90 bg-white">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="inline-block">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          </Link>
          <button
            type="button"
            title="Profile"
            aria-label="Profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-border/90 text-brand-text/80 transition-colors hover:bg-brand-bg hover:text-brand-text"
            onClick={() => router.push("/profile")}
          >
            <User className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[900px] px-4 pb-14 pt-8 md:px-8">
        <div className="rounded-2xl border border-dashed border-brand-border bg-white p-8 text-center shadow-soft">
          <p className="text-xl font-semibold text-brand-text">This section is temporarily hidden</p>
          <p className="mt-2 text-sm text-brand-text/65">
            Meal calculator / macro plate is paused for now and will return in a later iteration.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Link
              href="/generator"
              className="rounded-xl border border-brand-border bg-brand-bg/50 px-4 py-2 text-sm font-medium text-brand-text/80 hover:bg-brand-bg"
            >
              Back to Generator
            </Link>
            <Link
              href="/recipes"
              className="rounded-xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Open Recipes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
