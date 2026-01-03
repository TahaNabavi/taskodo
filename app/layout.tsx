import type { Metadata } from "next";
import "./globals.css";
import { sunday } from "@/src/assets/fonts";

export const metadata: Metadata = {
  title: {
    default: "Taskodo - Smart Task Management",
    template: "%s | Taskodo",
  },
  description:
    "Streamline your productivity with Taskodo - the intuitive task management app. Organize, prioritize, and accomplish your goals efficiently with smart lists, reminders, and collaboration features.",
  keywords: [
    "task management",
    "productivity",
    "to-do list",
    "project management",
    "task tracker",
    "productivity app",
    "time management",
    "goal tracking",
  ],
  authors: [{ name: "Taha Nabavi", url: "https://github.com/TahaNabavi" }],
  creator: "Taskodo Inc.",
  publisher: "Taskodo Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://taskodo.tahanabavi.ir",
    title: "Taskodo - Smart Task Management",
    description:
      "Streamline your productivity with Taskodo - the intuitive task management app.",
    siteName: "Taskodo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskodo - Smart Task Management",
    description:
      "Streamline your productivity with Taskodo - the intuitive task management app.",
    creator: "@taskodo",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
  category: "productivity",
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
