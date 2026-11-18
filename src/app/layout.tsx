import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "最強の年賀状メーカー | ブラウザ完結・完全ローカル",
  description:
    "写真やデザインデータはサーバーへ送信されず、ブラウザ内のみで完結する高機能年賀状メーカー。2027年未年テンプレートや自動フチ・配色エフェクト、はがき実寸PDF出力に対応。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Kaisei+Decol:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@400;700&family=Yuji+Syuku&family=Zen+Kurenaido&display=swap"
        />
      </head>
      <body className="antialiased selection:bg-red-100 selection:text-red-900">
        {children}
      </body>
    </html>
  );
}
