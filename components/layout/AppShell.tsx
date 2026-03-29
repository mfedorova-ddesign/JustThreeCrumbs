import { ReactNode } from "react";
import Link from "next/link";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-brand-bg px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-3xl md:max-w-7xl">
        <header className="mb-6 rounded-2xl border border-brand-border/90 bg-white p-4 shadow-soft sm:mb-8 sm:p-6">
          <Link href="/" className="inline-block">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          </Link>
          <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-brand-text sm:text-3xl md:text-[2rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-brand-text/65 sm:text-[15px]">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  );
}
