import Link from "next/link";
import styles from "../styles/tools.module.css";

type Tool = {
  name: string;
  description: string;
  category: string;
  href?: string;
  status: "available" | "planned";
};

const TOOLS: Tool[] = [
  {
    name: "ビルドカード生成器",
    description: "UIDからキャラクターのビルドカードを作成します。",
    category: "ビルド",
    href: "/",
    status: "available",
  },
  {
    name: "遺物スコア計算",
    description: "遺物のメイン・サブステータスを入力して、キャラクター別のスコアを計算します。",
    category: "スコア",
    href: "/tools/score",
    status: "available",
  },
];

export default function Tools() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>ツール</h1>
        </header>

        <section className={styles.section} aria-labelledby="tools-heading">
          <div className={styles.sectionHeading}></div>

          {TOOLS.length > 0 ? (
            <ul className={styles.grid}>
              {TOOLS.map((tool) => {
                const content = (
                  <>
                    <div className={styles.cardTop}>
                      <span className={styles.category}>{tool.category}</span>
                      <span className={styles.status} data-status={tool.status}>
                        {tool.status === "available" ? "利用可能" : "準備中"}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{tool.name}</h3>
                    <p className={styles.cardDescription}>{tool.description}</p>
                    <span className={styles.cardAction} aria-hidden="true">
                      {tool.status === "available" ? "" : "公開予定"}
                      {tool.status === "available" && <span>↗</span>}
                    </span>
                  </>
                );

                return (
                  <li className={styles.card} key={tool.name}>
                    {tool.status === "available" && tool.href ? (
                      <Link className={styles.cardLink} href={tool.href}>
                        {content}
                      </Link>
                    ) : (
                      <div
                        className={styles.cardUnavailable}
                        aria-disabled="true"
                      >
                        {content}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                ＋
              </span>
              <h3>ツールを準備しています</h3>
              <p>新しいツールが追加されると、ここに表示されます。</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
