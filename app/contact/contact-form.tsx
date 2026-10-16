"use client";

import { FormEvent, useState } from "react";
import styles from "../styles/contact.module.css";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "送信できませんでした。");
      }

      form.reset();
      setStatus("success");
      setMessage(result.message ?? "お問い合わせを送信しました。");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "送信できませんでした。");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="contact-name">
          お名前 <span className={styles.optional}>任意</span>
        </label>
        <input id="contact-name" name="name" autoComplete="name" maxLength={100} />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email">
          メールアドレス <span className={styles.optional}>任意</span>
        </label>
        <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message">
          お問い合わせ内容 <span className={styles.required}>必須</span>
        </label>
        <textarea id="contact-message" name="message" rows={8} maxLength={5000} required />
      </div>

      <button className={styles.submit} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "送信中…" : "送信する"}
      </button>
      <p className={styles.message} data-status={status} aria-live="polite">
        {message}
      </p>
    </form>
  );
}
