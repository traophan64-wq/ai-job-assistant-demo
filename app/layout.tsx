import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI实习求职助手",
  description: "输入简历+JD，AI帮你读懂岗位、改好简历、准备面试",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}