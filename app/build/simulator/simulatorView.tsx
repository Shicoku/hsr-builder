"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../styles/build.module.css";
import sim from "../../styles/simulator.module.css";
import { useBuildStore } from "../buildContext";
import RelicSimulator from "../relicSim";

export default function SimulatorView() {
  const router = useRouter();
  const params = useSearchParams();
  const store = useBuildStore();

  const uid = params.get("uid") ?? "";
  const c = Number(params.get("c"));
  const r = Number(params.get("r"));

  const character = store.uid === uid ? (store.characters[c] as any) : undefined;
  const relic = character?.relics?.[r];

  useEffect(() => {
    if (!relic) router.replace(/^\d{9}$/.test(uid) ? `/build?uid=${uid}` : "/");
  }, [relic, router, uid]);

  if (!relic) return null;

  return (
    <main className={styles.main}>
      <div className={sim.toolbar}>
        <button type="button" className={sim.btn} onClick={() => router.back()}>
          ← 戻る
        </button>
      </div>
      <RelicSimulator relic={relic} charId={character.id} slot={r + 1} />
    </main>
  );
}
