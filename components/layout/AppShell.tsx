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
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 rounded-xl border border-brand-border bg-white p-4 sm:mb-8 sm:p-6">
          <Link href="/" className="inline-block">
            <img src="/images/logo-full.png" alt="JustThreeCrumbs" className="h-8 w-auto" />
          </Link>
          <h1 className="mt-2 text-[28px] font-medium leading-tight text-brand-text sm:text-[36px] md:text-[40px]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 text-[14px] leading-[1.6] text-brand-text/70 sm:text-base">{subtitle}</p>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  );
}
