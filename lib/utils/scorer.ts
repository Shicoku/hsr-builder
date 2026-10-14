const res = await fetch("https://raw.githubusercontent.com/Mar-7th/StarRailScore/refs/heads/master/score.json");
const weightData = await res.json();

// const maxVal = JSON.parse(fs.readFileSync("assets/max_value.json", "utf-8"));

export const maxVal = {
  HPDelta: 252,
  AttackDelta: 126,
  DefenceDelta: 126,
  HPAddedRatio: 0.259,
  AttackAddedRatio: 0.259,
  DefenceAddedRatio: 0.324,
  CriticalChanceBase: 0.194,
  CriticalDamageBase: 0.388,
  SpeedDelta: 15,
  BreakDamageAddedRatioBase: 0.388,
  StatusProbabilityBase: 0.259,
  StatusResistanceBase: 0.259,
};

export type Weight = {
  main: Record<number, Record<string, number>>;
  weight: Record<string, number>;
};

export function getWeight(charId: string | number): Weight {
  return (weightData as any)[charId];
}

export function calcMainScore(relic: any, weight: Weight, slot: number) {
  return ((relic.level + 1) / 16) * (weight.main[slot]?.[relic.main_affix.type] ?? 0) * 100;
}

export function calcSubScore(subs: { type: string; value: number }[], weight: Weight) {
  let s = 0;
  for (const sub of subs) {
    s += (sub.value / maxVal[sub.type as keyof typeof maxVal]) * (weight.weight[sub.type] ?? 0) * 100;
  }
  return s;
}

// export function Score(cid: number, data: any) {
//   const score = [];
//   const charData = data[cid];
//   const weight = weightData[charData.id];

//   for (let i = 0; i < charData.relics.length; i++) {
//     const relic = charData.relics[i];
//     const mainScore = ((relic.level + 1) / 16) * weight.main[i + 1][relic.main_affix.type] * 100;
//     let subScore = 0;

//     for (let j = 0; j < relic.sub_affix.length; j++) {
//       const sub = relic.sub_affix[j];
//       subScore += (sub.value / maxVal[sub.type as keyof typeof maxVal]) * weight.weight[sub.type] * 100;
//     }

//     const totalScore = mainScore * 0.5 + subScore * 0.5;

//     const scoreData = {
//       mainScore: mainScore,
//       subScore: subScore,
//       totalScore: totalScore,
//       finalScore: Number(totalScore.toFixed(1)),
//     };
//     score.push(scoreData);
//   }

//   return score;
// }

export function Score(cid: number, data: any) {
  const score = [];
  const charData = data[cid];
  const weight = getWeight(charData.id);

  for (let i = 0; i < charData.relics.length; i++) {
    const relic = charData.relics[i];
    const mainScore = calcMainScore(relic, weight, i + 1);
    const subScore = calcSubScore(relic.sub_affix, weight);
    const totalScore = mainScore * 0.5 + subScore * 0.5;

    score.push({
      mainScore,
      subScore,
      totalScore,
      finalScore: Number(totalScore.toFixed(1)),
    });
  }

  return score;
}
