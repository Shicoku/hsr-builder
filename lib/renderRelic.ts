export function RenderRelic(cid: number, data: any, score: any) {
  const relicData = data[cid].relics;
  const array: any[] = [];

  for (let i = 0; i < relicData.length; i++) {
    const relic = relicData[i];
    const arrayData = {
      id: relic.id,
      name: relic.name,
      rarity: relic.rarity,
      level: relic.level,
      icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + relic.icon,
      score: score[i].finalScore,
      main: {
        name: cleanAffixName(relic.main_affix.name),
        icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + relic.main_affix.icon,
        display: relic.main_affix.display,
      },
      sub: relic.sub_affix.map((sub: any) => ({
        name: cleanAffixName(sub.name),
        icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + sub.icon,
        display: sub.display,
      })),
    };
    array.push(arrayData);
  }
  return array;
}

function cleanAffixName(name: string): string {
  return name
    .replace(/..?属性ダメージ/, "属性ダメ")
    .replace("会心ダメージ", "会心ダメ")
    .replace("EP回復効率", "EP回復")
    .replace("基礎", "");
}
