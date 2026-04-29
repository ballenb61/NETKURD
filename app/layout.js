import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NetKurd OS 2026 | سارباست AI",
  description: "سیستمی کارپێکردنی کوردی، زیرەکی دەستکردی سارباست",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ku" dir="rtl">
      <body className="min-h-screen bg-cyber-black">{children}</body>
    </html>
  );
}
