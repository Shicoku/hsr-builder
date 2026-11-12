"use client";

import { useEffect, useMemo, useState } from "react";
import { maxVal, type Weight, weightData } from "../../../lib/utils/scorer";
import styles from "../../styles/score.module.css";

const STAT_LABELS: Record<string, string> = {
  HPDelta: "HP(実数)",
  AttackDelta: "攻撃力(実数)",
  DefenceDelta: "防御力(実数)",
  HPAddedRatio: "HP(%)",
  AttackAddedRatio: "攻撃力(%)",
  DefenceAddedRatio: "防御力(%)",
  SpeedDelta: "速度",
  CriticalChanceBase: "会心率(%)",
  CriticalDamageBase: "会心ダメージ(%)",
  StatusProbabilityBase: "効果命中",
  StatusResistanceBase: "効果抵抗",
  BreakDamageAddedRatioBase: "撃破特攻",
  HealRatioBase: "治癒量",
  PhysicalAddedRatio: "物理属性ダメージ",
  FireAddedRatio: "火属性ダメージ",
  IceAddedRatio: "氷属性ダメージ",
  ThunderAddedRatio: "雷属性ダメージ",
  WindAddedRatio: "風属性ダメージ",
  QuantumAddedRatio: "量子属性ダメージ",
  ImaginaryAddedRatio: "虚数属性ダメージ",
  SPRatioBase: "EP回復効率",
};

const PARTS: Record<number, string> = {
  1: "頭",
  2: "手",
  3: "胴体",
  4: "足",
  5: "オーブ",
  6: "縄",
};

type SubInput = { type: string; value: string };
type CharacterWeight = Weight & { name?: string; path?: string };
const characters = Object.entries(
  weightData as Record<string, CharacterWeight>,
).filter(([, item]) => item?.main && item?.weight);

function rankFor(score: number) {
  if (score >= 100) return "SS";
  if (score >= 90) return "S";
  if (score >= 60) return "A";
  if (score >= 40) return "B";
  if (score >= 10) return "C";
  return "D";
}

