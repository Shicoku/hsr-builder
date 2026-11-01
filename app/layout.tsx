import type { Metadata, Viewport } from "next";
import { Kaisei_Tokumin } from "next/font/google";
import Sidebar from "./components/Sidebar";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "崩壊: スターレイル - ビルドカード生成器",
  description: "崩壊：スターレイルのビルドカードを作成します。",
  appleWebApp: {
    capable: true,
    title: "ビルドカード",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#22242b",
};

const kaisei = Kaisei_Tokumin({
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className={`min-h-full flex flex-col ${kaisei.className}`}>
        <ServiceWorkerRegistration />
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
