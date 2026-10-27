// Canonical English dictionary. Its Dictionary type is the contract every
// other locale implements, so missing keys are compile errors.
export interface Dictionary {
  meta: { title: string; description: string; ogTitle: string; ogDescription: string };
  nav: { manual: string; bestiary: string; privacy: string; terms: string; playFree: string };
  hero: {
    eyebrow: string;
    brandTop: string;
    brandBottom: string;
    tagline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    statWeapons: string;
    statEnemies: string;
    statStages: string;
  };
  features: { titlePrefix: string; titleHighlight: string; titleSuffix: string; lead: string; items: { title: string; body: string }[] };
  characters: { titlePrefix: string; titleHighlight: string };
  how: { titlePrefix: string; titleHighlight: string; titleSuffix: string; steps: { t: string; d: string }[]; cta: string };
  faq: { title: string; items: { q: string; a: string }[] };
  footer: { tagline: string };
  legal: {
    privacy: { title: string; updated: string; sections: { h: string; p?: string[]; list?: string[] }[] };
    terms: { title: string; updated: string; sections: { h: string; p?: string[]; list?: string[] }[] };
    back: string;
  };
  game: {
    title: {
      tagline: string;
      desc: string;
      start: string;
      howto: string;
      collection: string;
      vault: string;
      moveHint: string;
      pauseHint: string;
      autoFire: string;
      footer: string;
    };
    select: {
      back: string;
      heading: string;
      chooseSurvivor: string;
      chooseStage: string;
      statHealth: string;
      statSpeed: string;
      statMight: string;
      statArmor: string;
      statCooldown: string;
      statMagnet: string;
      startsWith: string;
      survival: string;
      best: string;
      beginRun: string;
      recruit: string;
      needMore: string;
    };
    hud: {
      levelUp: string;
      chooseUpgrade: string;
      newTag: string;
      evoTag: string;
      rank: string;
      reroll: string;
      pickHint: string;
      skip: string;
      treasure: string;
      coins: string;
      health: string;
      rankTo: string;
      collect: string;
      paused: string;
      resume: string;
      restart: string;
      quit: string;
      enraged: string;
      stageCleared: string;
      consumed: string;
      victory: string;
      defeat: string;
      time: string;
      kills: string;
      level: string;
      damageTaken: string;
      gems: string;
      newAch: string;
      endless: string;
      retry: string;
      backToTitle: string;
    };
    collection: {
      title: string;
      runs: string;
      totalKills: string;
      coinsEarned: string;
      bestiary: string;
      bestiaryTitle: string;
      stageRecords: string;
      achievements: string;
      cleared: string;
      untried: string;
      unknown: string;
      bossTag: string;
      eliteTag: string;
    };
    howto: {
      title: string;
      loopTitle: string;
      loop: { t: string; d: string }[];
      compendiumTitle: string;
      rankLine: string;
      forgeTitle: string;
      forgeLead: string;
      threatsTitle: string;
      relicsTitle: string;
      pickupsTitle: string;
      tip: string;
      threats: { name: string; d: string }[];
      pickups: { name: string; d: string }[];
    };
  };
  engine: {
    bossApproaches: string;
    enrageTitle: string;
    enrageSub: string;
    evoBanner: string;
    fuseWarn: string;
    magnetSurge: string;
  };
  content: {
    weapon: Record<string, { name: string; desc: string }>;
    passive: Record<string, { name: string; desc: string }>;
    character: Record<string, { name: string; title: string; desc: string; unlock: string }>;
    enemy: Record<string, string>;
    stage: Record<string, { name: string; subtitle: string; desc: string }>;
    achievement: Record<string, { name: string; desc: string }>;
  };
}

