"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/build.module.css";

type Status = "loading" | "success" | "error";
type ApiResponse = { error?: string };

export default function BuildLoader({ uid }: { uid: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("情報を取得しています…");
  const isValidUid = /^\d{9}$/.test(uid);

  useEffect(() => {
    if (!isValidUid) return;

    const controller = new AbortController();
    async function loadProfile() {
      try {
        const response = await fetch(`/api/profile/${uid}`, { cache: "no-store", signal: controller.signal });
        const result = (await response.json()) as ApiResponse;
        if (!response.ok) throw new Error(result.error ?? "情報を取得できませんでした。");
        setStatus("success");
        setMessage("情報を取得しました。ビルドカードを作成します。");
      } catch (error) {
        if (controller.signal.aborted) return;
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "情報を取得できませんでした。");
      }
    }
    void loadProfile();
    return () => controller.abort();
  }, [isValidUid, uid]);

  const displayStatus = isValidUid ? status : "error";
  const displayMessage = isValidUid ? message : "UIDを入力してください。";

  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <h1 className={styles.title}>ビルド情報</h1>
        <p className={styles.uid}>UID: {uid || "未指定"}</p>
        <p className={styles.status} data-status={displayStatus} aria-live="polite">
          {displayMessage}
        </p>
        <Link className={styles.backLink} href="/">
          別のUIDを入力する
        </Link>
      </section>
    </main>
  );
}
