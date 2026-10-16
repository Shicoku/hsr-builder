import ContactForm from "./contact-form";
import styles from "../styles/markdown.module.css";

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <h1>お問い合わせ</h1>
        <p>不具合の報告、ご質問、ご意見をお送りいただけます。</p>
        <ContactForm />
      </article>
    </main>
  );
}
