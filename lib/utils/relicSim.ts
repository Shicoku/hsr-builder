import { calcSubScore, type Weight } from "./scorer";

export type Quality = 0 | 1 | 2;

export const ROLL = {
  HPDelta: [33.87, 38.1, 42.34],
  AttackDelta: [16.94, 19.05, 21.17],
  DefenceDelta: [16.94, 19.05, 21.17],
  HPAddedRatio: [3.456, 3.888, 4.32],
  AttackAddedRatio: [3.456, 3.888, 4.32],
  DefenceAddedRatio: [4.32, 4.86, 5.4],
  CriticalChanceBase: [2.592, 2.916, 3.24],
  CriticalDamageBase: [5.184, 5.832, 6.48],
  SpeedDelta: [2.0, 2.3, 2.6],
  BreakDamageAddedRatioBase: [5.184, 5.832, 6.48],
  StatusProbabilityBase: [3.456, 3.888, 4.32],
  StatusResistanceBase: [3.456, 3.888, 4.32],
} as const;

export type StatType = keyof typeof ROLL;

export const STAT_LABEL: Record<StatType, string> = {
  HPDelta: "HP",
  AttackDelta: "攻撃力",
  DefenceDelta: "防御力",
  HPAddedRatio: "HP%",
  AttackAddedRatio: "攻撃力%",
  DefenceAddedRatio: "防御力%",
  CriticalChanceBase: "会心率",
  CriticalDamageBase: "会心ダメージ",
  SpeedDelta: "速度",
  BreakDamageAddedRatioBase: "撃破特効",
  StatusProbabilityBase: "効果命中",
  StatusResistanceBase: "効果抵抗",
};

const FIXED: StatType[] = ["HPDelta", "AttackDelta", "DefenceDelta", "SpeedDelta"];

export const isPercent = (type: string) => !FIXED.includes(type as StatType);

export type SubAffix = { type: string; value: number; count: number; step: number };
export type RolledSub = { type: string; value: number; count: number };

const randQ = (): Quality => Math.floor(Math.random() * 3) as Quality;

// 1回分のロール値(データ上の単位。%系は 0.0324 のような割合)
function rollValue(type: string, q: Quality): number {
  const v = ROLL[type as StatType][q];
  return isPercent(type) ? v / 100 : v;
}

// 表示用の値(%系は 3.2 のようにパーセント単位)
export function displayValue(value: number, type: string): number {
  if (type === "SpeedDelta") return Math.floor(value * 10) / 10;
  if (!isPercent(type)) return Math.floor(value);
  return Math.floor(value * 1000) / 10;
}

// 初期値の推定: 現在値から強化分を引く
export function estimateInitial(e: SubAffix) {
  const low = rollValue(e.type, 0);
  const unit = rollValue(e.type, 1) - low;
  const initial = e.value - (low * (e.count - 1) + unit * e.step);
  const quality = Math.min(2, Math.max(0, Math.round((initial - low) / unit))) as Quality;
  return { initial, quality };
}

// 再抽選を1回行う(種類は固定、初期値と強化を振り直す)
export function rerollOnce(subs: SubAffix[]): RolledSub[] {
  const rollCount = subs.reduce((sum, e) => sum + (e.count - 1), 0); // 4 or 5
  const result = subs.map((e) => ({
    type: e.type,
    value: rollValue(e.type, randQ()),
    count: 1,
  }));

  for (let i = 0; i < rollCount; i++) {
    const target = result[Math.floor(Math.random() * result.length)]!;
    target.value += rollValue(target.type, randQ());
    target.count += 1;
  }
  return result;
}

// 遺物スコア(Score関数と同じ式: メイン×0.5 + サブ×0.5)
export function relicScore(subs: { type: string; value: number }[], weight: Weight, mainScore: number) {
  return mainScore * 0.5 + calcSubScore(subs, weight) * 0.5;
}

export type SimResult = {
  n: number;
  base: number;
  min: number;
  max: number;
  mean: number;
  upRate: number; // 0〜1
  lo: number; // 最初の階級の下限(スコア)
  bins: number[]; // 1点幅の度数
};

export function runSimulation(subs: SubAffix[], weight: Weight, mainScore: number, n = 100_000): SimResult {
  const base = relicScore(subs, weight, mainScore);
  const scores = new Float64Array(n);

  let min = Infinity;
  let max = -Infinity;
  let sum = 0;
  let up = 0;

  for (let i = 0; i < n; i++) {
    const s = relicScore(rerollOnce(subs), weight, mainScore);
    scores[i] = s;
    if (s < min) min = s;
    if (s > max) max = s;
    sum += s;
    if (s > base + 1e-9) up++;
  }

  const lo = Math.floor(Math.min(min, base));
  const hi = Math.floor(Math.max(max, base));
  const bins = new Array<number>(hi - lo + 1).fill(0);
  for (const s of scores) {
    const idx = Math.floor(s) - lo;
    bins[idx] = (bins[idx] ?? 0) + 1;
  }

  return { n, base, min, max, mean: sum / n, upRate: up / n, lo, bins };
}
