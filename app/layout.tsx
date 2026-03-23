import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JustThreeCrumbs",
  description: "Template-based meal planning for Type 2 Diabetes"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
