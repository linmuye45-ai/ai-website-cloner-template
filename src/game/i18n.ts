// Engine-side localization. The headless smoke build compiles src/game with
// rootDir=src/game, so this module must stay self-contained (no imports
// outside src/game): it holds only the strings the engine emits itself
// (banners, toasts) plus the content names shown in those banners (bosses,
// evolved weapons). The React layer owns the full dictionaries under
// src/i18n and syncs the locale here via setGameLocale.
export type GameLocale = "en" | "zh" | "ja" | "es";
const GAME_LOCALES: readonly GameLocale[] = ["en", "zh", "ja", "es"];
const DEFAULT_LOCALE: GameLocale = "en";

let currentLocale: GameLocale = DEFAULT_LOCALE;

export function setGameLocale(locale: string): void {
  if ((GAME_LOCALES as readonly string[]).includes(locale)) {
    currentLocale = locale as GameLocale;
  }
}

export function getGameLocale(): GameLocale {
  return currentLocale;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m));
}

type EngineStrings = {
  bossApproaches: string;
  enrageTitle: string;
  enrageSub: string;
  evoBanner: string;
  fuseWarn: string;
  magnetSurge: string;
  stageCleared: string;
};

const ENGINE_STRINGS: Record<GameLocale, EngineStrings> = {
  en: {
    bossApproaches: "A boss approaches",
    enrageTitle: "{name} enrages",
    enrageSub: "Phase 2 — swarm and bullet hell",
    evoBanner: "Weapon evolved",
    fuseWarn: "Something is about to blow!",
    magnetSurge: "Lodestone surge — all gems drawn in!",
    stageCleared: "Stage Cleared",
  },
  zh: {
    bossApproaches: "Boss 逼近",
    enrageTitle: "{name} 进入狂暴",
    enrageSub: "第二阶段——召唤小怪与环形弹幕",
    evoBanner: "武器进化",
    fuseWarn: "有东西要爆炸了！",
    magnetSurge: "磁石爆发——所有宝石都被吸过来了！",
    stageCleared: "地图通关",
  },
  ja: {
    bossApproaches: "ボスが迫る",
    enrageTitle: "{name} が怒り状態",
    enrageSub: "フェーズ2 — 援軍と弾幕",
    evoBanner: "武器が進化",
    fuseWarn: "何かが爆発する！",
    magnetSurge: "磁石の奔流——ジェムがすべて引き寄せられる！",
    stageCleared: "ステージクリア",
  },
  es: {
    bossApproaches: "Se acerca un jefe",
    enrageTitle: "{name} entra en furia",
    enrageSub: "Fase 2 — invocaciones y lluvia de balas",
    evoBanner: "Arma evolucionada",
    fuseWarn: "¡Algo está a punto de explotar!",
    magnetSurge: "¡Oleada de imán — todas las gemas son atraídas!",
    stageCleared: "Escenario superado",
  },
};

const STAGE_NAMES: Record<GameLocale, Record<string, string>> = {
  en: { graveyard: "Hollow Graveyard", thicket: "Briarthorn Thicket", library: "The Ashen Library" },
  zh: { graveyard: "空洞墓地", thicket: "荆棘密林", library: "灰烬图书馆" },
  ja: { graveyard: "虚ろな墓地", thicket: "ブライアソーンの茂み", library: "灰の図書館" },
  es: { graveyard: "Cementerio Hueco", thicket: "Matorral de Espinas", library: "La Biblioteca de Ceniza" },
};

// Boss and evolved-weapon names are the only content names the engine prints.
const BOSS_NAMES: Record<GameLocale, Record<string, string>> = {
  en: { reaper: "The Pale Reaper", titan: "Grave Titan", voidreaper: "Void Reaper", grovehorror: "Grove Horror", blightmoth: "Blightmoth King", archivarian: "The Archivarian" },
  zh: { reaper: "苍白收割者", titan: "墓穴泰坦", voidreaper: "虚空收割者", grovehorror: "丛林恐魔", blightmoth: "疫蛾之王", archivarian: "档案官" },
  ja: { reaper: "蒼白の刈り手", titan: "墓場タイタン", voidreaper: "虚空の刈り手", grovehorror: "グローブホラー", blightmoth: "ブライトモス・キング", archivarian: "アーキヴァリアン" },
  es: { reaper: "El Segador Pálido", titan: "Titán de Tumba", voidreaper: "Segador del Vacío", grovehorror: "Horror de la Arboleda", blightmoth: "Rey Polilla Ruin", archivarian: "El Archivario" },
};

const EVO_WEAPON_NAMES: Record<GameLocale, Record<string, string>> = {
  en: {
    bolt_evo: "Tempest Scepter", whip_evo: "Solar Flail", axe_evo: "Meteor Maul", dagger_evo: "Galefang Barrage",
    aura_evo: "Wildheart Bloom", orbital_evo: "Aegis Codex", lightning_evo: "Thunderhead", nova_evo: "Seraph Nova",
  },
  zh: {
    bolt_evo: "风暴君王权杖", whip_evo: "烈日连枷", axe_evo: "陨星巨锤", dagger_evo: "风牙齐射",
    aura_evo: "荒野之心", orbital_evo: "神盾典籍", lightning_evo: "雷暴之主", nova_evo: "六翼新星",
  },
  ja: {
    bolt_evo: "テンペストの杖", whip_evo: "ソーラーフレイル", axe_evo: "メテオモール", dagger_evo: "ゲイルファング連射",
    aura_evo: "ワイルドハートの咲", orbital_evo: "イージス・コーデックス", lightning_evo: "サンダーヘッド", nova_evo: "セラフノヴァ",
  },
  es: {
    bolt_evo: "Cetro Tempestad", whip_evo: "Mangual Solar", axe_evo: "Martillo Meteoro", dagger_evo: "Descarga Colmillo de Viento",
    aura_evo: "Floración Salvaje", orbital_evo: "Códice Égida", lightning_evo: "Cabeza de Trueno", nova_evo: "Nova Serafín",
  },
};

export function tEngine(key: keyof EngineStrings, vars?: Record<string, string | number>): string {
  return interpolate(ENGINE_STRINGS[currentLocale][key], vars);
}

export function tBossName(id: string, fallback: string): string {
  return BOSS_NAMES[currentLocale][id] ?? fallback;
}

export function tEvoWeaponName(id: string, fallback: string): string {
  return EVO_WEAPON_NAMES[currentLocale][id] ?? fallback;
}

export function tStageName(id: string, fallback: string): string {
  return STAGE_NAMES[currentLocale][id] ?? fallback;
}
