import { ReactNode } from "react";

type AppShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function AppShell({ title, subtitle, children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-brand-bg px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-8 rounded-xl border border-brand-border bg-white p-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary">JTC</p>
          <h1 className="mt-2 text-[40px] font-medium leading-tight text-brand-text">{title}</h1>
          {subtitle ? <p className="mt-2 text-base leading-[1.6] text-brand-text/70">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </main>
  );
}
