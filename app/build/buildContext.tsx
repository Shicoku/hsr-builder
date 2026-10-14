"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

export type Player = {
  uid?: string;
  nickname?: string;
  avatar?: { icon?: string };
};

export type Character = {
  id: string;
  name?: string;
  icon?: string;
};

type BuildStore = {
  uid: string | null;
  player: Player | null;
  characters: Character[];
  selectedCharacterIndex: number | null;
  setLoaded: (uid: string, player: Player, characters: Character[]) => void;
  setSelectedCharacterIndex: (index: number | null) => void;
};

const BuildContext = createContext<BuildStore | null>(null);

export function BuildProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number | null>(null);
  const uidRef = useRef<string | null>(null);

  const setLoaded = useCallback((nextUid: string, nextPlayer: Player, nextCharacters: Character[]) => {
    // 別のUIDを読み込んだときは選択をリセットする
    if (uidRef.current !== nextUid) setSelectedCharacterIndex(null);
    uidRef.current = nextUid;
    setUid(nextUid);
    setPlayer(nextPlayer);
    setCharacters(nextCharacters);
  }, []);

  const value = useMemo(() => ({ uid, player, characters, selectedCharacterIndex, setLoaded, setSelectedCharacterIndex }), [uid, player, characters, selectedCharacterIndex, setLoaded]);

  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuildStore() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("BuildProvider の外で使われています");
  return ctx;
}