export default function ScoreToolPage() {
  const [localizedNames, setLocalizedNames] = useState<Record<string, string>>(
    {},
  );
  const [localizedPaths, setLocalizedPaths] = useState<Record<string, string>>(
    {},
  );
  const [characterId, setCharacterId] = useState("");
  const [slot, setSlot] = useState(1);
  const [level, setLevel] = useState(15);
  const [mainType, setMainType] = useState("");
  const [subs, setSubs] = useState<SubInput[]>([
    { type: "", value: "" },
    { type: "", value: "" },
    { type: "", value: "" },
    { type: "", value: "" },
  ]);

  useEffect(() => {
    let cancelled = false;
    fetch(
      "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/index_min/jp/characters.json",
    )
      .then((response) => {
        if (!response.ok)
          throw new Error("キャラクター名を取得できませんでした");
        return response.json() as Promise<
          Record<string, { name?: string; path?: string }>
        >;
      })
      .then((data) => {
        if (!cancelled) {
          setLocalizedNames(
            Object.fromEntries(
              Object.entries(data).map(([id, item]) => [id, item.name ?? ""]),
            ),
          );
          setLocalizedPaths(
            Object.fromEntries(
              Object.entries(data).map(([id, item]) => [id, item.path ?? ""]),
            ),
          );
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const sortedCharacters = useMemo(() => {
    const pathLabels: Record<string, string> = {
      destruction: "壊滅",
      warrior: "壊滅",
      preservation: "存護",
      knight: "存護",
      hunt: "巡狩",
      rogue: "巡狩",
      erudition: "知恵",
      mage: "知恵",
      nihility: "虚無",
      warlock: "虚無",
      abundance: "豊穣",
      priest: "豊穣",
      harmony: "調和",
      shaman: "調和",
      remembrance: "記憶",
      memory: "記憶",
      elation: "愉悦",
    };
    const fallbackPaths: Record<string, string> = {
      "8001": "Destruction",
      "8003": "Preservation",
      "8005": "Harmony",
      "8007": "Remembrance",
    };
    const seenTrailblazerPaths = new Set<string>();

    return characters
      .filter(([id]) => !/^800\d+$/.test(id) || Number(id) % 2 === 1)
      .map(([id, item]) => {
        const rawName = localizedNames[id] || item.name || "";
        const isTrailblazer = /^800\d+$/.test(id) || rawName.includes("{NICKNAME}");
        const name = rawName.replaceAll("{NICKNAME}", "開拓者");
        const rawPath = localizedPaths[id] || item.path || fallbackPaths[id] || "";
        const normalizedPath = rawPath
          .replace(/^Path\s*of\s*/i, "")
          .replace(/[^a-z]/gi, "")
          .toLowerCase();
        const path =
          pathLabels[normalizedPath] ||
          (/[^\u0000-\u007f]/.test(rawPath) ? rawPath : "");
        const displayName = isTrailblazer ? "開拓者" : name;
        return [
          id,
          item,
          isTrailblazer && path ? `${displayName}(${path})` : displayName,
          path,
          isTrailblazer,
        ] as const;
      })
      .filter(([, , name, path, isTrailblazer]) => {
        if (!name) return false;
        if (!isTrailblazer) return true;
        if (!path || seenTrailblazerPaths.has(path)) return false;
        seenTrailblazerPaths.add(path);
        return true;
      })
      .sort((a, b) => a[2].localeCompare(b[2], "ja"));
  }, [localizedNames, localizedPaths]);

  const character = characterId
    ? (weightData as Record<string, CharacterWeight>)[characterId]
    : undefined;
  const mainOptions = Object.keys(character?.main?.[slot] ?? {}).filter(
    (type) => (character?.main?.[slot]?.[type] ?? 0) > 0,
  );
  const subOptions = Object.keys(character?.weight ?? {}).filter(
    (type) =>
      type !== mainType &&
      (character?.weight?.[type] ?? 0) > 0 &&
      type in maxVal,
  );

  const result = useMemo(() => {
    if (!character || !mainType) return null;
    const mainWeight = character.main[slot]?.[mainType] ?? 0;
    const mainScore = ((level + 1) / 16) * mainWeight * 100;
    const subScore = subs.reduce((sum, sub) => {
      if (!sub.type || sub.value === "") return sum;
      const value = Number(sub.value);
      if (!Number.isFinite(value) || value < 0) return sum;
      const normalizedValue =
        maxVal[sub.type as keyof typeof maxVal] < 1 ? value / 100 : value;
      return (
        sum +
        (normalizedValue / maxVal[sub.type as keyof typeof maxVal]) *
          (character.weight[sub.type] ?? 0) *
          100
      );
    }, 0);
    const score = mainScore * 0.5 + subScore * 0.5;
    return { mainScore, subScore, score };
  }, [character, level, mainType, slot, subs]);

  function updateSub(index: number, field: keyof SubInput, value: string) {
    setSubs((current) =>
      current.map((sub, i) => (i === index ? { ...sub, [field]: value } : sub)),
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>遺物スコア計算</h1>
          <p className={styles.description}>
            キャラクターと遺物のステータスを入力すると、遺物1個分のスコアを計算します。
          </p>
        </header>

        <div className={styles.layout}>
          <section className={styles.formPanel} aria-labelledby="input-heading">
            <h2 id="input-heading" className={styles.sectionTitle}>
              遺物データ
            </h2>
            <div className={styles.fields}>
              <label className={styles.field}>
                <span>キャラクター</span>
                <select
                  value={characterId}
                  onChange={(event) => {
                    setCharacterId(event.target.value);
                    setMainType("");
                  }}
                >
                  <option value="">選択してください</option>
                  {sortedCharacters.map(([id, , name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
              <div className={styles.fieldRow}>
                <label className={styles.field}>
                  <span>部位</span>
                  <select
                    value={slot}
                    onChange={(event) => {
                      setSlot(Number(event.target.value));
                      setMainType("");
                    }}
                  >
                    {Object.entries(PARTS).map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>遺物レベル</span>
                  <select
                    value={level}
                    onChange={(event) => setLevel(Number(event.target.value))}
                  >
                    {Array.from({ length: 16 }, (_, i) => (
                      <option key={i} value={i}>
                        +{i}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className={styles.field}>
                <span>メインステータス</span>
                <select
                  value={mainType}
                  onChange={(event) => {
                    const nextMainType = event.target.value;
                    setMainType(nextMainType);
                    setSubs((current) =>
                      current.map((sub) =>
                        sub.type === nextMainType
                          ? { type: "", value: "" }
                          : sub,
                      ),
                    );
                  }}
                  disabled={!character}
                >
                  <option value="">選択してください</option>
                  {mainOptions.map((type) => (
                    <option key={type} value={type}>
                      {STAT_LABELS[type] ?? type}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <fieldset className={styles.subFieldset}>
              <legend>
                サブステータス <span>（入力は任意）</span>
              </legend>
              <div className={styles.subList}>
                {subs.map((sub, index) => (
                  <div className={styles.subRow} key={index}>
                    <label
                      className={styles.srOnly}
                      htmlFor={`sub-stat-${index}`}
                    >
                      サブステータス {index + 1}
                    </label>
                    <select
                      id={`sub-stat-${index}`}
                      value={sub.type}
                      disabled={!character}
                      onChange={(event) =>
                        updateSub(index, "type", event.target.value)
                      }
                    >
                      <option value="">未選択</option>
                      {subOptions.map((type) => (
                        <option key={type} value={type}>
                          {STAT_LABELS[type] ?? type}
                        </option>
                      ))}
                    </select>
                    <label
                      className={styles.srOnly}
                      htmlFor={`sub-value-${index}`}
                    >
                      サブステータス {index + 1} の値
                    </label>
                    <input
                      id={`sub-value-${index}`}
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      placeholder="値"
                      value={sub.value}
                      onChange={(event) =>
                        updateSub(index, "value", event.target.value)
                      }
                      disabled={!sub.type}
                    />
                  </div>
                ))}
              </div>
              <p className={styles.hint}>
                %表示のステータスはゲーム内の表示値（例：3.2）で入力してください。
              </p>
            </fieldset>
          </section>

          <aside
            className={styles.resultPanel}
            aria-live="polite"
            aria-label="計算結果"
          >
            <p className={styles.resultLabel}>遺物スコア</p>
            {result ? (
              <>
                <div className={styles.scoreLine}>
                  <strong>{result.score.toFixed(1)}</strong>
                  <span>{rankFor(result.score)}</span>
                </div>
                <dl className={styles.breakdown}>
                  <div>
                    <dt>メインスコア（50%）</dt>
                    <dd>{result.mainScore.toFixed(1)}</dd>
                  </div>
                  <div>
                    <dt>サブスコア（50%）</dt>
                    <dd>{result.subScore.toFixed(1)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className={styles.resultPlaceholder}>
                キャラクターとメインステータスを選ぶと、スコアが表示されます。
              </p>
            )}
            <p className={styles.formula}>
              遺物スコア = メインスコア × 0.5 + サブスコア × 0.5
            </p>
            <p className={styles.estimateNote}>
              スコアはキャラクター別の重みと入力値から算出した推定値です。目安としてご利用ください。
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
