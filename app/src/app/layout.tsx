import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PM Discovery Guide",
  description: "Interactive Product Discovery learning system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        <div className="app-shell min-h-screen">
          <Nav />
          <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
