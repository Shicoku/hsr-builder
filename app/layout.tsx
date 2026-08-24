import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "ビルドカード",
  description: "崩壊：スターレイルのビルドカードを作成します。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
