import { ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

type ButtonProps =
  | (CommonProps & { href: string; onClick?: never; type?: never })
  | (CommonProps & {
      href?: never;
      onClick?: () => void;
      type?: "button" | "submit";
    });

type Variant = "primary" | "secondary" | "ghost";

type EnhancedButtonProps = ButtonProps & {
  variant?: Variant;
};

const baseClass =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 text-[14px] leading-[1.6] font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-primary/20 hover:opacity-90 disabled:opacity-50 disabled:hover:opacity-90";

export function Button(props: EnhancedButtonProps) {
  const variant: Variant = props.variant ?? "primary";

  const variantClass =
    variant === "primary"
      ? "bg-brand-primary text-white hover:opacity-90"
      : variant === "secondary"
        ? "bg-white text-brand-primary border border-brand-primary hover:bg-brand-bg"
        : "bg-transparent text-brand-primary hover:bg-brand-bg";

  if ("href" in props && props.href) {
    return (
      <a
        href={props.href}
        className={`${baseClass} ${variantClass} ${props.className ?? ""}`.trim()}
      >
        {props.children}
      </a>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${baseClass} ${variantClass} ${props.className ?? ""}`.trim()}
    >
      {props.children}
    </button>
  );
}
