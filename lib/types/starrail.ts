export interface Skill {
  level: number;
  icon: string;
}

export interface RankIcon {
  icon: string;
  lock: boolean;
}

export interface LightConeAttribute {
  name: string;
  icon: string;
  val: string;
}

export interface LightCone {
  name: string;
  rarity: number;
  rank: number;
  level: number;
  icon: string;
  attributes: LightConeAttribute[];
}

export interface Affix {
  type: string;
  name: string;
  rarity: string;
  icon: string;
  val: number | string;
  dis: string;
}

export interface Relic {
  name: string;
  rarity: number;
  level: number;
  icon: string;
  score?: number | string;
  part: number;
  main_affix: Affix;
  sub_affix: Affix[];
}

export interface RelicSet {
  name: string;
  icon: string;
  num: number;
}

export interface Status {
  name: string;
  icon: string;
  val: string;
}

export interface charData {
  uid: string;
  id: string;
  name: string;
  level: number;
  icon: string;
  total_score: number;
  skill: Skill[];
  rank_icons: RankIcon[];
  path: string;
  element: string;
  light_cone?: LightCone;
  relics: Relic[];
  relic_sets: RelicSet[];
  status: Status[];
}
