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

    canvas.width = width;
    canvas.height = height;

    if (!ctx) return;

    ctx.fillStyle = "#fff";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "start";

    const icon = new Image();
    icon.crossOrigin = "anonymous";
    icon.src = relic.icon;

    icon.onload = () => {
      ctx.drawImage(icon, 10, 25, 64, 64);

      ctx.globalAlpha = 0.5;
      ctx.font = "15px sans-serif";
      ctx.fillText(relic.name, 10, 15);
      ctx.font = "13px sans-serif";
      ctx.fillText(`+${relic.level}`, 70, 80);
      ctx.font = "18px sans-serif";
      ctx.globalAlpha = 1.0;

      const mainIcon = new Image();
      mainIcon.crossOrigin = "anonymous";
      mainIcon.src = relic.main.icon;

      mainIcon.onload = () => {
        ctx.drawImage(mainIcon, 75, 30, 32, 32);
        ctx.fillText(relic.main.name, 110, 54);
        ctx.font = "22px sans-serif";
        ctx.fillText(relic.main.display, 120, 80);
        ctx.font = "18px sans-serif";
      };

      ctx.beginPath();
      ctx.moveTo(0, 100);
      ctx.lineTo(200, 100);
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1.0;

      relic.sub.forEach((sub: any, i: number) => {
        const subIcon = new Image();
        subIcon.crossOrigin = "anonymous";
        subIcon.src = sub.icon;

        subIcon.onload = () => {
          const y = 130 + i * 25;

          ctx.drawImage(subIcon, 10, y - 18, 20, 20);

          ctx.textAlign = "start";
          ctx.fillText(sub.name, 35, y);
          ctx.textAlign = "right";
          ctx.fillText(sub.display, 180, y);
          ctx.textAlign = "start";
        };
      });
    };
  }, [relic]);

  return <canvas ref={canvasRef} className={styles.canvasItem}></canvas>;
}
