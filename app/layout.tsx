import type { Metadata } from "next";
import { Kaisei_Tokumin } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ビルドカード",
  description: "崩壊：スターレイルのビルドカードを作成します。",
};

const kaisei = Kaisei_Tokumin({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className={`min-h-full flex flex-col ${kaisei.className}`}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
