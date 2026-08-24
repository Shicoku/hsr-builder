"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "../styles/sidebar.module.css";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/use", label: "使い方" },
  { href: "/fap", label: "よくある質問" },
  { href: "/terms", label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button type="button" className={styles.toggle} aria-expanded={isOpen} aria-controls="build-sidebar" onClick={() => setIsOpen((prev) => !prev)}>
        <span className={`${styles.toggleIcon} ${isOpen ? styles.open : ""}`} aria-hidden="true" />
        <span className={styles.srOnly}>メニューを{isOpen ? "閉じる" : "開く"}</span>
      </button>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} aria-hidden="true" />}

      <aside id="build-sidebar" className={styles.sidebar} data-open={isOpen}>
        <div className={styles.brand}>
          <Link href="/" onClick={() => setIsOpen(false)}>
            ビルドカード
          </Link>
        </div>

        <nav className={styles.nav} aria-label="メインナビゲーション">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink} data-active={isActive} onClick={() => setIsOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
