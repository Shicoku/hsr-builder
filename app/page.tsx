"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./styles/home.module.css";

const LAST_UID_STORAGE_KEY = "hsr-builder:last-uid";
const TERMS_NOTICE_STORAGE_KEY = "hsr-builder:terms-notice-seen";

export default function Home() {
  const router = useRouter();
  const [uid, setUid] = useState("");
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const savedUid = window.localStorage.getItem(LAST_UID_STORAGE_KEY);
      if (savedUid) queueMicrotask(() => setUid(savedUid));
    } catch {}

    try {
      if (!window.localStorage.getItem(TERMS_NOTICE_STORAGE_KEY)) {
        dialogRef.current?.showModal();
      }
    } catch {}
  }, []);

  function closeTermsNotice() {
    try {
      window.localStorage.setItem(TERMS_NOTICE_STORAGE_KEY, "1");
    } catch {}
    dialogRef.current?.close();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedUid = uid.trim();

    if (!/^\d{9}$/.test(normalizedUid)) {
      setMessage("UIDを入力してください");
      return;
    }

    try {
      window.localStorage.setItem(LAST_UID_STORAGE_KEY, normalizedUid);
    } catch {}

    router.push(`/build?uid=${encodeURIComponent(normalizedUid)}`);
  }

  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <p className={styles.eyebrow}>崩壊: スターレイル</p>
        <h1 className={styles.title}>ビルドカード生成器</h1>
        <p className={styles.description}>UIDを入力して情報を取得します。</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="uid">
            UID
          </label>
          <div className={styles.searchRow}>
            <input
              className={styles.input}
              id="uid"
              inputMode="numeric"
              name="uid"
              pattern="[0-9]*"
              placeholder="例: 800000000"
              required
              type="text"
              value={uid}
              onChange={(event) => {
                setUid(event.target.value);
                setMessage("");
              }}
            />
            <button className={styles.submitButton} type="submit" aria-label="UIDのビルドカードを作成する">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <p className={styles.status} data-status={message ? "error" : "idle"} aria-live="polite">
            {message}
          </p>
        </form>
        <nav className={styles.supportLinks} aria-label="サポート">
          {/* <a className={styles.supportLink} href="#how-to-use">使い方</a>
          <a className={styles.supportLink} href="#contact">お問い合わせ</a> */}
          <a className={styles.supportLink} href="/terms">
            利用規約を確認する
          </a>
        </nav>
      </section>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="terms-dialog-title" onCancel={closeTermsNotice}>
        <h2 id="terms-dialog-title" className={styles.dialogTitle}>
          ご利用前にお読みください
        </h2>
        <p className={styles.dialogText}>本サービスをご利用頂く前に利用規約を必ずお読みください。</p>
        <div className={styles.dialogActions}>
          <a className={styles.dialogLink} href="/terms" target="_blank" rel="noopener noreferrer">
            利用規約を確認する
          </a>
          <button className={styles.dialogButton} onClick={closeTermsNotice}>
            閉じる
          </button>
        </div>
      </dialog>
    </main>
  );
}
