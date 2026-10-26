"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

type BuildState = {
  uid: string | null;
  player: Player | null;
  characters: Character[];
  selectedCharacterId: string | null;
};

const INITIAL_STATE: BuildState = {
  uid: null,
  player: null,
  characters: [],
  selectedCharacterId: null,
};

export function BuildProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(INITIAL_STATE);

  const setLoaded = useCallback(
    (uid: string, player: Player, characters: Character[]) => {
      setState((current) => {
        const selectedCharacterId =
          current.uid === uid ? current.selectedCharacterId : null;
        const hasSelection =
          selectedCharacterId &&
          characters.some((character) => character.id === selectedCharacterId);

        return {
          uid,
          player,
          characters,
          selectedCharacterId: hasSelection ? selectedCharacterId : null,
        };
      });
    },
    [],
  );

  const setSelectedCharacterIndex = useCallback((index: number | null) => {
    setState((current) => ({
      ...current,
      selectedCharacterId:
        index === null ? null : (current.characters[index]?.id ?? null),
    }));
  }, []);

  const selectedCharacterIndex = state.characters.findIndex(
    (character) => character.id === state.selectedCharacterId,
  );
  const value = useMemo(
    () => ({
      uid: state.uid,
      player: state.player,
      characters: state.characters,
      selectedCharacterIndex:
        selectedCharacterIndex >= 0 ? selectedCharacterIndex : null,
      setLoaded,
      setSelectedCharacterIndex,
    }),
    [state, selectedCharacterIndex, setLoaded, setSelectedCharacterIndex],
  );

  return (
    <BuildContext.Provider value={value}>{children}</BuildContext.Provider>
  );
}

export function useBuildStore() {
  const ctx = useContext(BuildContext);
  if (!ctx) throw new Error("BuildProvider の外で使われています");
  return ctx;
}
