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
  const charactersRef = useRef(characters);
  const selectedCharacterIndexRef = useRef(selectedCharacterIndex);

  const updateSelectedCharacterIndex = useCallback((index: number | null) => {
    selectedCharacterIndexRef.current = index;
    setSelectedCharacterIndex(index);
  }, []);

  const setLoaded = useCallback((nextUid: string, nextPlayer: Player, nextCharacters: Character[]) => {
    const isSameUid = uidRef.current === nextUid;
    const currentIndex = selectedCharacterIndexRef.current;
    const selectedCharacterId = isSameUid && currentIndex !== null
      ? charactersRef.current[currentIndex]?.id
      : undefined;

    // 再取得後も同じキャラクターを選択し、一覧の順序変更にも追従する
    const nextSelectedIndex = selectedCharacterId
      ? nextCharacters.findIndex((character) => character.id === selectedCharacterId)
      : -1;
    updateSelectedCharacterIndex(nextSelectedIndex >= 0 ? nextSelectedIndex : null);
    uidRef.current = nextUid;
    setUid(nextUid);
    charactersRef.current = nextCharacters;
    setPlayer(nextPlayer);
    setCharacters(nextCharacters);
  }, [updateSelectedCharacterIndex]);

  const value = useMemo(() => ({ uid, player, characters, selectedCharacterIndex, setLoaded, setSelectedCharacterIndex: updateSelectedCharacterIndex }), [uid, player, characters, selectedCharacterIndex, setLoaded, updateSelectedCharacterIndex]);

  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuildStore() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("BuildProvider の外で使われています");
  return ctx;
}
