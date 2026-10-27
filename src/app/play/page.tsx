"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CollectionScreen } from "@/components/game/CollectionScreen";
import { GameView } from "@/components/game/GameView";
import { HowToPlay } from "@/components/game/HowToPlay";
import { SelectScreen } from "@/components/game/SelectScreen";
import { TitleScreen } from "@/components/game/TitleScreen";
import { audio } from "@/game/audio";
import { CHARACTERS } from "@/game/content";
import { commitRun, defaultSave, loadSave, persistSave } from "@/game/storage";
import type { RunStats, SaveData, ScreenId } from "@/game/types";

interface RunConfig {
  characterId: string;
  stageId: string;
  endless: boolean;
  key: number;
}

// Module-level cache so useSyncExternalStore snapshots stay referentially stable.
let cachedSave: SaveData | null = null;
const saveListeners = new Set<() => void>();

function subscribeSave(cb: () => void): () => void {
  saveListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    saveListeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function getSaveSnapshot(): SaveData {
  if (!cachedSave) cachedSave = loadSave();
  return cachedSave;
}

function getServerSnapshot(): SaveData {
  return defaultSave();
}

const HASH_SCREENS: ScreenId[] = ["title", "select", "howto", "collection"];

function screenFromHash(): ScreenId {
  if (typeof window === "undefined") return "title";
  const h = window.location.hash.replace("#", "") as ScreenId;
  return HASH_SCREENS.includes(h) ? h : "title";
}

export default function Home() {
  const save = useSyncExternalStore(subscribeSave, getSaveSnapshot, getServerSnapshot);
  const [screen, setScreen] = useState<ScreenId>(screenFromHash);
  const [run, setRun] = useState<RunConfig | null>(null);
  const saveRef = useRef(save);

  // Keep the visible screen in sync with the URL hash (deep links from the
  // landing page, browser back/forward).
  useEffect(() => {
    const onHashChange = () => setScreen(screenFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    saveRef.current = save;
  }, [save]);

  useEffect(() => {
    audio.setSfxVolume(save.settings.sfx);
    audio.setMusicVolume(save.settings.music);
  }, [save.settings.music, save.settings.sfx]);

  const updateSave = useCallback((next: SaveData) => {
    saveRef.current = next;
    cachedSave = next;
    persistSave(next);
    saveListeners.forEach((cb) => cb());
  }, []);

  const navigate = useCallback((s: ScreenId) => {
    audio.resume();
    audio.play("click");
    setScreen(s);
    if (typeof window !== "undefined" && s !== "game") {
      const target = s === "title" ? window.location.pathname : `#${s}`;
      window.history.replaceState(null, "", target);
    }
  }, []);

  const handleSfx = useCallback(
    (v: number) => {
      audio.resume();
      audio.setSfxVolume(v);
      updateSave({ ...saveRef.current, settings: { ...saveRef.current.settings, sfx: v } });
    },
    [updateSave],
  );

  const handleMusic = useCallback(
    (v: number) => {
      audio.resume();
      audio.setMusicVolume(v);
      updateSave({ ...saveRef.current, settings: { ...saveRef.current.settings, music: v } });
    },
    [updateSave],
  );

  const handlePurchase = useCallback(
    (characterId: string) => {
      const current = saveRef.current;
      const char = CHARACTERS.find((c) => c.id === characterId);
      if (!char || current.owned.includes(characterId) || current.coins < char.cost) return;
      audio.resume();
      audio.play("unlock");
      updateSave({
        ...current,
        coins: current.coins - char.cost,
        owned: [...current.owned, characterId],
      });
    },
    [updateSave],
  );

  const handleStart = useCallback((characterId: string, stageId: string) => {
    audio.resume();
    audio.play("click");
    setRun({ characterId, stageId, endless: false, key: Date.now() });
    setScreen("game");
  }, []);

  const handleRestart = useCallback((endless: boolean) => {
    audio.play("click");
    setRun((r) => (r ? { ...r, endless, key: Date.now() } : r));
  }, []);

  const handleQuit = useCallback(() => {
    audio.play("click");
    setRun(null);
    setScreen("title");
    if (typeof window !== "undefined") window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const handleCommit = useCallback((stats: RunStats) => {
    const result = commitRun(saveRef.current, stats);
    updateSave(result.save);
    return result;
  }, [updateSave]);

  const handleAchievement = useCallback(
    (id: string): boolean => {
      const current = saveRef.current;
      if (current.achievements.includes(id)) return false;
      updateSave({ ...current, achievements: [...current.achievements, id] });
      return true;
    },
    [updateSave],
  );

  const handleSeen = useCallback(
    (enemyId: string) => {
      const current = saveRef.current;
      if (current.seenEnemies.includes(enemyId)) return;
      updateSave({ ...current, seenEnemies: [...current.seenEnemies, enemyId] });
    },
    [updateSave],
  );

  if (screen === "game" && run) {
    return (
      <GameView
        key={run.key}
        characterId={run.characterId}
        stageId={run.stageId}
        endless={run.endless}
        save={save}
        onCommit={handleCommit}
        onAchievement={handleAchievement}
        onSeen={handleSeen}
        onSfx={handleSfx}
        onMusic={handleMusic}
        onQuit={handleQuit}
        onRestart={handleRestart}
      />
    );
  }

  if (screen === "select") {
    return (
      <SelectScreen
        save={save}
        onBack={() => navigate("title")}
        onStart={handleStart}
        onPurchase={handlePurchase}
      />
    );
  }

  if (screen === "howto") {
    return <HowToPlay onBack={() => navigate("title")} />;
  }

  if (screen === "collection") {
    return <CollectionScreen save={save} onBack={() => navigate("title")} />;
  }

  return <TitleScreen save={save} onNavigate={navigate} onSfx={handleSfx} onMusic={handleMusic} />;
}
