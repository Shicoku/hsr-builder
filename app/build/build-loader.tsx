"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/build.module.css";

// import { Score } from "../../lib/parser";
import { Score } from "../../lib/scorer";
import { RenderRelic } from "../../lib/renderRelic";

import RelicCanvasItem from "./relicCanvasItem";

type Player = {
  uid?: string;
  nickname?: string;
  avatar?: { icon?: string };
};

type Character = {
  id: string;
  name?: string;
  icon?: string;
};

type ApiResponse = {
  data?: { player?: Player; characters?: Character[] };
  error?: string;
  retryAfterSeconds?: number;
};

function assetUrl(icon: string | undefined) {
  if (!icon) return undefined;
  if (icon.startsWith("http://") || icon.startsWith("https://")) return icon;
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${icon}`;
}

export default function BuildLoader({ uid }: { uid: string }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number | null>(null);
  const [selectedInfo, setSelectedInfo] = useState<ReturnType<typeof RenderRelic> | null>(null);

  const isValidUid = /^\d{9}$/.test(uid);

  const handleCharacterClick = (characterId: number) => {
    setSelectedCharacterIndex((prev) => (prev === characterId ? null : characterId));
    const score = Score(characterId, characters);
    const result = RenderRelic(characterId, characters, score);
    console.log("Selected Character Info:", result);
    setSelectedInfo(result);
  };

  useEffect(() => {
    if (!isValidUid) return;

    const controller = new AbortController();
    let retryTimer: number | undefined;

    async function loadProfile() {
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

        setPlayer(result.data.player);
        setCharacters(result.data.characters?.slice(0, 7) ?? []);
      } catch (fetchError) {
        if (controller.signal.aborted) return;
        setError(fetchError instanceof Error ? fetchError.message : "情報を取得できませんでした。");
      }
    }

    void loadProfile();
    return () => {
      controller.abort();
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [isValidUid, requestVersion, uid]);

  if (!isValidUid) return <main>URLに有効なUIDが指定されていません。</main>;
  if (error) return <main>{error}</main>;

  if (!player) {
    return (
      <main className={styles.main}>
        <p>ロード中</p>
      </main>
    );
  }

  const avatarIcon = assetUrl(player.avatar?.icon);

  return (
    <main className={`${styles.main} ${styles.profileMain}`}>
      <section className={styles.profileSection}>
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
              className={`${styles.characterButton} ${selectedCharacterIndex == index ? styles.selected : ""}`}
              onClick={() => handleCharacterClick(index)}
            >
              {characterIcon && <Image src={characterIcon} alt="Character" width={128} height={128} loading="eager" unoptimized />}
            </button>
          );
        })}
      </section>

      {selectedInfo && (
        <section className={styles.relicSection}>
          {selectedInfo.map((relic, index) => (
            <RelicCanvasItem key={index} relic={relic} />
          ))}
        </section>
      )}
    </main>
  );
}
