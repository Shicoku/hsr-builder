export type ScoreKey =
  | "HPDelta"
  | "AttackDelta"
  | "DefenceDelta"
  | "SpeedDelta"
  | "CriticalChanceBase"
  | "CriticalDamageBase"
  | "StatusProbabilityBase"
  | "StatusResistanceBase"
  | "HealRatioBase"
  | "BreakDamageAddedRatioBase"
  | "SPRatioBase"
  | "HPAddedRatio"
  | "AttackAddedRatio"
  | "DefenceAddedRatio"
  | "PhysicalAddedRatio"
  | "FireAddedRatio"
  | "IceAddedRatio"
  | "ThunderAddedRatio"
  | "WindAddedRatio"
  | "QuantumAddedRatio"
  | "ImaginaryAddedRatio";

export type ScoreMap = Partial<Record<ScoreKey, number>>;

export interface charDataBase {
  name: string;
  main: Record<number, ScoreMap>;
  weight: ScoreMap;
}
