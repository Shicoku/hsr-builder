"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles/build.module.css";
import spinner from "../styles/spinner.module.css";

import { Score } from "../../lib/utils/scorer";
import { RenderRelic } from "../../lib/utils/renderRelic";
import { parserChar } from "../../lib/utils/renderBuild";

import RelicCanvasItem from "./relicCanvasItem";
import BuildCanvasItem from "./buildCanvasItem";
import { useBuildStore, type Character, type Player } from "./buildContext";

type ApiResponse = {
  data?: { player?: Player; characters?: Character[] };
  error?: string;
  retryAfterSeconds?: number;
};

const COOLDOWN_SEC = 59;
const EMPTY: Character[] = [];

function assetUrl(icon: string | undefined) {
  if (!icon) return undefined;
  if (icon.startsWith("http://") || icon.startsWith("https://")) return icon;
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${icon}`;
}

export default function BuildLoader({ uid }: { uid: string }) {
  const store = useBuildStore();
  const { setLoaded } = store;

  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const isCached = store.uid === uid;
  const player = isCached ? store.player : null;
  const characters = isCached ? store.characters : EMPTY;
  const selectedCharacterIndex = isCached ? store.selectedCharacterIndex : null;

  const isValidUid = /^\d{9}$/.test(uid);

  const storeRef = useRef(store);
  useEffect(() => {
    storeRef.current = store;
  });

  const selected = useMemo(() => {
    if (!player || selectedCharacterIndex === null) return null;
    const score = Score(selectedCharacterIndex, characters);
    return {
      relics: RenderRelic(selectedCharacterIndex, characters, score),
      build: parserChar(selectedCharacterIndex, player, characters, score),
    };
  }, [player, characters, selectedCharacterIndex]);

  const handleCharacterClick = (index: number) => {
    store.setSelectedCharacterIndex(index);
  };

  const handleTimerClick = () => {
    setRemaining(COOLDOWN_SEC);
    setError("");
    setRequestVersion((version) => version + 1);
  };

  const disabled = isLoading || remaining > 0;

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  useEffect(() => {
    if (!isValidUid) return;

    const cached = storeRef.current;
    if (requestVersion === 0 && cached.uid === uid && cached.player) return;

    const controller = new AbortController();
    let retryTimer: number | undefined;

    async function loadProfile() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/profile/${uid}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as ApiResponse;

        if (response.status === 429) {
          const retryAfterSeconds = result.retryAfterSeconds ?? 1;
          retryTimer = window.setTimeout(() => {
            setRequestVersion((version) => version + 1);
          }, retryAfterSeconds * 1_000);
          return;
        }
        if (!response.ok) throw new Error(result.error ?? "情報を取得できませんでした。");
        if (!result.data?.player) throw new Error("プレイヤー情報を取得できませんでした。");

        setLoaded(uid, result.data.player, result.data.characters?.slice(0, 7) ?? []);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(fetchError instanceof Error ? fetchError.message : "情報を取得できませんでした。");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadProfile();
    return () => {
      controller.abort();
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [isValidUid, requestVersion, uid, setLoaded]);

  if (!isValidUid) return <main className={styles.main}>URLに有効なUIDが指定されていません。</main>;
  if (error) return <main className={styles.main}>{error}</main>;

  if (!player) {
    return (
      <main className={styles.main}>
        <Image src={"/icons/spinner.svg"} width={100} height={100} alt="icon" className={spinner.spinner} priority />
      </main>
    );
  }

  const avatarIcon = assetUrl(player.avatar?.icon);

  return (
    <main className={`${styles.main} ${styles.profileMain}`}>
      <section className={styles.profileSection}>
        <button onClick={handleTimerClick} disabled={disabled} className={`${styles.reloadWrap} ${remaining > 0 ? styles.count : styles.reload}`}>
          {isLoading ? "60" : remaining > 0 ? remaining : <Image src={"/icons/reload.svg"} width={100} height={100} alt="reload" priority />}
        </button>

        {avatarIcon && <Image src={avatarIcon} alt="Avatar" width={96} height={96} loading="eager" unoptimized />}
        <div className={styles.profileDetails}>
          <p>{player.nickname}</p>
          <p>{player.uid}</p>
        </div>
      </section>

      <section className={styles.characterSection}>
        {characters.map((character, index) => {
          const characterIcon = assetUrl(character.icon);
          return (
            <button
              type="button"
              key={character.id}
              aria-label={character.name ?? character.id}
              className={`${styles.characterButton} ${selectedCharacterIndex === index ? styles.selected : ""}`}
              onClick={() => handleCharacterClick(index)}
            >
              {characterIcon && <Image src={characterIcon} alt="Character" width={128} height={128} loading="eager" unoptimized />}
            </button>
          );
        })}
      </section>

      {selected && selectedCharacterIndex !== null && (
        <section className={styles.relicSection}>
          <div className={styles.canvasWrap}>
            {selected.relics.map((relic, index) => (
              <Link key={`${selectedCharacterIndex}-${index}`} href={`/build/simulator?uid=${uid}&c=${selectedCharacterIndex}&r=${index}`} className={styles.relicButton}>
                <RelicCanvasItem relic={relic} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {selected && (
        <section className={styles.buildSection}>
          <BuildCanvasItem key={selectedCharacterIndex} build={selected.build} />
        </section>
      )}
    </main>
  );
}
