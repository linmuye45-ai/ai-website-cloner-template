"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Clock3, Heart, LockKeyhole, Moon, RotateCcw, Share2, Sparkles, X } from "lucide-react";
import { chapters, emptyTraits, nextTraits, resolveEnding, type Chapter, type Ending, type Trait, type Traits } from "@/lib/story";
import { KuruIllustration } from "@/components/kuru";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { getEndingTrait, getStoryCopy } from "@/lib/story-copy";

type View = "home" | "play" | "ending" | "shelf" | "about";
type SaveData = { completed: string[]; endings: Record<string, Ending>; traits: Traits; lastChapter?: string; lastEnding?: Ending };
const STORAGE_KEY = "dream-station-save-v1";
const AGE_KEY = "dream-station-age-confirmed";
const defaultSave: SaveData = { completed: [], endings: {}, traits: emptyTraits };

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("dream-station-update", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("dream-station-update", callback);
  };
}
function getStorageSnapshot() {
  try {
    return JSON.stringify({ raw: window.localStorage.getItem(STORAGE_KEY), age: window.localStorage.getItem(AGE_KEY) === "yes" });
  } catch {
    return JSON.stringify({ raw: null, age: false });
  }
}
function getServerStorageSnapshot() { return JSON.stringify({ raw: null, age: false }); }
function parseStorageSnapshot(snapshot: string) {
  try {
    const data = JSON.parse(snapshot) as { raw: string | null; age: boolean };
    const parsed = data.raw ? JSON.parse(data.raw) as Partial<SaveData> : {};
    return {
      age: data.age,
      hasSave: Boolean(data.raw),
      save: {
        completed: Array.isArray(parsed.completed) ? parsed.completed : [],
        endings: parsed.endings ?? {},
        traits: parsed.traits ?? emptyTraits,
        lastChapter: parsed.lastChapter,
        lastEnding: parsed.lastEnding
      } as SaveData
    };
  } catch {
    return { age: false, hasSave: false, save: defaultSave };
  }
}
const subscribeNoop = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

function scrollTop() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

