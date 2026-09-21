"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/build.module.css";

import { starDraw } from "../..//lib/utils/startDraw";

export default function BuildCanvasItem({ build }: { build: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1920;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // const font = new FontFace("Kaisei Tokumin", "url(https://fonts.gstatic.com/s/kaiseitokumin/v14/KaiseiTokumin-Regular.woff2) format('woff2')");
    const font = new FontFace("Kaisei Tokumin", "url(/font/KaiseiTokumin-Regular.ttf)");
    font.load().then(() => {
      document.fonts.add(font);

      starDraw(canvas, ctx, width, height, build, setImageUrl);
    });
  }, [build]);

  return (
    <>
      {imageUrl ? (
        <div className={styles.buildImageWrap}>
          <Image src={imageUrl} alt="Build" width={1920} height={1080} className={styles.buildImage} unoptimized />
        </div>
      ) : (
        <canvas ref={canvasRef} className={styles.buildCanvas}></canvas>
      )}
    </>
  );
}
