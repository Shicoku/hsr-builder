import { charData, Skill, RankIcon, LightCone, Relic, RelicSet, Status } from "../types/starrail";

export function parserChar(cid: number, player: any, character: any, score: any): charData | null {
  if (!player || !character || !character[cid]) return null;
  const char = character[cid];

  const total_score = score.reduce((sum: number, ts: any) => sum + ts.totalScore, 0);

  const skill: Skill[] = char.skills.slice(0, 4).map((s: any) => ({
    level: s.level,
    icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + s.icon,
  }));

  const rank_icons: RankIcon[] = Array.from({ length: 6 }, (_, i) => ({
    icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + char.rank_icons[i],
    lock: i >= char.rank ? true : false,
  }));

  const light_cone: LightCone | undefined = char.light_cone
    ? ({
        name: char.light_cone.name,
        rarity: char.light_cone.rarity,
        rank: char.light_cone.rank,
        icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + char.light_cone.preview,
        level: char.light_cone.level,
        attributes: char.light_cone.attributes.map((a: any) => ({
          name: cleanAffixName(a.name),
          icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + a.icon,
          val: a.display,
        })),
      } as LightCone)
    : undefined;

  const relics: Relic[] =
    char.relics?.map((r: any, i: number) => ({
      name: r.name,
      rarity: r.rarity,
      level: r.level,
      icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + r.icon,
      score: Number(score[i].finalScore),
      part: r.type,
      main_affix: {
        type: r.main_affix.type,
        name: cleanAffixName(r.main_affix.name),
        icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + r.main_affix.icon,
        val: r.main_affix.value,
        dis: r.main_affix.display,
      },
      sub_affix: r.sub_affix.map((s: any) => ({
        type: s.type,
        name: cleanAffixName(s.name),
        icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + s.icon,
        val: s.value,
        dis: s.display,
      })),
    })) ?? [];

  const relic_sets: RelicSet[] =
    char.relic_sets?.map((rs: any) => ({
      name: rs.name,
      icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + rs.icon,
      num: rs.num,
    })) ?? [];

  const status: Status[] = char.additions.map((add: any) => {
    let val = add.display;
    const match = char.attributes.find((attr: any) => attr.name === add.name);
    if (match) {
      val = add.percent ? ((add.value + match.value) * 100).toFixed(1) + "%" : (add.value + match.value).toFixed(0);
    }
    return {
      name: cleanAffixName(add.name),
      icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + add.icon,
      val,
    };
  });

  const orderedNames = ["HP", "攻撃力", "防御力", "速度", "会心率", "会心ダメ", "撃破特効", "EP回復効率", "効果命中", "効果抵抗", "治癒量", "属性ダメ"];

  status.sort((a, b) => orderedNames.indexOf(a.name) - orderedNames.indexOf(b.name));

  return {
    uid: player.uid,
    id: char.id,
    name: char.name,
    level: char.level,
    icon: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + char.portrait,
    total_score: Number(total_score.toFixed(1)),
    skill,
    rank_icons,
    path: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + char.path.icon,
    element: "https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/" + char.element.icon,
    light_cone,
    relics,
    relic_sets,
    status,
  };
}

function cleanAffixName(name: string): string {
  return name
    .replace(/..?属性ダメージ/, "属性ダメ")
    .replace("会心ダメージ", "会心ダメ")
    .replace("EP回復効率", "EP回復")
    .replace("基礎", "");
}
