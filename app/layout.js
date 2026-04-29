import "./globals.css";

export const metadata = {
  title: "NetKurd OS 2026 | Sarbast AI",
  description: "شارەزای زیرەکی دەستکرد بە زمانی کوردی سۆرانی",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ku" dir="rtl">
      <body className="bg-cyber-black text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