export const en: Dictionary = {
  meta: {
    title: "Duskfall Survivors — Free 16-bit Pixel Horde Survival Game",
    description:
      "Play Duskfall Survivors free in your browser: 15 minutes of escalating monster waves, eight evolvable weapons, dynamic night lighting, screen-filling bosses and roguelite builds. No download, no sign-up.",
    ogTitle: "Duskfall Survivors — 16-bit Pixel Horde Survival",
    ogDescription:
      "Survive the dusk. Eight evolvable weapons, four enemy archetypes, three cursed stages — free in your browser.",
  },
  nav: { manual: "Manual", bestiary: "Bestiary", privacy: "Privacy", terms: "Terms", playFree: "Play Free" },
  hero: {
    eyebrow: "A 16-bit horde survival",
    brandTop: "DUSKFALL",
    brandBottom: "SURVIVORS",
    tagline:
      "Fifteen minutes. An endless rising dead. Master eight auto-firing weapons, draft a broken build, and light the night yourself in this free browser survival roguelite.",
    ctaPrimary: "▶ Play Free — No Download",
    ctaSecondary: "How it works",
    statWeapons: "weapons",
    statEnemies: "enemy types",
    statStages: "cursed stages",
  },
  features: {
    titlePrefix: "Built like a ",
    titleHighlight: "full game",
    titleSuffix: "",
    lead: "Every system a horde-survival player expects, plus lighting and AI most browser clones skip.",
    items: [
      {
        title: "Eight evolvable weapons",
        body: "Homing bolts, arcing whips, meteoric axes, lightning sigils and more — each with eight ranks and a powerful final evolution.",
      },
      {
        title: "Four enemy archetypes",
        body: "Ranged cultists that kite you, telegraphing chargers, fuse-lit exploders and slimes that split into smaller kin.",
      },
      {
        title: "Dynamic night lighting",
        body: "Darkness deepens minute by minute. Your flickering light pool, projectiles and explosions carve visibility out of the night.",
      },
      {
        title: "Three bosses every run",
        body: "At 05:00, 10:00 and 14:00 a boss hunts you down — and enrages at half health with summon swarms and radial bullet bursts.",
      },
      {
        title: "Roguelite draft economy",
        body: "Three-card level-ups, two rerolls, skip-for-XP and six weapon plus six relic slots. No two builds play the same.",
      },
      {
        title: "Persistent vault",
        body: "Coins bank between runs to unlock new survivors. Records, bestiary and achievements persist entirely on your device.",
      },
    ],
  },
  characters: { titlePrefix: "Choose your ", titleHighlight: "survivor" },
  how: {
    titlePrefix: "From first click to ",
    titleHighlight: "stage clear",
    titleSuffix: "",
    steps: [
      { t: "Move", d: "WASD or arrow keys on desktop, drag-to-steer joystick on touch screens." },
      { t: "Auto-fire", d: "Weapons target and fire on their own. Positioning is the entire skill." },
      { t: "Collect", d: "Vacuum XP gems, coins, healing chickens and lodestones off the killing field." },
      { t: "Draft", d: "Every level pauses the fight for a three-card upgrade. Reroll twice or skip for XP." },
      { t: "Survive 15:00", d: "Beat three bosses, then push into endless mode where difficulty never stops scaling." },
    ],
    cta: "Start your first run",
  },
  faq: {
    title: "Questions",
    items: [
      {
        q: "Is Duskfall Survivors really free?",
        a: "Yes. There are no purchases, no ads, no accounts and no sign-up. Open the page and play.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. The game runs in any modern browser using the Canvas 2D API. It also works on touch devices with a virtual joystick.",
      },
      {
        q: "Does it collect my data?",
        a: "No personal data is collected and nothing is uploaded. Save data lives only in your browser's localStorage. See the Privacy page for details.",
      },
      {
        q: "How long is a run?",
        a: "A stage takes fifteen minutes to clear, with bosses at five, ten and fourteen minutes. Cleared runs can continue in endless mode.",
      },
      {
        q: "Are the art and sounds original?",
        a: "Every sprite is authored as original pixel art rendered in code, and all music plus sound effects are synthesized with the Web Audio API. No third-party game assets are used.",
      },
    ],
  },
  footer: { tagline: "Original code, pixel art and synthesized audio. No third-party game assets." },
  legal: {
    back: "← Back to site",
    privacy: {
      title: "Privacy Policy",
      updated: "Last updated: 27 October 2026 · Effective immediately",
      sections: [
        {
          h: "The short version",
          p: [
            "Duskfall Survivors does not collect personal data, has no accounts, runs no analytics or advertising scripts, and uploads nothing from your device. The game is fully playable with JavaScript in your browser and stores its save data locally.",
          ],
        },
        {
          h: "What is stored on your device",
          p: ["The game uses your browser's localStorage (key: duskfall-survivors-save-v1) to persist the following:"],
          list: [
            "Vault coin balance and total coins earned",
            "Unlocked characters, achievements and bestiary entries",
            "Per-stage best records (time survived, kills, level, victory flag)",
            "Run counters and your sound/music volume and language preferences",
          ],
        },
        {
          h: "What is NOT collected",
          list: [
            "No name, email, phone number, location or payment information",
            "No cookies, fingerprinting, analytics or advertising identifiers",
            "No gameplay telemetry or network requests carrying your data",
            "No third-party trackers, embeds or external fonts",
          ],
        },
        {
          h: "Network and hosting",
          p: [
            "The site is served as static web assets by the hosting provider you obtained it from. Game logic, rendering and audio synthesis all execute locally in your browser; gameplay never communicates with a backend.",
          ],
        },
        {
          h: "Audio and permissions",
          p: [
            "Sound effects and music are synthesized locally with the Web Audio API after you interact with the page. No microphone or other device permission is requested.",
          ],
        },
        {
          h: "How to delete your data",
          p: [
            "All saved data can be removed at any time via your browser's site settings, or by running localStorage.removeItem('duskfall-survivors-save-v1') in the browser console. Clearing browsing data or removing the PWA also deletes it.",
          ],
        },
        {
          h: "Children",
          p: [
            "The game contains cartoon/fantasy combat with no realistic violence, no gore and no social features, and collects no data, so it is suitable for a broad audience.",
          ],
        },
        {
          h: "Changes and contact",
          p: [
            "This policy may be updated as the game evolves; material changes will be reflected by the updated date above. Questions can be filed as an issue on the project's public repository.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      updated: "Last updated: 27 October 2026 · Effective immediately",
      sections: [
        { h: "1. Acceptance", p: ["By accessing or playing Duskfall Survivors (the “Game”) you agree to these terms. If you do not agree, do not use the Game."] },
        {
          h: "2. Original intellectual property",
          p: [
            "All Game content — source code, pixel-art sprites, level data, synthesized music and sound effects, names, characters and text — is original work created for this project and made available under the repository's open-source license. No art, audio, names or other assets from third-party commercial games are included.",
            "Trademarks of other games referenced in comparisons or documentation belong to their respective owners; reference does not imply affiliation or endorsement.",
          ],
        },
        { h: "3. Acceptable use", p: ["You agree not to:"], list: [
          "Attempt to disrupt, overload or attack the hosting infrastructure",
          "Redistribute the Game while misrepresenting its ownership or stripping license notices",
          "Use the Game to harass, threaten or target other people",
          "Automate access in ways that violate the terms of any hosting platform",
        ] },
        {
          h: "4. User data",
          p: ["The Game stores progress locally on your device and maintains no user accounts. You control that data; see the Privacy Policy for details."],
        },
        {
          h: "5. Disclaimers",
          p: [
            "The Game is provided “as is” without warranties of any kind, express or implied, including fitness for a particular purpose or uninterrupted availability. High scores and saved progress can be lost if browser storage is cleared or corrupted.",
            "To the maximum extent permitted by law, the maintainers are not liable for indirect, incidental or consequential damages arising from use of the Game.",
          ],
        },
        {
          h: "6. DMCA / copyright notices",
          p: [
            "If you believe content in the repository infringes your copyright, submit a notice containing: (a) identification of the copyrighted work; (b) the exact file/URL allegedly infringing; (c) your contact details; (d) a good-faith belief statement; (e) a statement under penalty of perjury that the information is accurate and you are authorized to act; and (f) a physical or electronic signature. File it through the repository's issue tracker. Valid notices will be reviewed promptly, with a counter-notice process available.",
          ],
        },
        {
          h: "7. Changes",
          p: ["These terms may be revised; continued use after changes constitutes acceptance. The updated date identifies the current version."],
        },
      ],
    },
  },
  game: {
    title: {
      tagline: "A 16-bit horde survival",
      desc: "The dead rise at dusk and they do not stop coming. Survive fifteen minutes of escalating waves, master eight auto-firing weapons, and fell the bosses that hunt you through the dark.",
      start: "⚔ Start Run",
      howto: "How to Play",
      collection: "Bestiary & Records",
      vault: "vault",
      moveHint: "move",
      pauseHint: "pause",
      autoFire: "weapons fire automatically",
      footer: "Original pixel art, code and audio synthesis — no third-party game assets · v1.0",
    },
    select: {
      back: "← Back",
      heading: "Prepare for Dusk",
      chooseSurvivor: "Choose Survivor",
      chooseStage: "Choose Stage",
      statHealth: "Health",
      statSpeed: "Speed",
      statMight: "Might",
      statArmor: "Armor",
      statCooldown: "Cooldown",
      statMagnet: "Magnet",
      startsWith: "Starts with",
      survival: "15:00 survival",
      best: "Best",
      beginRun: "▶ Begin Run",
      recruit: "Recruit",
      needMore: "Need",
    },
    hud: {
      levelUp: "Level Up",
      chooseUpgrade: "Choose an upgrade",
      newTag: "NEW",
      evoTag: "EVOLUTION",
      rank: "Rank",
      reroll: "↻ Reroll",
      pickHint: "1–3 pick · R reroll",
      skip: "Skip → +25% XP",
      treasure: "Treasure!",
      coins: "coins",
      health: "health",
      rankTo: "rank",
      collect: "Collect",
      paused: "Paused",
      resume: "Resume",
      restart: "Restart Run",
      quit: "Quit to Menu",
      enraged: "ENRAGED",
      stageCleared: "Stage cleared",
      consumed: "You were consumed by the dusk",
      victory: "VICTORY",
      defeat: "DEFEAT",
      time: "Time",
      kills: "Kills",
      level: "Level",
      damageTaken: "Damage taken",
      gems: "Gems",
      newAch: "New achievements",
      endless: "∞ Continue in Endless Mode",
      retry: "Retry Run",
      backToTitle: "Back to Title",
    },
    collection: {
      title: "Bestiary & Records",
      runs: "Runs",
      totalKills: "Total kills",
      coinsEarned: "Coins earned",
      bestiary: "Bestiary",
      bestiaryTitle: "Bestiary",
      stageRecords: "Stage Records",
      achievements: "Achievements",
      cleared: "CLEARED",
      untried: "untried",
      unknown: "???",
      bossTag: "BOSS",
      eliteTag: "ELITE",
    },
    howto: {
      title: "Field Manual",
      loopTitle: "The Survival Loop",
      loop: [
        { t: "Move", d: "WASD or arrow keys. On touch screens, drag anywhere to steer." },
        { t: "Auto-fire", d: "Your weapons target and fire on their own — positioning is everything." },
        { t: "Collect", d: "Enemies drop XP gems. Walk near them and your lodestone drags them in." },
        { t: "Level up", d: "Each level pauses the fight and offers three upgrades. Stack weapons to level 8." },
        { t: "Evolve", d: "A maxed weapon plus its maxed paired relic unlocks a single ultimate evolution." },
        { t: "Survive", d: "Bosses arrive at 05:00, 10:00 and 14:00 — at half health they enrage. Last until 15:00." },
      ],
      compendiumTitle: "Weapon Compendium",
      rankLine: "8 ranks · max",
      forgeTitle: "Evolution Forge",
      forgeLead:
        "Max the weapon and its paired relic to rank 5, and the evolution appears in your next level-up draft. It replaces the base weapon in the same slot.",
      threatsTitle: "Threat Atlas",
      relicsTitle: "Passive Relics",
      pickupsTitle: "Field Pickups",
      tip: "Tip: you can hold six weapons and six relics. When everything is maxed, level-ups become Healing Salves. Save relic slots for the pairs behind your evolutions!",
      threats: [
        { name: "Hooded Cultist", d: "Keeps its distance, strafes and lobs arcane bolts. Close the gap fast." },
        { name: "Grave Beetle", d: "Winds up with a red mark, then dashes in a straight line. Sidestep the tell." },
        { name: "Bloated One", d: "Ignites a fuse when you get close and detonates in an area. Run perpendicular." },
        { name: "Grave Slime", d: "Splits into two smaller slimes on death — clear the minis before they surround you." },
      ],
      pickups: [
        { name: "XP Gem", d: "Blue, green and red gems grant 1, 5 and 10 experience." },
        { name: "Coin", d: "Banked after every run. Recruit new survivors in the vault." },
        { name: "Roast Chicken", d: "Rare field ration that restores 30 health." },
        { name: "Lodestone", d: "Six seconds of vacuum — every gem on screen flies to you." },
        { name: "Boss Chest", d: "Bosses drop treasure: coins, healing and a free weapon level." },
      ],
    },
  },
  engine: {
    bossApproaches: "A boss approaches",
    enrageTitle: "{name} enrages",
    enrageSub: "Phase 2 — swarm and bullet hell",
    evoBanner: "Weapon evolved",
    fuseWarn: "Something is about to blow!",
    magnetSurge: "Lodestone surge — all gems drawn in!",
  },
  content: {
    weapon: {
      bolt: { name: "Arcbolt Scepter", desc: "Hurls homing bolts that seek the nearest foe." },
      whip: { name: "Dawn Whip", desc: "Sweeps a blazing arc, striking foes beside you." },
      axe: { name: "Hunter Axe", desc: "Lobs heavy axes that crash down upon the horde." },
      dagger: { name: "Storm Daggers", desc: "Fires rapid daggers along your facing direction." },
      aura: { name: "Bramble Aura", desc: "Thorny vines pulse around you, damaging anything near." },
      orbital: { name: "Tome Wards", desc: "Grimoires orbit you, crushing whatever they touch." },
      lightning: { name: "Skycall Sigil", desc: "Calls lightning onto random enemies in view." },
      nova: { name: "Hallowed Nova", desc: "Erupts a ring of sacred flame in every direction." },
      bolt_evo: { name: "Tempest Scepter", desc: "Evolution: a storm of five piercing bolts that never lose their quarry." },
      whip_evo: { name: "Solar Flail", desc: "Evolution: four sweeping arcs of sunlight blaze across the battlefield." },
      axe_evo: { name: "Meteor Maul", desc: "Evolution: five meteors crash down with crushing impact zones." },
      dagger_evo: { name: "Galefang Barrage", desc: "Evolution: seven fangs of wind in a rapid, piercing volley." },
      aura_evo: { name: "Wildheart Bloom", desc: "Evolution: a vast living thicket pulses faster and hits harder." },
      orbital_evo: { name: "Aegis Codex", desc: "Evolution: five warded tomes grind a wide orbit around you." },
      lightning_evo: { name: "Thunderhead", desc: "Evolution: seven chained strikes rain down in rapid succession." },
      nova_evo: { name: "Seraph Nova", desc: "Evolution: a towering sacred fireball engulfs everything nearby." },
    },
    passive: {
      might: { name: "Vigor Crest", desc: "+10% damage per rank." },
      cooldown: { name: "Hourglass", desc: "-8% weapon cooldown per rank." },
      area: { name: "Expander Rune", desc: "+10% attack area per rank." },
      speed: { name: "Windboots", desc: "+10 movement speed per rank." },
      maxHp: { name: "Heartseed", desc: "+20 max health, heals 20 per rank." },
      magnet: { name: "Lodestone", desc: "+30 pickup range per rank." },
      regen: { name: "Moss Charm", desc: "Regenerate +0.5 health every second." },
      armor: { name: "Ironbulwark", desc: "+1 armor per rank (flat damage reduction)." },
      growth: { name: "Wisdom Vial", desc: "+10% experience gain per rank." },
      luck: { name: "Clover Sigil", desc: "+10% luck — rarer upgrades and richer drops." },
    },
    character: {
      aldric: {
        name: "Aldric",
        title: "Dawnblade",
        desc: "A sworn knight with iron nerves. Starts with the Dawn Whip.",
        unlock: "Available from the start.",
      },
      vesna: {
        name: "Vesna",
        title: "Stormcaller",
        desc: "A glass-cannon mage who chains lightning from afar. Starts with the Arcbolt Scepter.",
        unlock: "Available from the start.",
      },
      crow: {
        name: "Crow",
        title: "Nightrunner",
        desc: "Fast and fragile, built around daggers and kiting. Starts with Storm Daggers.",
        unlock: "Recruit in the vault for coins earned in runs.",
      },
      bramble: {
        name: "Bramble",
        title: "Thornwarden",
        desc: "A durable warden who lets the horde break itself on the Bramble Aura.",
        unlock: "Recruit in the vault for coins earned in runs.",
      },
    },
    enemy: {
      shambler: "Grave Shambler",
      bat: "Dusk Bat",
      skeleton: "Bonewalker",
      wisp: "Will-o'-Wisp",
      slime: "Grave Slime",
      husk: "Hollow Husk",
      ghoul: "Ghoul Ravager",
      cultist: "Hooded Cultist",
      beetle: "Grave Beetle",
      bloater: "Bloated One",
      reaper: "The Pale Reaper",
      titan: "Grave Titan",
      voidreaper: "Void Reaper",
      crawler: "Bog Crawler",
      moth: "Dustmoth",
      barkbones: "Barkbones",
      sporeling: "Sporeling",
      stalker: "Thicket Stalker",
      grovehorror: "Grove Horror",
      blightmoth: "Blightmoth King",
      tomebound: "Tome-bound",
      inkwisp: "Ink Wisp",
      gargoyle: "Gargoyle",
      ashwraith: "Ash Wraith",
      archivarian: "The Archivarian",
    },
    stage: {
      graveyard: {
        name: "Hollow Graveyard",
        subtitle: "Fog-soaked tombs",
        desc: "The opening hunt. Balanced dead under drifting fog — learn the rhythm of the dusk here.",
      },
      thicket: {
        name: "Briarthorn Thicket",
        subtitle: "Spores and brambles",
        desc: "Faster swarms and splitting slimes beneath drifting spores. Healing is scarce; positioning is everything.",
      },
      library: {
        name: "The Ashen Library",
        subtitle: "Embers of lost lore",
        desc: "Cultists, gargoyles and towering bosses in the dark. The longest, cruelest night of the three.",
      },
    },
    achievement: {
      first_blood: { name: "First Blood", desc: "Defeat your first enemy." },
      kill_100: { name: "Exterminator", desc: "Defeat 100 enemies in one run." },
      kill_500: { name: "Horde Breaker", desc: "Defeat 500 enemies in one run." },
      survive_5: { name: "Five Minutes More", desc: "Survive until 05:00." },
      survive_10: { name: "Holding the Line", desc: "Defeat the 10:00 boss." },
      win_one: { name: "Dusk Conquered", desc: "Clear any stage." },
      level_20: { name: "Ascendant", desc: "Reach level 20 in a run." },
      max_weapon: { name: "Master of Arms", desc: "Max out any weapon." },
      evolve_weapon: { name: "Apotheosis", desc: "Evolve a weapon into its ultimate form." },
      rich_1000: { name: "Tomb Robber", desc: "Hold 1,000 coins in the vault." },
      bestiary_half: { name: "Field Researcher", desc: "Encounter half of the bestiary." },
    },
  },
};
