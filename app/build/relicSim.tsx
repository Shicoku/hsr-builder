"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "../styles/simulator.module.css";
import { calcMainScore, getWeight } from "../../lib/utils/scorer";
import {
  STAT_LABEL,
  displayValue,
  estimateInitial,
  isPercent,
  relicScore,
  /*rerollOnce,*/ runSimulation,
  /*type RolledSub,*/ type SimResult,
  type StatType,
  type SubAffix,
} from "../../lib/utils/relicSim";

const N = 100_000;

const fmt = (n: number) => n.toFixed(1);
const label = (type: string) => STAT_LABEL[type as StatType] ?? type;
const show = (value: number, type: string) => `${displayValue(value, type)}${isPercent(type) ? "%" : ""}`;

// メインステータスの表示値(四捨五入。%系は小数第1位まで)
const showMain = (value: number, type: string) => (isPercent(type) ? `${(Math.round(value * 1000) / 10).toFixed(1)}%` : `${Math.round(value)}`);

function assetUrl(icon: string | undefined) {
  if (!icon) return undefined;
  if (icon.startsWith("http://") || icon.startsWith("https://")) return icon;
  return `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${icon}`;
}

type Props = {
  relic: any;
  charId: string;
  slot: number;
};

export default function RelicSimulator({ relic, charId, slot }: Props) {
  // const [rerolled, setRerolled] = useState<RolledSub[] | null>(null);
  const [sim, setSim] = useState<SimResult | null>(null);

  const weight = useMemo(() => getWeight(charId), [charId]);
  const subs: SubAffix[] = relic.sub_affix;
  const mainScore = useMemo(() => calcMainScore(relic, weight, slot), [relic, weight, slot]);

  useEffect(() => {
    if (relic.level < 15) return;

    let cancelled = false;
    const id = setTimeout(() => {
      const result = runSimulation(subs, weight, mainScore, N);
      if (!cancelled) setSim(result);
    }, 30);

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [relic, subs, weight, mainScore]);

  if (relic.level < 15) {
    return (
      <div className={styles.simulator}>
        <RelicHeader relic={relic} />
        <p className={styles.note}>再抽選できるのはLv15の遺物のみです。</p>
      </div>
    );
  }

  const base = relicScore(subs, weight, mainScore);
  // const rerolledScore = rerolled ? relicScore(rerolled, weight, mainScore) : 0;

  return (
    <div className={styles.simulator}>
      <RelicHeader relic={relic} />

      <div className={styles.statusWrap}>
        <div>
          <h3>現在の遺物(スコア {fmt(base)})</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ステータス</th>
                <th>現在値</th>
                <th>初期値(推定)</th>
                <th>強化</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((e) => {
                const { initial } = estimateInitial(e);
                return (
                  <tr key={e.type}>
                    <td>{label(e.type)}</td>
                    <td>{show(e.value, e.type)}</td>
                    <td>{show(initial, e.type)}</td>
                    <td>{e.count - 1}回</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div>
          <h3>{N.toLocaleString()}回シミュレーションの結果</h3>
          {sim ? (
            <>
              <p>
                最低 {fmt(sim.min)} / 最高 {fmt(sim.max)} / 平均 {fmt(sim.mean)} / スコアが上がる確率 {(sim.upRate * 100).toFixed(2)}%
              </p>
              <Histogram r={sim} />
            </>
          ) : (
            <p className={styles.note}>計算中...</p>
          )}
        </div>
      </div>

      {/* <div className={styles.actions}>
        <button type="button" onClick={() => setRerolled(rerollOnce(subs))}>
          振り直す
        </button>
      </div>

      {rerolled && (
        <>
          <h3>
            振り直し結果(スコア {fmt(rerolledScore)} / {rerolledScore >= base ? "+" : ""}
            {fmt(rerolledScore - base)})
          </h3>
          <table className={styles.table}>
            <tbody>
              {rerolled.map((e) => (
                <tr key={e.type}>
                  <td>{label(e.type)}</td>
                  <td>{show(e.value, e.type)}</td>
                  <td>{e.count - 1}回</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )} */}
    </div>
  );
}

function RelicHeader({ relic }: { relic: any }) {
  const main = relic.main_affix;
  const relicIcon = assetUrl(relic.icon);
  const mainIcon = assetUrl(main?.icon);
  const mainLabel = main?.name ?? STAT_LABEL[main?.type as StatType] ?? main?.type;
  const mainValue = main ? showMain(main.value, main.type) : "";

  return (
    <div className={styles.relicHeader}>
      {relicIcon && <Image src={relicIcon} alt={relic.name ?? "遺物"} width={80} height={80} unoptimized />}
      <div>
        <p className={styles.relicName}>{relic.name}</p>
        <p>+{relic.level}</p>
        <p className={styles.mainStat}>
          {mainIcon && <Image src={mainIcon} alt="" width={24} height={24} unoptimized />}
          {mainLabel} {mainValue}
        </p>
      </div>
    </div>
  );
}

function Histogram({ r }: { r: SimResult }) {
  const W = 800;
  const H = 360;
  const M = { l: 10, r: 10, t: 20, b: 30 };
  const bw = (W - M.l - M.r) / r.bins.length;
  const plotH = H - M.t - M.b;
  const maxCount = r.bins.reduce((a, b) => Math.max(a, b), 1);
  const baseX = M.l + (r.base - r.lo) * bw;
  const labelStep = Math.ceil(r.bins.length / 10);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.histogram}>
      {r.bins.map((c, i) => {
        const h = (c / maxCount) * plotH;
        const from = r.lo + i;
        return (
          <rect key={i} x={M.l + i * bw} y={H - M.b - h} width={Math.max(bw - 1, 1)} height={h} fill={from + 0.5 > r.base ? "#e5534b" : "#6b7fd7"}>
            <title>{`${from}〜${from + 1}: ${c}回`}</title>
          </rect>
        );
      })}
      {r.bins.map((_, i) =>
        i % labelStep === 0 ? (
          <text key={i} x={M.l + i * bw} y={H - M.b + 16} fontSize="12" textAnchor="middle" fill="currentColor">
            {r.lo + i}
          </text>
        ) : null,
      )}
      <line x1={M.l} x2={W - M.r} y1={H - M.b} y2={H - M.b} stroke="#888" />
      <line x1={baseX} x2={baseX} y1={M.t} y2={H - M.b} stroke="currentColor" strokeDasharray="4" />
      <text x={baseX + 4} y={M.t + 12} fontSize="12" fill="currentColor">
        現在
      </text>
    </svg>
  );
}
