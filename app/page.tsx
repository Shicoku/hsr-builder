"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/home.module.css";

const LAST_UID_STORAGE_KEY = "hsr-builder:last-uid";

export default function Home() {
  const router = useRouter();
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const savedUid = window.localStorage.getItem(LAST_UID_STORAGE_KEY);
      if (savedUid) queueMicrotask(() => setUid(savedUid));
    } catch {
      // ローカル保存が無効な環境でも、通常どおりUIDを入力できます。
    }
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUid = uid.trim();

    if (!/^\d{9}$/.test(normalizedUid)) {
      setMessage("9桁のUIDを入力してください。");
      return;
    }

    try {
      window.localStorage.setItem(LAST_UID_STORAGE_KEY, normalizedUid);
    } catch {
      // 保存に失敗しても、画面遷移は継続します。
    }

    router.push(`/build?uid=${encodeURIComponent(normalizedUid)}`);
  }

  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>崩壊: スターレイル</p>
        <h1 className={styles.title}>ビルドカード</h1>
        <p className={styles.description}>UIDを入力して、公開されているキャラクター情報を取得します。</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="uid">UID</label>
          <div className={styles.searchRow}>
            <input className={styles.input} id="uid" inputMode="numeric" name="uid" pattern="[0-9]*" placeholder="例: 800000000" required type="text" value={uid} onChange={(event) => { setUid(event.target.value); setMessage(""); }} />
            <button className={styles.submitButton} type="submit" aria-label="UIDのビルドカードを作成する"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6" /></svg></button>
          </div>
          <p className={styles.status} data-status={message ? "error" : "idle"} aria-live="polite">{message}</p>
        </form>
        <nav className={styles.supportLinks} aria-label="サポート">
          <a className={styles.supportLink} href="#how-to-use">使い方</a>
          <a className={styles.supportLink} href="#contact">お問い合わせ</a>
        </nav>
      </section>
    </main>
  );
}