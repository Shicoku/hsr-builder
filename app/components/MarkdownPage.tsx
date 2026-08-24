import type { ReactNode } from "react";
import styles from "../styles/markdown.module.css";

export default function MarkdownPage({ children }: { children: ReactNode }) {
  return (
    <main className={styles.main}>
      <article className={styles.article}>{children}</article>
    </main>
  );
}
