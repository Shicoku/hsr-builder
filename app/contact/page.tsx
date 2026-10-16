import styles from "../styles/markdown.module.css";
import contactStyles from "../styles/contact.module.css";

export default function ContactPage() {
  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <h1>お問い合わせ</h1>
        <p>不具合の報告、ご質問、ご意見をお送りいただけます。</p>
        <iframe
          className={contactStyles.formEmbed}
          src="https://docs.google.com/forms/d/e/1FAIpQLSeWsfGvCCLeR9RkZWYsvYuDM4tlq_20OZjj-neeg0cQmSycmg/viewform?embedded=true"
          title="お問い合わせフォーム"
        >
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeWsfGvCCLeR9RkZWYsvYuDM4tlq_20OZjj-neeg0cQmSycmg/viewform?usp=publish-editor">
            お問い合わせフォームを開く
          </a>
        </iframe>
      </article>
    </main>
  );
}
