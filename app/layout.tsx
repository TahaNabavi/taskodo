import type { Metadata } from "next";
import "./globals.css";
import { sunday } from "@/src/assets/fonts";

export const metadata: Metadata = {
  title: "Taskodo",
  description: "Manage your task with taskodo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sunday.variable} antialiased bg-neutral-950 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
