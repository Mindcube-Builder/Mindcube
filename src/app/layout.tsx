import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cube-therapy AI",
  description: "Cube-therapy AI — 极简心理疗愈旅程",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
