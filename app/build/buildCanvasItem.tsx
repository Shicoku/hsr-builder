"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/build.module.css";

export default function BuildCanvasItem({ build }: { build: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  console.log(build);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = 1920;
    const height = 1080;

    canvas.width = width;
    canvas.height = height;

    if (!ctx) return;

    const back = new window.Image();
    back.src = "/assets/back.png";
    back.onload = () => {
      ctx.drawImage(back, 0, 0, width, height);

      const icon = new window.Image();
      icon.crossOrigin = "anonymous";
      icon.src = build.icon;
      icon.onload = () => {
        ctx.drawImage(icon, 200, -90, icon.width / 1.5, icon.height / 1.5);

        const url = canvas.toDataURL("image/png");
        setImageUrl(url);
      };
    };
  });

  return (
    <>
      {imageUrl ? (
        <div className={styles.buildImageWrap}>
          <Image src={imageUrl} alt="Build " width={1920} height={1080} className={styles.buildImage} unoptimized />
        </div>
      ) : (
        <canvas ref={canvasRef} className={styles.buildCanvas}></canvas>
      )}
    </>
  );
}
