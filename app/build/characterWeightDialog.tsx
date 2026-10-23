import type { Weight } from "../../lib/utils/scorer";
import styles from "../styles/build.module.css";

const STAT_LABELS: Record<string, string> = {
  HPDelta: "HP(実数)",
  AttackDelta: "攻撃力(実数)",
  DefenceDelta: "防御力(実数)",
  HPAddedRatio: "HP(%)",
  AttackAddedRatio: "攻撃力(%)",
  DefenceAddedRatio: "防御力(%)",
  SpeedDelta: "速度",
  CriticalChanceBase: "会心率",
  CriticalDamageBase: "会心ダメージ",
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

const parts: Record<string, string> = {
  "1": "頭",
  "2": "手",
  "3": "胴体",
  "4": "足",
  "5": "オーブ",
  "6": "縄",
};

type CharacterWeightDialogProps = {
  characterName: string;
  weight: Weight;
  onClose: () => void;
};

export default function CharacterWeightDialog({
  characterName,
  weight,
  onClose,
}: CharacterWeightDialogProps) {
  return (
    <div className={styles.weightOverlay} onClick={onClose}>
      <section
        className={styles.weightSection}
        role="dialog"
        aria-modal="true"
        aria-labelledby="weight-heading"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.weightCloseButton}
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </button>
        <h2 id="weight-heading">{characterName}</h2>
        <div className={styles.weightGroups}>
          <div className={styles.weightGroup}>
            <h3>メインステータス</h3>
            {Object.entries(weight.main)
              .filter(([slot]) => slot !== "0")
              .map(([slot, stats]) => (
                <div className={styles.weightRow} key={slot}>
                  <strong>{parts[slot] ?? `部位${slot}`}</strong>
                  <span>
                    {Object.entries(stats)
                      .filter(([, value]) => value !== 0)
                      .map(
                        ([stat, value]) =>
                          `${STAT_LABELS[stat] ?? stat} ${value}`,
                      )
                      .join(" / ")}
                  </span>
                </div>
              ))}
          </div>
          <div className={styles.weightGroup}>
            <h3>サブステータス</h3>
            {Object.entries(weight.weight)
              .filter(([, value]) => value !== 0)
              .map(([stat, value]) => (
                <div className={styles.weightRow} key={stat}>
                  <strong>{STAT_LABELS[stat] ?? stat}</strong>
                  <span>{value}</span>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
