"use client";
import { useEffect, useRef } from "react";
import styles from "../styles/build.module.css";

export default function RelicCanvasItem({ relic }: { relic: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 200;
    const height = 210;
    const scale = 2;

    canvas.width = width * scale;
    canvas.height = height * scale;

    if (!ctx) return;

    ctx.scale(scale, scale);
    ctx.fillStyle = "#fff";
    ctx.font = "18px 'Kaisei Tokumin'";
    ctx.textAlign = "start";

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.error("読み込み失敗:", src);
          reject(new Error(`画像読み込み失敗: ${src}`));
        };
      });

    const font = new FontFace("Kaisei Tokumin", "url(/font/KaiseiTokumin-Regular.ttf)");
    font.load().then(() => {
      document.fonts.add(font);

      Promise.all([loadImage(relic.icon), loadImage(relic.main.icon), ...relic.sub.map((sub: any) => loadImage(sub.icon))])
        .then(([icon, mainIcon, ...subIcons]) => {
          // Relic icon
          ctx.drawImage(icon, 10, 25, 64, 64);

          ctx.globalAlpha = 0.5;
          ctx.font = "15px 'Kaisei Tokumin'";
          ctx.fillText(relic.name, 10, 15);

          ctx.font = "13px 'Kaisei Tokumin'";
          ctx.fillText(`+${relic.level}`, 70, 80);

          ctx.font = "18px 'Kaisei Tokumin'";
          ctx.globalAlpha = 1.0;

          ctx.drawImage(mainIcon, 75, 30, 32, 32);
          ctx.fillText(relic.main.name, 110, 54);

          ctx.font = "22px 'Kaisei Tokumin'";
          ctx.fillText(relic.main.display, 120, 80);

          ctx.font = "18px 'Kaisei Tokumin'";

          ctx.beginPath();
          ctx.moveTo(0, 100);
          ctx.lineTo(200, 100);

          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.globalAlpha = 1.0;

          subIcons.forEach((img, i) => {
            const sub = relic.sub[i];
            const y = 130 + i * 25;

            ctx.drawImage(img, 10, y - 18, 20, 20);

            ctx.textAlign = "start";
            ctx.fillText(sub.name, 35, y);

            ctx.textAlign = "right";
            ctx.fillText(sub.display, 180, y);

            ctx.textAlign = "start";
          });
        })
        .catch((error) => {
          console.error("Failed to load relic images:", error);
        });
    });
  }, [relic]);

  return <canvas ref={canvasRef} className={styles.canvasItem}></canvas>;
}
