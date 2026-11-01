import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "崩壊: スターレイル - ビルドカード生成器",
    short_name: "ビルドカード",
    description: "崩壊：スターレイルのビルドカードを作成します。",
    start_url: "/",
    display: "standalone",
    background_color: "#22242b",
    theme_color: "#22242b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
