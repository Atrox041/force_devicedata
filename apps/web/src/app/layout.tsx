import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "资产分析 BI 平台",
  description: "面向资产、采购、发货与汇总分析的可视化管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
