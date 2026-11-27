"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Clock3, Heart, LockKeyhole, Moon, RotateCcw, Share2, Sparkles, X } from "lucide-react";
import { chapters, emptyTraits, nextTraits, resolveEnding, type Chapter, type Ending, type Trait, type Traits } from "@/lib/story";
import { KuruIllustration } from "@/components/kuru";

type View = "home" | "play" | "ending" | "shelf" | "about";
type SaveData = { completed: string[]; endings: Record<string, Ending>; traits: Traits; lastChapter?: string; lastEnding?: Ending };
type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
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
  const [view, setView] = useState<View>("home");
  const [sessionSave, setSessionSave] = useState<SaveData>(defaultSave);
  const [ageSessionConfirmed, setAgeSessionConfirmed] = useState(false);
  const [activeChapterId, setActiveChapterId] = useState(chapters[0].id);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [traits, setTraits] = useState<Traits>(emptyTraits);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [toast, setToast] = useState("");
  const [inviteDismissed, setInviteDismissed] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
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

  const chapter = useMemo(() => chapters.find((item) => item.id === activeChapterId) ?? chapters[0], [activeChapterId]);
  const scene = chapter.scenes[sceneIndex];
  const completedCount = save.completed.length;
  const allComplete = completedCount >= chapters.length;
  const suggestedChapter = allComplete ? chapters[0] : chapters[completedCount];

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  useEffect(() => {
    const handleInstall = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handleInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleInstall);
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
      setToast("This browser could not save your story. You can still finish this chapter.");
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
      setToast("Finish the previous chapter to open this one.");
      return;
    }
    setActiveChapterId(item.id);
    setSceneIndex(0);
    setTraits(emptyTraits);
    setEnding(null);
    setView("play");
    scrollTop();
  }

  function choose(trait: Trait, weight: number) {
    const updated = nextTraits(traits, trait, weight);
    setTraits(updated);
    if (sceneIndex < chapter.scenes.length - 1) {
      setSceneIndex((value) => value + 1);
      return;
    }
    const result = resolveEnding(chapter.id, updated);
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
    const url = window.location.origin + "/?invite=" + encodeURIComponent(activeChapterId) + "&ending=" + encodeURIComponent(ending.id);
    const shareData = { title: "A little note from the Dream Station", text: ending.shareLine, url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setToast("A story link has been copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
          setToast("A story link has been copied.");
        } catch {
          setToast("Sharing is not available in this browser.");
        }
      }
    }
  }

  async function installApp() {
    if (!installPrompt) {
      setToast("On iPhone: use Share, then Add to Home Screen.");
      return;
    }
    try {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      setInstallPrompt(null);
    } catch {
      setToast("Use your browser menu to add this experience to your home screen.");
    }
  }

  function resetProgress() {
    persist(defaultSave);
    setShowReset(false);
    setEnding(null);
    setView("home");
    setToast("Your local story shelf has been cleared.");
    scrollTop();
  }

  if (!ready) return <main className="boot-screen"><div className="boot-moon"><Moon size={22} /></div><p>Opening the night window…</p></main>;

  if (!ageConfirmed) {
    return (
      <main className="age-gate">
        <div className="age-card">
          <div className="brand-mark"><Moon size={22} /></div>
          <p className="eyebrow">THE DREAM STATION · PRIVATE BETA</p>
          <h1>A small story for the quieter hours.</h1>
          <p className="age-copy">This early interactive story test is intended for adults aged 18 and over. It is a gentle creative experience, not therapy, counselling or mental-health support.</p>
          <button className="button button-primary button-wide" onClick={confirmAge}>I am 18 or older <ArrowRight size={17} /></button>
          <p className="micro-note">Age is self-declared in this prototype; no identity information is collected.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => { setView("home"); scrollTop(); }} aria-label="Dream Station home">
          <span className="brand-mark"><Moon size={18} /></span>
          <span className="brand-wordmark"><strong>THE DREAM STATION</strong><small>THE NIGHT SHIFT</small></span>
        </button>
        <nav className="desktop-nav" aria-label="Main navigation">
          <button className={view === "home" || view === "play" || view === "ending" ? "nav-link active" : "nav-link"} onClick={() => { setView("home"); scrollTop(); }}>The shift</button>
          <button className={view === "shelf" ? "nav-link active" : "nav-link"} onClick={() => { setView("shelf"); scrollTop(); }}>Story shelf <span className="nav-count">{completedCount}</span></button>
          <button className={view === "about" ? "nav-link active" : "nav-link"} onClick={() => { setView("about"); scrollTop(); }}>About</button>
        </nav>
        <button className="install-button" onClick={installApp}><Moon size={14} /> <span>Keep nearby</span></button>
      </header>

      {invite && !inviteDismissed && view === "home" && (
        <div className="invite-banner">
          <span className="invite-icon"><Heart size={16} /></span>
          <div><strong>A friend left the night window open.</strong><span>Try their chapter and make a different choice.</span></div>
          <button onClick={() => { const item = chapters.find((entry) => entry.id === invite.chapterId); if (item) startChapter(item, true); }}>Enter <ArrowRight size={15} /></button>
          <button className="icon-button invite-close" aria-label="Dismiss invitation" onClick={() => setInviteDismissed(true)}><X size={16} /></button>
        </div>
      )}

      {view === "home" && (
        <>
          <section className="hero-section">
            <div className="hero-copy">
              <p className="eyebrow"><span className="eyebrow-dot" /> A LITTLE INTERACTIVE STORY · 2–4 MINUTES</p>
              <h1>Some things can<br /><em>wait until morning.</em></h1>
              <p className="hero-description">At the Dream Station, KURU looks after the little worries that arrive after dark. You choose what happens next. Nothing needs to be solved all at once.</p>
              <div className="hero-actions">
                <button className="button button-primary" onClick={() => startChapter(suggestedChapter, allComplete)}>{completedCount === 0 ? "Enter the night shift" : allComplete ? "Visit the night shift again" : "Continue the night shift"} <ArrowRight size={17} /></button>
                <button className="button button-quiet" onClick={() => setView("shelf")}><Bookmark size={16} /> Your story shelf</button>
              </div>
              <div className="hero-proof">
                <span><Clock3 size={14} /> 2–4 min chapters</span>
                <span><LockKeyhole size={14} /> No account needed</span>
                <span><Sparkles size={14} /> Your choices matter</span>
              </div>
            </div>
            <div className="hero-art-wrap">
              <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
              <div className="hero-art-card">
                <div className="art-card-top"><span>SHIFT NO. 01</span><span>23:47</span></div>
                <KuruIllustration size={390} className="hero-kuru" mood="sleepy" />
                <div className="art-caption"><span className="caption-star">✦</span><span><strong>KURU</strong><small>THE DREAM-NIBBLER</small></span><span className="caption-status">ON DUTY</span></div>
              </div>
              <div className="floating-note note-top"><span className="note-moon">☾</span><span>One thought<br />at a time.</span></div>
              <div className="floating-note note-bottom"><span className="note-dot" /><span>Tonight&apos;s small<br />dream treat</span></div>
            </div>
          </section>

          <section className="chapter-section" id="chapters">
            <div className="section-heading">
              <div><p className="eyebrow">THREE SMALL CHAPTERS</p><h2>The night has a little room.</h2></div>
              <p>Each chapter is a complete story. Your choices shape the ending, and your progress stays on this device.</p>
            </div>
            <div className="chapter-grid">
              {chapters.map((item, index) => {
                const unlocked = index === 0 || save.completed.includes(chapters[index - 1].id);
                const done = save.completed.includes(item.id);
                const savedEnding = save.endings[item.id];
                return (
                  <article className={"chapter-card chapter-card-" + (index + 1) + (unlocked ? "" : " locked")} key={item.id}>
                    <div className="chapter-card-art">
                      <span className="chapter-number">{item.number}</span>
                      {index === 0 ? <div className="cloud-illustration"><span /><span /><span /></div> : index === 1 ? <div className="star-illustration">✦</div> : <div className="shelf-illustration"><i /><i /><i /></div>}
                      {done && <span className="done-stamp"><Check size={12} /> COMPLETED</span>}
                      {!unlocked && <span className="locked-stamp"><LockKeyhole size={12} /> LOCKED</span>}
                    </div>
                    <div className="chapter-card-content">
                      <div className="chapter-meta"><span>CHAPTER {item.number}</span><span><Clock3 size={12} /> {item.duration}</span></div>
                      <h3>{item.title}</h3><p>{item.subtitle}</p>
                      {done && savedEnding && <div className="saved-ending"><Sparkles size={13} /> {savedEnding.treat}</div>}
                      <button className="chapter-link" disabled={!unlocked} onClick={() => startChapter(item, done)}>{done ? "Play another path" : unlocked ? "Open chapter" : "Complete the previous chapter"} <ArrowRight size={15} /></button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="how-section">
            <div className="how-intro"><p className="eyebrow">A QUIETER KIND OF PLAY</p><h2>Read a little.<br /><em>Choose a little.</em></h2><p>No endless feed. No open-ended chatbot. Just a small world that remembers what you chose.</p></div>
            <div className="how-steps">
              <div className="how-step"><span className="step-index">01</span><div className="step-icon"><Moon size={19} /></div><h3>Enter the story</h3><p>Open a chapter directly. No account, download or long setup.</p></div>
              <div className="how-step"><span className="step-index">02</span><div className="step-icon"><Sparkles size={19} /></div><h3>Make a real choice</h3><p>Each choice changes the next scene and the ending you receive.</p></div>
              <div className="how-step"><span className="step-index">03</span><div className="step-icon"><Share2 size={19} /></div><h3>Leave a little note</h3><p>Save your ending on this device or send a friend a link to try their own path.</p></div>
            </div>
          </section>

          <section className="closing-note">
            <KuruIllustration size={190} className="closing-kuru" mood="cozy" />
            <div><p className="eyebrow">A NOTE FROM KURU</p><h2>“The worry can stay.<br /><em>You can rest anyway.”</em></h2><p>Nothing here promises to fix a real problem. It is simply a small story, made for a pause.</p></div>
            <button className="button button-outline" onClick={() => startChapter(suggestedChapter, allComplete)}>Take a small pause <ArrowRight size={16} /></button>
          </section>
        </>
      )}

      {view === "play" && (
        <section className="play-layout">
          <div className="play-topline"><button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> Leave this chapter</button><span className="play-chapter-label">CHAPTER {chapter.number} · {chapter.duration.toUpperCase()}</span></div>
          <div className="progress-track" aria-label={"Scene " + (sceneIndex + 1) + " of " + chapter.scenes.length}>
            {chapter.scenes.map((item, index) => <span key={item.title} className={index <= sceneIndex ? "progress-segment filled" : "progress-segment"} />)}
          </div>
          <div className="play-main">
            <div className="play-art-panel"><div className="play-art-moon">☾</div><KuruIllustration size={340} className="play-kuru" mood={sceneIndex === 1 ? "curious" : "sleepy"} /><div className="play-art-caption"><span>THE DREAM STATION</span><span>SCENE {sceneIndex + 1} / {chapter.scenes.length}</span></div></div>
            <div className="story-panel">
              <p className="eyebrow">{scene.eyebrow}</p><h1>{scene.title}</h1><p className="story-body">{scene.body}</p>
              <div className="choice-divider"><span>WHAT SHOULD KURU DO?</span><i /></div>
              <div className="choice-list">
                {scene.choices.map((choice, index) => <button className="choice-button" key={choice.id} onClick={() => choose(choice.trait, choice.weight)}><span className="choice-index">{String(index + 1).padStart(2, "0")}</span><span className="choice-text"><strong>{choice.label}</strong><small>{choice.response}</small></span><span className="choice-arrow"><ArrowRight size={16} /></span></button>)}
              </div>
              <p className="story-footnote"><Moon size={13} /> Your path is saved only on this device.</p>
            </div>
          </div>
        </section>
      )}

      {view === "ending" && ending && (
        <section className="ending-layout">
          <button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> Back to the station</button>
          <div className="ending-card">
            <div className="ending-art"><div className="ending-glow" /><KuruIllustration size={310} className="ending-kuru" mood="cozy" /><span className="ending-spark ending-spark-one">✦</span><span className="ending-spark ending-spark-two">✧</span></div>
            <div className="ending-copy">
              <p className="eyebrow">YOUR CHAPTER {chapter.number} ENDING</p><h1>{ending.title}</h1><p className="ending-treat">{ending.treat}</p><p className="ending-description">{ending.description}</p>
              <blockquote>“{ending.shareLine}”</blockquote>
              <div className="ending-actions"><button className="button button-primary" onClick={shareEnding}><Share2 size={16} /> Share this ending</button><button className="button button-outline" onClick={() => setView("shelf")}><Bookmark size={16} /> Save on my shelf</button></div>
              <div className="ending-next">
                {chapters.findIndex((item) => item.id === chapter.id) < chapters.length - 1 ? <button onClick={() => startChapter(chapters[chapters.findIndex((item) => item.id === chapter.id) + 1])}>Continue to the next chapter <ArrowRight size={15} /></button> : <button onClick={() => setView("home")}>Return to the night window <ArrowRight size={15} /></button>}
                <button className="replay-link" onClick={() => startChapter(chapter, true)}><RotateCcw size={13} /> Try another path</button>
              </div>
            </div>
          </div>
          <div className="ending-invite"><div><span className="invite-star">✦</span><strong>Leave the window open for a friend.</strong><p>They can follow your link and make a different choice. Their story stays theirs.</p></div><button className="button button-outline" onClick={shareEnding}>Invite a friend <ArrowRight size={15} /></button></div>
        </section>
      )}

      {view === "shelf" && (
        <section className="shelf-layout">
          <div className="shelf-heading"><button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> Back to the station</button><p className="eyebrow">YOUR LOCAL STORY SHELF</p><h1>Things you have<br /><em>left for the morning.</em></h1><p>Your chapters and dream treats are saved in this browser, not in an account.</p></div>
          <div className="shelf-grid">
            {chapters.map((item, index) => {
              const savedEnding = save.endings[item.id];
              const done = save.completed.includes(item.id);
              const unlocked = index === 0 || save.completed.includes(chapters[index - 1].id);
              return <article className={"shelf-card" + (done ? " shelf-card-done" : "")} key={item.id}><div className="shelf-card-number">{item.number}</div><div><span className="eyebrow">{done ? "ON YOUR SHELF" : "NOT OPENED YET"}</span><h3>{item.title}</h3><p>{savedEnding ? savedEnding.treat : item.subtitle}</p></div><span className="shelf-card-mark">{done ? <Check size={17} /> : <Moon size={17} />}</span><button className="chapter-link" disabled={!unlocked} onClick={() => startChapter(item, done)}>{done ? "Try another path" : unlocked ? "Open chapter" : "Complete the previous chapter"} <ArrowRight size={15} /></button></article>;
            })}
          </div>
          <div className="shelf-controls"><div><strong>{completedCount} of 3 chapters completed</strong><span>Progress is stored locally on this device.</span></div><button className="text-button" onClick={() => setShowReset(true)}><RotateCcw size={14} /> Clear local progress</button></div>
        </section>
      )}

      {view === "about" && (
        <section className="about-layout">
          <button className="back-link" onClick={() => setView("home")}><ArrowLeft size={15} /> Back to the station</button><p className="eyebrow">ABOUT THIS SMALL WORLD</p><h1>A story, not a solution.</h1>
          <div className="about-grid">
            <div className="about-copy"><p>The Dream Station is a small interactive-fiction experiment built around KURU, a sleepy night-shift creature who turns little worries into dream treats.</p><p>The chapters are pre-written, finite stories. Your choices change the path and ending. There is no open-ended AI companion, no free-text prompt and no user-generated public feed in this beta.</p><p>This is not therapy, counselling or mental-health support. It does not diagnose, treat or promise to resolve real-life problems.</p></div>
            <div className="privacy-card"><h3>Your privacy, in plain language</h3><ul><li>No account or sign-in.</li><li>Story progress stays in this browser&apos;s local storage.</li><li>No personal story text is requested or sent to a model.</li><li>No global vote counts or audience numbers are shown in this prototype.</li><li>You can clear local progress from your Story Shelf.</li></ul><p>Private beta for adults 18+. Age is self-declared and not independently verified.</p></div>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="footer-brand"><span className="brand-mark"><Moon size={15} /></span><span><strong>THE DREAM STATION</strong><small>A SMALL STORY FOR THE QUIETER HOURS</small></span></div>
        <div className="footer-links"><button onClick={() => setView("about")}>About & privacy</button><span>·</span><span>Private beta · 18+</span><span>·</span><span>No account · No payment</span></div>
        <span className="footer-note">© 2026 THE DREAM STATION · PROJECT CODE NEXORA</span>
      </footer>

      {showReset && <div className="modal-backdrop" role="presentation"><div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="reset-title"><button className="icon-button modal-close" onClick={() => setShowReset(false)} aria-label="Close"><X size={17} /></button><p className="eyebrow">A CLEAN SHELF</p><h2 id="reset-title">Clear your saved stories?</h2><p>This removes your chapter progress and endings from this browser only. It cannot be undone.</p><div className="modal-actions"><button className="button button-outline" onClick={() => setShowReset(false)}>Keep my shelf</button><button className="button button-danger" onClick={resetProgress}>Clear local progress</button></div></div></div>}
      {toast && <div className="toast" role="status"><Check size={15} /> {toast}</div>}
    </main>
  );
}