export default function NightShiftExperience() {
  const t = useTranslations("experience");
  const locale = useLocale();
  const [view, setView] = useState<View>("home");
  const [sessionSave, setSessionSave] = useState<SaveData>(defaultSave);
  const [ageSessionConfirmed, setAgeSessionConfirmed] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [traits, setTraits] = useState<Traits>(emptyTraits);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [choiceEcho, setChoiceEcho] = useState<string | null>(null);
  const [finalEcho, setFinalEcho] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const storageSnapshot = useSyncExternalStore(subscribeToStorage, getStorageSnapshot, getServerStorageSnapshot);
  const stored = useMemo(() => parseStorageSnapshot(storageSnapshot), [storageSnapshot]);
  const save = stored.hasSave ? stored.save : sessionSave;
  const ageConfirmed = stored.age || ageSessionConfirmed;
  const ready = useSyncExternalStore(subscribeNoop, getClientReady, getServerReady);
  const invite = useMemo(() => {
    if (!ready) return null;
    const params = new URLSearchParams(window.location.search);
    const inviteChapter = params.get("invite");
    if (!inviteChapter || !chapters.some((item) => item.id === inviteChapter)) return null;
    return { chapterId: inviteChapter, endingId: params.get("ending") ?? undefined };
  }, [ready]);

  const invitedEnding = useMemo(() => invite?.endingId ? chapters.flatMap((item) => Object.values(item.endings)).find((item) => item.id === invite.endingId) ?? null : null, [invite]);
  const invitedEndingCopy = invite?.endingId ? getStoryCopy(locale, invite.chapterId).endings[getEndingTrait(invite.chapterId, invite.endingId)] : null;
  const chapter = useMemo(() => chapters.find((item) => item.id === activeChapterId) ?? chapters[0], [activeChapterId]);
  const scene = chapter.scenes[sceneIndex];
  const chapterCopy = getStoryCopy(locale, chapter.id);
  const sceneCopy = chapterCopy.scenes[sceneIndex];
  const endingCopy = ending ? chapterCopy.endings[getEndingTrait(chapter.id, ending.id)] : null;
  const completedCount = save.completed.length;
  const allComplete = completedCount >= chapters.length;
  const suggestedChapter = allComplete ? chapters[0] : chapters[completedCount];

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  function persist(next: SaveData) {
    setSessionSave(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("dream-station-update"));
    } catch {
      setToast(t("toastSaveFailure"));
    }
  }

  function confirmAge() {
    setAgeSessionConfirmed(true);
    try {
      window.localStorage.setItem(AGE_KEY, "yes");
      window.dispatchEvent(new Event("dream-station-update"));
    } catch { /* continue for this session */ }
  }

  function startChapter(item: Chapter, replay = false) {
    const index = chapters.findIndex((entry) => entry.id === item.id);
    const unlocked = index === 0 || save.completed.includes(chapters[index - 1].id);
    if (!unlocked && !replay) {
      setToast(t("toastFinishPrevious"));
      return;
    }
    setActiveChapterId(item.id);
    setSceneIndex(0);
    setTraits(emptyTraits);
    setEnding(null);
    setChoiceEcho(null);
    setFinalEcho(null);
    setInviteDismissed(true);
    setView("play");
    scrollTop();
  }

  function choose(trait: Trait, weight: number, response: string) {
    const updated = nextTraits(traits, trait, weight);
    setChoiceEcho(response);
    setTraits(updated);
    if (sceneIndex < chapter.scenes.length - 1) {
      setSceneIndex((value) => value + 1);
      return;
    }
    const result = resolveEnding(chapter.id, updated);
    setFinalEcho(response);
    setEnding(result);
    const completed = Array.from(new Set([...save.completed, chapter.id]));
    persist({
      completed,
      endings: { ...save.endings, [chapter.id]: result },
      traits: {
        tenderness: save.traits.tenderness + updated.tenderness,
        curiosity: save.traits.curiosity + updated.curiosity,
        patience: save.traits.patience + updated.patience
      },
      lastChapter: chapter.id,
      lastEnding: result
    });
    setView("ending");
    scrollTop();
  }

  async function shareEnding() {
    if (!ending) return;
    const localized = getStoryCopy(locale, activeChapterId).endings[getEndingTrait(activeChapterId, ending.id)];
    const shareUrl = new URL(window.location.href);
    shareUrl.search = "";
    shareUrl.searchParams.set("invite", activeChapterId);
    shareUrl.searchParams.set("ending", ending.id);
    const url = shareUrl.toString();
    const shareData = { title: t("shareTitle"), text: localized.shareLine, url };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(url); setToast(t("toastCopied")); }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try { await navigator.clipboard.writeText(url); setToast(t("toastCopied")); }
        catch { setToast(t("toastShareUnavailable")); }
      }
    }
  }

  function resetProgress() {
    persist(defaultSave);
    setShowReset(false);
    setEnding(null);
    setView("home");
    setToast(t("toastReset"));
    scrollTop();
  }

  if (!ageConfirmed) {
    return (
      <main id="main-content" className="age-gate">
        <div className="age-card">
          <div className="brand-mark"><Moon size={22} /></div>
          <p className="eyebrow">{t("ageEyebrow")}</p>
          <h1>{t("ageTitle")}</h1>
          <p className="age-copy">{t("ageCopy")}</p>
          <button className="button button-primary button-wide" onClick={confirmAge}>{t("ageConfirm")} <ArrowRight size={17} /></button>
          <p className="micro-note">{t("ageNote")}</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => { setView("home"); scrollTop(); }} aria-label={t("homeAria")}>
          <span className="brand-mark"><Moon size={18} /></span>
          <span className="brand-wordmark"><strong>THE DREAM STATION</strong><small>THE NIGHT SHIFT</small></span>
        </button>
        <nav className="desktop-nav" aria-label={t("navMain")}>
          <button className={view === "home" || view === "play" || view === "ending" ? "nav-link active" : "nav-link"} onClick={() => { setView("home"); scrollTop(); }}>{t("navShift")}</button>
          <button className={view === "shelf" ? "nav-link active" : "nav-link"} onClick={() => { setView("shelf"); scrollTop(); }}>{t("navShelf")} <span className="nav-count">{completedCount}</span></button>
          <button className={view === "about" ? "nav-link active" : "nav-link"} onClick={() => { setView("about"); scrollTop(); }}>{t("navAbout")}</button>
        </nav>
        <LanguageSwitcher />
      </header>

      {invite && !inviteDismissed && view === "home" && (
        <div className="invite-banner">
          <span className="invite-icon"><Heart size={16} /></span>
          <div><strong>{t("inviteTitle")}</strong><span>{invitedEndingCopy ? t("inviteWithEnding", { ending: invitedEndingCopy.title }) : t("inviteGeneric")}</span></div>
          <button onClick={() => { const item = chapters.find((entry) => entry.id === invite.chapterId); if (item) startChapter(item, true); }}>{t("inviteEnter")} <ArrowRight size={15} /></button>
          <button className="icon-button invite-close" aria-label={t("inviteDismiss")} onClick={() => setInviteDismissed(true)}><X size={16} /></button>
        </div>
      )}

      {view === "home" && (
        <>
          <section className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-dot" /> {t("heroEyebrow")}</p>
              <h1>{t("heroTitle1")}<br /><em>{t("heroTitle2")}</em></h1>
              <p className="hero-description">{t("heroDescription")}</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => startChapter(suggestedChapter, allComplete)}>{completedCount === 0 ? t("heroStart") : allComplete ? t("heroReplay") : t("heroContinue")} <ArrowRight size={17} /></button>
                <button className="button button-quiet" onClick={() => setView("shelf")}><Bookmark size={16} /> {t("heroShelf")}</button>
              </div>
              <div className="hero-proof">
                <span><Clock3 size={14} /> {t("proofDuration")}</span>
                <span><LockKeyhole size={14} /> {t("proofAccount")}</span>
                <span><Sparkles size={14} /> {t("proofChoices")}</span>
              </div>
            </div>
            <div className="hero-art-wrap">
              <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
              <div className="hero-art-card">
                <div className="art-card-top"><span>{t("shiftNo")}</span><span>23:47</span></div>
                <KuruIllustration size={390} className="hero-kuru" mood="sleepy" />
                <div className="art-caption"><span className="caption-star">✦</span><span><strong>KURU</strong><small>{t("kuruRole")}</small></span><span className="caption-status">{t("onDuty")}</span></div>
              </div>
              <div className="floating-note note-top"><span className="note-moon">☾</span><span>{t("noteOne")}</span></div>
              <div className="floating-note note-bottom"><span className="note-dot" /><span>{t("noteTwo")}</span></div>
            </div>
          </section>

          <section className="chapter-section" id="chapters">
            <div className="section-heading">
              <div><p className="eyebrow">{t("chapterEyebrow")}</p><h2>{t("chapterTitle")}</h2></div>
              <p>{t("chapterDescription")}</p>
            </div>
            <div className="chapter-grid">
              {chapters.map((item, index) => {
                const unlocked = index === 0 || save.completed.includes(chapters[index - 1].id);
                const done = save.completed.includes(item.id);
                const savedEnding = save.endings[item.id];
                const itemCopy = getStoryCopy(locale, item.id);
                const savedEndingCopy = savedEnding ? itemCopy.endings[getEndingTrait(item.id, savedEnding.id)] : null;
                return (
                  <article className={"chapter-card chapter-card-" + (index + 1) + (unlocked ? "" : " locked")} key={item.id}>
                    <div className="chapter-card-art">
                      <span className="chapter-number">{item.number}</span>
                      {index === 0 ? <div className="cloud-illustration"><span /><span /><span /></div> : index === 1 ? <div className="star-illustration">✦</div> : <div className="shelf-illustration"><i /><i /><i /></div>}
                      {done && <span className="done-stamp"><Check size={12} /> {t("completed")}</span>}
                      {!unlocked && <span className="locked-stamp"><LockKeyhole size={12} /> {t("locked")}</span>}
                    </div>
                    <div className="chapter-card-content">
                      <div className="chapter-meta"><span>{t("chapterLabel", { number: item.number })}</span><span><Clock3 size={12} /> {itemCopy.duration}</span></div>
                      <h3>{itemCopy.title}</h3><p>{itemCopy.subtitle}</p>
                      {done && savedEnding && <div className="saved-ending"><Sparkles size={13} /> {savedEndingCopy?.treat}</div>}
                      <button className="chapter-link" disabled={!unlocked} onClick={() => startChapter(item, done)}>{done ? t("playAnother") : unlocked ? t("openChapter") : t("finishPrevious")} <ArrowRight size={15} /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="how-section">
            <div className="how-intro"><p className="eyebrow">{t("howEyebrow")}</p><h2>{t("howTitle1")}<br /><em>{t("howTitle2")}</em></h2><p>{t("howDescription")}</p></div>
            <div className="how-steps">
              <div className="how-step"><span className="step-index">01</span><div className="step-icon"><Moon size={19} /></div><h3>{t("step1Title")}</h3><p>{t("step1Desc")}</p></div>
              <div className="how-step"><span className="step-index">02</span><div className="step-icon"><Sparkles size={19} /></div><h3>{t("step2Title")}</h3><p>{t("step2Desc")}</p></div>
              <div className="how-step"><span className="step-index">03</span><div className="step-icon"><Share2 size={19} /></div><h3>{t("step3Title")}</h3><p>{t("step3Desc")}</p></div>
            </div>
          </section>

          <section className="closing-note">
            <KuruIllustration size={190} className="closing-kuru" mood="cozy" />
            <div><p className="eyebrow">{t("closingEyebrow")}</p><h2>“The worry can stay.<br /><em>You can rest anyway.”</em></h2><p>{t("closingDesc")}</p></div>
            <button className="button button-outline" onClick={() => startChapter(suggestedChapter, allComplete)}>{t("closingCTA")} <ArrowRight size={16} /></button>
          </section>
        </>
      )}

      {view === "play" && (
        <section className="play-layout">
          <div className="play-topline"><button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> {t("playLeave")}</button><span className="play-chapter-label">{t("playChapterLabel", { number: chapter.number, duration: chapterCopy.duration })}</span></div>
          <div className="progress-track" aria-label={t("sceneProgress", { current: sceneIndex + 1, total: chapter.scenes.length })}>
            {chapter.scenes.map((item, index) => <span key={item.title} className={index <= sceneIndex ? "progress-segment filled" : "progress-segment"} />)}
          </div>
          <div className="play-main">
            <div className="play-art-panel"><div className="play-art-moon">☾</div><KuruIllustration size={340} className="play-kuru" mood={sceneIndex === 1 ? "curious" : "sleepy"} /><div className="play-art-caption"><span>THE DREAM STATION</span><span>{t("playSceneLabel", { current: sceneIndex + 1, total: chapter.scenes.length })}</span></div></div>
            <div className="story-panel">
              <p className="eyebrow">{sceneCopy.eyebrow}</p>{choiceEcho && <div className="choice-echo"><Sparkles size={13} /><span>{choiceEcho}</span></div>}<h1>{sceneCopy.title}</h1><p className="story-body">{sceneCopy.body}</p>
              <div className="choice-divider"><span>{t("playChoicePrompt")}</span><i /></div>
              <div className="choice-list">
                {scene.choices.map((choice, index) => <button className="choice-button" key={choice.id} onClick={() => choose(choice.trait, choice.weight, sceneCopy.choices[choice.id].response)}><span className="choice-index">{String(index + 1).padStart(2, "0")}</span><span className="choice-text"><strong>{sceneCopy.choices[choice.id].label}</strong></span><span className="choice-arrow"><ArrowRight size={16} /></span></button>)}
              </div>
              <p className="story-footnote"><Moon size={13} /> {t("playFootnote")}</p>
            </div>
          </div>
        </section>
      )}

      {view === "ending" && ending && (
        <section className="ending-layout">
          <button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> {t("backToStation")}</button>
          <div className="ending-card">
            <div className="ending-art"><div className="ending-glow" /><KuruIllustration size={310} className="ending-kuru" mood="cozy" /><span className="ending-spark ending-spark-one">✦</span><span className="ending-spark ending-spark-two">✧</span></div>
            <div className="ending-copy">
              <p className="eyebrow">{t("chapterEndingLabel", { number: chapter.number })}</p><h1>{endingCopy?.title}</h1><p className="ending-treat">{endingCopy?.treat}</p>{finalEcho && <div className="ending-echo"><Sparkles size={13} /><span>{finalEcho}</span></div>}<p className="ending-description">{endingCopy?.description}</p>
              <blockquote>“{endingCopy?.shareLine}”</blockquote>
              <div className="ending-actions"><button className="button button-primary" onClick={shareEnding}><Share2 size={16} /> {t("endingShare")}</button><button className="button button-outline" onClick={() => setView("shelf")}><Bookmark size={16} /> {t("endingShelf")}</button></div>
              <div className="ending-next">
                {chapters.findIndex((item) => item.id === chapter.id) < chapters.length - 1 ? <button onClick={() => startChapter(chapters[chapters.findIndex((item) => item.id === chapter.id) + 1])}>{t("endingNext")} <ArrowRight size={15} /></button> : <button onClick={() => setView("home")}>{t("endingReturn")} <ArrowRight size={15} /></button>}
                <button className="replay-link" onClick={() => startChapter(chapter, true)}><RotateCcw size={13} /> {t("endingReplay")}</button>
              </div>
            </div>
          </div>
          <div className="ending-invite"><div><span className="invite-star">✦</span><strong>{t("endingInviteTitle")}</strong><p>{t("endingInviteDesc")}</p></div><button className="button button-outline" onClick={shareEnding}>{t("endingInviteButton")} <ArrowRight size={15} /></button></div>
        </section>
      )}

      {view === "shelf" && (
        <section className="shelf-layout">
          <div className="shelf-heading"><button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> {t("backToStation")}</button><p className="eyebrow">{t("shelfEyebrow")}</p><h1>{t("shelfTitle1")}<br /><em>{t("shelfTitle2")}</em></h1><p>{t("shelfDesc")}</p></div>
          <div className="shelf-grid">
            {chapters.map((item, index) => {
              const savedEnding = save.endings[item.id];
              const itemCopy = getStoryCopy(locale, item.id);
              const savedEndingCopy = savedEnding ? itemCopy.endings[getEndingTrait(item.id, savedEnding.id)] : null;
              const done = save.completed.includes(item.id);
              const unlocked = index === 0 || save.completed.includes(chapters[index - 1].id);
              return <article className={"shelf-card" + (done ? " shelf-card-done" : "")} key={item.id}><div className="shelf-card-number">{item.number}</div><div><span className="eyebrow">{done ? t("shelfOnShelf") : t("shelfNotOpened")}</span><h3>{itemCopy.title}</h3><p>{savedEndingCopy ? savedEndingCopy.treat : itemCopy.subtitle}</p></div><span className="shelf-card-mark">{done ? <Check size={17} /> : <Moon size={17} />}</span><button className="chapter-link" disabled={!unlocked} onClick={() => startChapter(item, done)}>{done ? t("playAnother") : unlocked ? t("openChapter") : t("finishPrevious")} <ArrowRight size={15} /></button></article>;
            })}
          </div>
          <div className="shelf-controls"><div><strong>{t("shelfProgress", { completed: completedCount })}</strong><span>{t("shelfProgressDesc")}</span></div><button className="text-button" onClick={() => setShowReset(true)}><RotateCcw size={14} /> {t("shelfClear")}</button></div>
        </section>
      )}

      {view === "about" && (
        <section className="about-layout">
          <button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> {t("backToStation")}</button><p className="eyebrow">{t("aboutEyebrow")}</p><h1>{t("aboutTitle")}</h1>
          <div className="about-grid">
            <div className="about-copy"><p>{t("aboutCopy1")}</p><p>{t("aboutCopy2")}</p><p>This is not therapy, counselling or mental-health support. It does not diagnose, treat or promise to resolve real-life problems.</p></div>
            <div className="privacy-card"><h3>{t("aboutPrivacyTitle")}</h3><ul><li>{t("aboutPrivacy1")}</li><li>{t("aboutPrivacy2")}</li><li>{t("aboutPrivacy3")}</li><li>{t("aboutPrivacy4")}</li><li>You can clear local progress from your Story Shelf.</li></ul><p>{t("aboutPrivacyNote")}</p></div>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-brand"><span className="brand-mark"><Moon size={15} /></span><span><strong>THE DREAM STATION</strong><small>{t("footerTagline")}</small></span></div>
        <div className="footer-links"><button onClick={() => setView("about")}>{t("footerAbout")}</button><span>·</span><span>{t("footerBeta")}</span><span>·</span><span>{t("footerNoAccount")}</span></div>
        <span className="footer-note">{t("footerCopyright")}</span>
      </footer>

      {showReset && <div className="modal-backdrop" role="presentation"><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title"><button className="icon-button modal-close" onClick={() => setShowReset(false)} aria-label={t("modalClose")}><X size={17} /></button><p className="eyebrow">{t("modalEyebrow")}</p><h2 id="reset-title">{t("modalTitle")}</h2><p>{t("modalDesc")}</p><div className="modal-actions"><button className="button button-outline" onClick={() => setShowReset(false)}>{t("modalKeep")}</button><button className="button button-danger" onClick={resetProgress}>{t("modalClear")}</button></div></div></div>}
      {toast && <div className="toast" role="status"><Check size={15} /> {toast}</div>}
    </main>
  );
}
