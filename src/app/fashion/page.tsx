"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, Bell, Bookmark, Check,
  ChevronDown, ChevronRight, CircleHelp, Command, Compass, CreditCard,
  FolderHeart, Gauge,  ImagePlus, Layers3, LayoutDashboard,
  Menu, MoreHorizontal, Plus, Search, Settings2, Shirt, Sparkles,
  TrendingUp, WandSparkles, X, Zap
} from "lucide-react";

type ViewId = "overview" | "identity" | "studio" | "campaigns" | "wardrobe" | "insights" | "commercial";
type Look = { title: string; category: string; image: string; status: string; date: string };
type Campaign = { name: string; channel: string; progress: number; status: string };

const navItems: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "identity", label: "Creator identity", icon: Compass },
  { id: "studio", label: "Fashion studio", icon: WandSparkles },
  { id: "campaigns", label: "Campaigns", icon: Layers3 },
  { id: "wardrobe", label: "Digital wardrobe", icon: Shirt },
  { id: "insights", label: "Creator intelligence", icon: Gauge },
  { id: "commercial", label: "Commercial", icon: CreditCard },
];

const initialLooks: Look[] = [
  { title: "Quiet confidence", category: "Editorial · 4:5", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85", status: "Ready to publish", date: "Today" },
  { title: "City after hours", category: "Street style · 9:16", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85", status: "In review", date: "Yesterday" },
  { title: "Soft structure", category: "Lookbook · 1:1", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85", status: "Draft", date: "Nov 23" },
];

const initialCampaigns: Campaign[] = [
  { name: "The art of layering", channel: "Instagram · 5 assets", progress: 80, status: "In production" },
  { name: "A softer uniform", channel: "TikTok · 3 assets", progress: 45, status: "In production" },
  { name: "Objects of desire", channel: "Pinterest · 8 assets", progress: 100, status: "Ready" },
];

const viewCopy: Record<ViewId, { eyebrow: string; title: string; description: string }> = {
  overview: { eyebrow: "YOUR CREATIVE SPACE", title: "Make your next look unforgettable.", description: "One considered workspace for your style, your stories, and everything you publish." },
  identity: { eyebrow: "CREATOR IDENTITY", title: "A visual identity that stays unmistakably yours.", description: "Define your signature look and keep every creative output consistent." },
  studio: { eyebrow: "FASHION STUDIO", title: "From a clear idea to a complete look.", description: "Compose the model, styling, setting, and format before you create." },
  campaigns: { eyebrow: "CAMPAIGN DESK", title: "Turn one idea into a whole campaign.", description: "Plan, produce, and publish a coherent story across every channel." },
  wardrobe: { eyebrow: "DIGITAL WARDROBE", title: "Every piece. More possibilities.", description: "Build a searchable source of truth for the pieces you wear and feature." },
  insights: { eyebrow: "CREATOR INTELLIGENCE", title: "Understand what moves your audience.", description: "See the patterns behind your strongest creative work." },
  commercial: { eyebrow: "COMMERCIAL STUDIO", title: "Make your influence work harder.", description: "Organize brand opportunities, offers, and the business behind your work." },
};

const imagePool = [
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=85",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
];

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>("overview");
  const [looks, setLooks] = useState<Look[]>(initialLooks);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [modal, setModal] = useState<"look" | "campaign" | "piece" | null>(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [lookTitle, setLookTitle] = useState("New editorial direction");
  const [lookMood, setLookMood] = useState("Quiet luxury");
  const [lookFormat, setLookFormat] = useState("Instagram portrait · 4:5");
  const [campaignName, setCampaignName] = useState("");
  const [campaignChannel, setCampaignChannel] = useState("Instagram");
  const [pieceName, setPieceName] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const copy = viewCopy[activeView];
  const readyLooks = useMemo(() => looks.filter((look) => look.status === "Ready to publish").length, [looks]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function createLook(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newLook: Look = {
      title: lookTitle.trim() || "Untitled direction",
      category: lookFormat,
      image: imagePool[selectedImage],
      status: "Draft",
      date: "Just now",
    };
    setLooks((current) => [newLook, ...current]);
    setModal(null);
    setActiveView("studio");
    showNotice("Look brief saved to your studio.");
  }

  function createCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!campaignName.trim()) return;
    setCampaigns((current) => [{ name: campaignName.trim(), channel: campaignChannel + " · 1 asset", progress: 0, status: "Planning" }, ...current]);
    setCampaignName("");
    setModal(null);
    setActiveView("campaigns");
    showNotice("Campaign created.");
  }

  function addPiece(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pieceName.trim()) return;
    setPieceName("");
    setModal(null);
    showNotice("Wardrobe piece added to your local demo.");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">v.</div>
          <div><div className="brand-name">vesti</div><div className="brand-sub">CREATOR STUDIO</div></div>
          <button className="icon-button sidebar-close" aria-label="Close menu" onClick={() => setMobileMenu(false)}><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">A</div>
          <div className="workspace-meta"><strong>Alex Morgan</strong><span>Personal workspace</span></div>
          <ChevronDown size={15} className="muted-icon" />
        </div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={`nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => { setActiveView(item.id); setMobileMenu(false); }}>
              <Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.id === "studio" && <span className="nav-new">NEW</span>}
            </button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card">
            <div className="plan-top"><span className="plan-icon"><Zap size={14} /></span><span>CREATOR PLAN</span><span className="plan-status">ACTIVE</span></div>
            <div className="credits-line"><strong>68</strong><span>of 100 credits left</span></div>
            <div className="credit-track"><span /></div>
            <button onClick={() => { setActiveView("commercial"); showNotice("Plan options are part of the product roadmap."); }} className="upgrade-link">Explore plans <ArrowUpRight size={13} /></button>
          </div>
          <button className="nav-item utility-item" onClick={() => showNotice("Settings are coming to your workspace.")}><Settings2 size={17} /><span>Settings</span></button>
          <button className="nav-item utility-item" onClick={() => showNotice("Help centre is being prepared.")}><CircleHelp size={17} /><span>Help & support</span></button>
          <div className="sidebar-footer"><span>VESTI STUDIO</span><span>PREVIEW 0.1</span></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" aria-label="Open menu" onClick={() => setMobileMenu(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{navItems.find((item) => item.id === activeView)?.label}</strong></div>
          <div className="top-actions">
            <div className="search-box"><Search size={15} /><span>Search your studio</span><kbd><Command size={10} /> K</kbd></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => showNotice("You're all caught up.")}><Bell size={17} /><i /></button>
            <div className="top-avatar">AM</div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="page-heading">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" />{copy.eyebrow}<span className="heading-date">THURSDAY, NOVEMBER 26</span></div>
              <h1>{copy.title}</h1>
              <p>{copy.description}</p>
            </div>
            <div className="heading-actions">
              <button className="button button-secondary" onClick={() => showNotice("Your studio link is ready to share after publishing.")}><ArrowUpRight size={15} /> Share studio</button>
              <button className="button button-primary" onClick={() => setModal("look")}><Plus size={16} /> Create a look</button>
            </div>
          </section>

          {activeView === "overview" && <Overview looks={looks} campaigns={campaigns} readyLooks={readyLooks} onOpen={setActiveView} onCreate={() => setModal("look")} />}
          {activeView === "identity" && <IdentityView onNotice={showNotice} />}
          {activeView === "studio" && <StudioView looks={looks} onCreate={() => setModal("look")} onNotice={showNotice} />}
          {activeView === "campaigns" && <CampaignsView campaigns={campaigns} onCreate={() => setModal("campaign")} onNotice={showNotice} />}
          {activeView === "wardrobe" && <WardrobeView onAdd={() => setModal("piece")} onNotice={showNotice} />}
          {activeView === "insights" && <InsightsView onNotice={showNotice} />}
          {activeView === "commercial" && <CommercialView onNotice={showNotice} />}

          <footer className="page-footer"><span>© 2026 VESTI STUDIO</span><span>MADE FOR THE NEXT GENERATION OF FASHION CREATORS</span><span>ALL SYSTEMS IN PREVIEW</span></footer>
        </div>
      </main>

      {mobileMenu && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
      {notice && <div className="toast"><span className="toast-check"><Check size={14} /></span>{notice}</div>}

      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}>
        <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-head"><div><div className="eyebrow">VESTI STUDIO</div><h2 id="modal-title">{modal === "look" ? "Start a new look" : modal === "campaign" ? "Create a campaign" : "Add to your wardrobe"}</h2></div><button className="icon-button" aria-label="Close dialog" onClick={() => setModal(null)}><X size={18} /></button></div>
          {modal === "look" && <form onSubmit={createLook} className="modal-form">
            <label>LOOK NAME<input value={lookTitle} onChange={(event) => setLookTitle(event.target.value)} placeholder="e.g. Sunday in the city" /></label>
            <label>CREATIVE DIRECTION<select value={lookMood} onChange={(event) => setLookMood(event.target.value)}><option>Quiet luxury</option><option>Street editorial</option><option>Romantic minimalism</option><option>Avant-garde</option><option>Sport utility</option></select></label>
            <label>OUTPUT FORMAT<select value={lookFormat} onChange={(event) => setLookFormat(event.target.value)}><option>Instagram portrait · 4:5</option><option>Story / Reel · 9:16</option><option>Square editorial · 1:1</option><option>Lookbook spread · 16:9</option></select></label>
            <div className="label-row"><span>VISUAL STARTING POINT</span><span>Choose one</span></div>
            <div className="image-choice-row">{imagePool.map((image, index) => <button type="button" key={image} className={`image-choice ${selectedImage === index ? "selected" : ""}`} style={{ backgroundImage: `url(${image})` }} onClick={() => setSelectedImage(index)} aria-label={`Select visual ${index + 1}`}>{selectedImage === index && <Check size={17} />}</button>)}</div>
            <div className="modal-note"><Sparkles size={15} /> This saves a creative brief in the interactive preview. AI image generation will connect in the next build.</div>
            <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary">Save look brief <ArrowRight size={15} /></button></div>
          </form>}
          {modal === "campaign" && <form onSubmit={createCampaign} className="modal-form">
            <label>CAMPAIGN NAME<input autoFocus value={campaignName} onChange={(event) => setCampaignName(event.target.value)} placeholder="e.g. Winter, in colour" required /></label>
            <label>PRIMARY CHANNEL<select value={campaignChannel} onChange={(event) => setCampaignChannel(event.target.value)}><option>Instagram</option><option>TikTok</option><option>Pinterest</option><option>YouTube</option><option>Multi-channel</option></select></label>
            <div className="modal-note"><Layers3 size={15} /> Your campaign workspace will include creative direction, assets, and publishing tasks.</div>
            <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary">Create campaign <ArrowRight size={15} /></button></div>
          </form>}
          {modal === "piece" && <form onSubmit={addPiece} className="modal-form">
            <label>PIECE NAME<input autoFocus value={pieceName} onChange={(event) => setPieceName(event.target.value)} placeholder="e.g. Oversized wool blazer" required /></label>
            <label>CATEGORY<select><option>Outerwear</option><option>Tops</option><option>Bottoms</option><option>Shoes</option><option>Accessories</option></select></label>
            <div className="modal-note"><ImagePlus size={15} /> In this preview, wardrobe entries are local. Image upload and cloud sync are part of the connected build.</div>
            <div className="modal-actions"><button type="button" className="button button-secondary" onClick={() => setModal(null)}>Cancel</button><button type="submit" className="button button-primary">Add piece <Plus size={15} /></button></div>
          </form>}
        </div>
      </div>}
    </div>
  );
}

function Overview({ looks, campaigns, readyLooks, onOpen, onCreate }: { looks: Look[]; campaigns: Campaign[]; readyLooks: number; onOpen: (view: ViewId) => void; onCreate: () => void }) {
  return <>
    <section className="hero-grid">
      <div className="hero-card">
        <div className="hero-photo" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="hero-pill"><span /> FEATURED CREATIVE DIRECTION</div>
          <div className="hero-title">The art of<br /><em>being seen.</em></div>
          <p>A new season. A sharper point of view.<br />Your next story starts here.</p>
          <button className="hero-cta" onClick={() => onOpen("studio")}>Open fashion studio <ArrowUpRight size={15} /></button>
        </div>
        <div className="hero-index">01 <span>/</span> 04</div>
      </div>
      <div className="identity-card">
        <div className="card-overline"><span>YOUR SIGNATURE</span><button className="more-button" onClick={() => onOpen("identity")} aria-label="Open creator identity"><MoreHorizontal size={19} /></button></div>
        <div className="identity-portrait"><div className="portrait-tag">STYLE DNA <span>ACTIVE</span></div></div>
        <div className="identity-name-row"><div><h3>Alex Morgan</h3><p>Modern romantic · Minimalist</p></div><button className="round-arrow" onClick={() => onOpen("identity")} aria-label="Edit identity"><ArrowUpRight size={16} /></button></div>
        <div className="palette-label">YOUR COLOUR STORY</div>
        <div className="palette"><span style={{ background: "#d9c8b2" }} /><span style={{ background: "#8e8a7f" }} /><span style={{ background: "#2c3432" }} /><span style={{ background: "#e8e2d9" }} /><span style={{ background: "#9b5849" }} /><span className="palette-more">+3</span></div>
        <button className="text-link" onClick={() => onOpen("identity")}>Refine your identity <ArrowRight size={14} /></button>
      </div>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><div className="eyebrow">IN THE MAKING</div><h2>Your creative desk</h2></div><button className="text-link" onClick={() => onOpen("studio")}>View all work <ArrowRight size={14} /></button></div>
      <div className="look-grid">
        {looks.slice(0, 3).map((look, index) => <article className="look-card" key={look.title + index}>
          <div className="look-image" style={{ backgroundImage: `url(${look.image})` }}><span className={`look-status ${look.status === "Ready to publish" ? "status-ready" : ""}`}>{look.status}</span><button className="look-bookmark" aria-label="Save look"><Bookmark size={15} /></button></div>
          <div className="look-info"><div><h3>{look.title}</h3><p>{look.category}</p></div><span className="look-date">{look.date}</span></div>
        </article>)}
        <button className="new-look-card" onClick={onCreate}><span className="new-look-icon"><Plus size={20} /></span><strong>Create something new</strong><span>Start with a direction, build a look.</span><i><ArrowUpRight size={16} /></i></button>
      </div>
    </section>

    <section className="bottom-grid">
      <div className="pulse-card">
        <div className="section-heading compact"><div><div className="eyebrow">YOUR CREATIVE PULSE</div><h2>A good rhythm.</h2></div><span className="period-pill">LAST 30 DAYS <ChevronDown size={12} /></span></div>
        <div className="metrics-row">
          <div className="metric"><span>LOOKS CREATED</span><strong>{looks.length + 12}</strong><small className="metric-up"><TrendingUp size={12} /> 18% <i>vs. last month</i></small></div>
          <div className="metric"><span>READY TO PUBLISH</span><strong>{readyLooks + 4}</strong><small>Across 3 formats</small></div>
          <div className="metric"><span>CAMPAIGNS</span><strong>{campaigns.length + 2}</strong><small>2 in progress</small></div>
        </div>
        <div className="pulse-chart"><div className="chart-labels"><span>CREATIVE OUTPUT</span><span>WEEKLY ACTIVITY</span></div><div className="bars">{[28, 43, 35, 58, 44, 72, 52, 64, 48, 84, 62, 94, 69, 78, 56, 88, 72, 100, 66, 82, 58, 91, 74, 86].map((height, index) => <span key={index} style={{ height: height + "%" }} />)}</div><div className="chart-days"><span>OCT 27</span><span>NOV 03</span><span>NOV 10</span><span>NOV 17</span><span>NOV 26</span></div></div>
      </div>
      <div className="campaign-card">
        <div className="section-heading compact"><div><div className="eyebrow">IN PROGRESS</div><h2>Campaign desk</h2></div><button className="more-button" onClick={() => onOpen("campaigns")} aria-label="Open campaigns"><ArrowUpRight size={17} /></button></div>
        <div className="campaign-list">{campaigns.slice(0, 3).map((campaign) => <div className="campaign-row" key={campaign.name}><div className="campaign-symbol"><Layers3 size={16} /></div><div className="campaign-detail"><strong>{campaign.name}</strong><span>{campaign.channel}</span><div className="mini-progress"><i style={{ width: campaign.progress + "%" }} /></div></div><span className="campaign-percent">{campaign.progress}%</span></div>)}</div>
        <button className="text-link campaign-link" onClick={() => onOpen("campaigns")}>Go to campaign desk <ArrowRight size={14} /></button>
      </div>
    </section>
  </>;
}

function IdentityView({ onNotice }: { onNotice: (message: string) => void }) {
  return <div className="module-layout">
    <section className="module-main identity-main">
      <div className="module-cover"><div className="module-cover-image" /><div className="module-cover-overlay" /><div className="module-cover-content"><span className="hero-pill"><span /> IDENTITY PROFILE · V1.0</span><h2>Consistency is<br /><em>your signature.</em></h2><p>A living profile of the visual codes that make your work recognisable.</p></div></div>
      <div className="module-panel"><div className="section-heading compact"><div><div className="eyebrow">IDENTITY BUILDING BLOCKS</div><h2>Your visual language</h2></div><button className="button button-secondary button-small" onClick={() => onNotice("Identity editor opened in preview mode.")}>Edit profile <ArrowUpRight size={14} /></button></div>
        <div className="identity-block-grid"><div className="identity-block"><span>01 / AESTHETIC</span><strong>Modern romantic</strong><p>Soft structure, considered details, effortless silhouettes.</p></div><div className="identity-block"><span>02 / COLOUR WORLD</span><div className="large-palette"><i /><i /><i /><i /><i /></div><p>Warm neutrals · muted earth · deep accents</p></div><div className="identity-block"><span>03 / VISUAL TONE</span><strong>Quietly expressive</strong><p>Natural light, tactile textures, candid movement.</p></div></div>
      </div>
    </section>
    <aside className="module-aside"><div className="aside-card"><div className="eyebrow">IDENTITY HEALTH</div><div className="score-ring"><div><strong>86</strong><span>/100</span></div></div><h3>Strong point of view.</h3><p>Your recent work is consistent in palette and silhouette. Add more variety in locations to widen your visual range.</p><div className="score-line"><span>Colour consistency</span><strong>92%</strong></div><div className="score-line"><span>Silhouette consistency</span><strong>88%</strong></div><div className="score-line"><span>Scene diversity</span><strong>64%</strong></div></div><div className="aside-note"><Sparkles size={16} /><span>Style DNA helps keep future creative outputs aligned with your signature. Connect a generation provider to activate model consistency.</span></div></aside>
  </div>;
}

function StudioView({ looks, onCreate, onNotice }: { looks: Look[]; onCreate: () => void; onNotice: (message: string) => void }) {
  return <div className="module-layout">
    <section className="module-main"><div className="studio-toolbar"><div><div className="eyebrow">COMPOSE · DIRECT · CREATE</div><h2>The fashion composition room</h2><p>Build a creative brief with the pieces that matter: identity, styling, scene, and format.</p></div><button className="button button-primary" onClick={onCreate}><Plus size={15} /> New composition</button></div>
      <div className="studio-feature"><div className="studio-feature-image" /><div className="studio-feature-copy"><span className="eyebrow">START WITH A POINT OF VIEW</span><h2>Good style is<br /><em>never accidental.</em></h2><p>Choose a visual direction, define the details, and build a repeatable creative language for every look.</p><button className="button button-primary" onClick={onCreate}>Build a look <ArrowRight size={15} /></button></div></div>
      <div className="section-heading"><div><div className="eyebrow">YOUR COMPOSITIONS</div><h2>Recent directions</h2></div><span className="count-pill">{looks.length} SAVED</span></div>
      <div className="look-grid studio-look-grid">{looks.map((look, index) => <article className="look-card" key={look.title + index}><div className="look-image" style={{ backgroundImage: `url(${look.image})` }}><span className="look-status">{look.status}</span><button className="look-bookmark" aria-label="Save look"><Bookmark size={15} /></button></div><div className="look-info"><div><h3>{look.title}</h3><p>{look.category}</p></div><span className="look-date">{look.date}</span></div></article>)}</div>
    </section>
    <aside className="module-aside"><div className="aside-card"><div className="eyebrow">COMPOSITION FLOW</div><h3>Four decisions.<br />One clear direction.</h3><div className="flow-list"><div><span>01</span><section><strong>Creator identity</strong><small>Style DNA & visual consistency</small></section><Check size={15} /></div><div><span>02</span><section><strong>Look composition</strong><small>Garment, fit & styling</small></section><Check size={15} /></div><div><span>03</span><section><strong>Scene direction</strong><small>Location, light & atmosphere</small></section><ArrowRight size={15} /></div><div><span>04</span><section><strong>Publishing format</strong><small>Channel-ready output</small></section><ArrowRight size={15} /></div></div><button className="text-link" onClick={() => onNotice("The composition checklist is ready in preview mode.")}>Explore the workflow <ArrowRight size={14} /></button></div><div className="aside-note"><Zap size={16} /><span>Preview mode: briefs are saved locally. Connect the image generation engine to render final assets.</span></div></aside>
  </div>;
}

function CampaignsView({ campaigns, onCreate, onNotice }: { campaigns: Campaign[]; onCreate: () => void; onNotice: (message: string) => void }) {
  return <div className="module-panel campaign-page"><div className="section-heading"><div><div className="eyebrow">YOUR STORIES, IN MOTION</div><h2>Campaign overview</h2><p>One creative direction, adapted with intent for every channel.</p></div><button className="button button-primary" onClick={onCreate}><Plus size={15} /> New campaign</button></div>
    <div className="campaign-summary"><div><span>ACTIVE CAMPAIGNS</span><strong>{campaigns.length}</strong></div><div><span>ASSETS IN PRODUCTION</span><strong>{campaigns.reduce((sum, item) => sum + (item.progress < 100 ? 1 : 0), 0) + 4}</strong></div><div><span>READY TO PUBLISH</span><strong>{campaigns.filter((item) => item.progress === 100).length + 2}</strong></div></div>
    <div className="campaign-table"><div className="table-head"><span>CAMPAIGN</span><span>PROGRESS</span><span>STATUS</span><span>ACTION</span></div>{campaigns.map((campaign) => <div className="table-row" key={campaign.name}><div className="table-campaign"><span className="campaign-symbol"><Layers3 size={16} /></span><section><strong>{campaign.name}</strong><small>{campaign.channel}</small></section></div><div className="table-progress"><div className="mini-progress"><i style={{ width: campaign.progress + "%" }} /></div><span>{campaign.progress}%</span></div><div><span className={`status-chip ${campaign.progress === 100 ? "status-complete" : ""}`}>{campaign.status}</span></div><button className="icon-button" aria-label="Open campaign" onClick={() => onNotice("Campaign details are available in the next workflow build.")}><ArrowUpRight size={16} /></button></div>)}</div>
  </div>;
}

function WardrobeView({ onAdd, onNotice }: { onAdd: () => void; onNotice: (message: string) => void }) {
  const pieces = [
    { name: "The sculpted blazer", type: "OUTERWEAR · WOOL", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=700&q=85", tone: "Warm stone" },
    { name: "Everyday white shirt", type: "TOPS · COTTON", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=700&q=85", tone: "Chalk" },
    { name: "The relaxed trouser", type: "BOTTOMS · TAILORED", image: "https://images.unsplash.com/photo-1506629905607-d9c297d6b9b5?w=700&q=85", tone: "Charcoal" },
    { name: "Soft leather tote", type: "ACCESSORIES · LEATHER", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700&q=85", tone: "Espresso" },
  ];
  return <div className="module-panel"><div className="section-heading"><div><div className="eyebrow">YOUR PERSONAL ARCHIVE</div><h2>Pieces with a point of view.</h2><p>Keep your wardrobe organized and ready for the next composition.</p></div><button className="button button-primary" onClick={onAdd}><Plus size={15} /> Add a piece</button></div><div className="wardrobe-tools"><div className="search-box wardrobe-search"><Search size={15} /><span>Search your wardrobe</span></div><div className="filter-pills"><button className="filter-active">All pieces <span>24</span></button><button onClick={() => onNotice("Outerwear filter selected.")}>Outerwear</button><button onClick={() => onNotice("Tops filter selected.")}>Tops</button><button onClick={() => onNotice("Accessories filter selected.")}>Accessories</button></div></div><div className="wardrobe-grid">{pieces.map((piece) => <article className="wardrobe-item" key={piece.name}><div className="wardrobe-image" style={{ backgroundImage: `url(${piece.image})` }}><button className="look-bookmark" aria-label="Save piece"><Bookmark size={15} /></button></div><div className="wardrobe-info"><div><h3>{piece.name}</h3><p>{piece.type}</p></div><span>{piece.tone}</span></div></article>)}</div><div className="wardrobe-footnote"><FolderHeart size={16} /> Showing a curated sample wardrobe. Upload and cloud-synced inventory are part of the connected product build.</div></div>;
}

function InsightsView({ onNotice }: { onNotice: (message: string) => void }) {
  return <div className="insights-grid"><div className="insight-wide"><div className="section-heading compact"><div><div className="eyebrow">AUDIENCE RESPONSE</div><h2>Your content is finding its rhythm.</h2></div><span className="period-pill">LAST 30 DAYS <ChevronDown size={12} /></span></div><div className="insight-stats"><div><span>ENGAGEMENT RATE</span><strong>6.8%</strong><small className="metric-up"><TrendingUp size={12} /> 1.2 pts</small></div><div><span>PROFILE VISITS</span><strong>24.6k</strong><small className="metric-up"><TrendingUp size={12} /> 18.4%</small></div><div><span>SAVES / SHARES</span><strong>3,280</strong><small className="metric-up"><TrendingUp size={12} /> 12.6%</small></div></div><div className="large-chart"><div className="chart-labels"><span>ENGAGEMENT TREND</span><span>ILLUSTRATIVE PREVIEW DATA</span></div><div className="large-bars">{[35,48,43,60,52,72,58,68,55,80,66,88,70,95,76,86,64,100,82,92,73,96,80,89,75,98,84,100].map((height,index)=><span key={index} style={{height:height+"%"}} />)}</div></div></div><div className="insight-side"><div className="eyebrow">WHAT&apos;S WORKING</div><h3>Editorial looks are your strongest format.</h3><p>Looks with natural light and warm neutral palettes are outperforming your average save rate.</p><div className="insight-highlight"><span>TOP PERFORMING FORMAT</span><strong>Editorial · 4:5</strong><small>+24% saves vs. your average</small></div><button className="text-link" onClick={() => onNotice("A detailed insight report is being prepared.")}>See all insights <ArrowRight size={14} /></button></div></div>;
}

function CommercialView({ onNotice }: { onNotice: (message: string) => void }) {
  return <div className="module-layout"><section className="module-main"><div className="commercial-banner"><div><span className="eyebrow">THE BUSINESS OF YOUR CREATIVITY</span><h2>Good work deserves<br /><em>good business.</em></h2><p>Bring brand opportunities, deliverables, and your creator offers into one clear space.</p><button className="button button-primary" onClick={() => onNotice("Your media kit builder is coming in the next release.")}>Build your media kit <ArrowRight size={15} /></button></div><div className="commercial-visual"><CreditCard size={42} strokeWidth={1} /><span>CREATOR<br />PARTNERSHIP</span><small>VESTI / 001</small></div></div><div className="section-heading"><div><div className="eyebrow">OPPORTUNITY PIPELINE</div><h2>Brand relationships</h2></div><button className="button button-secondary button-small" onClick={() => onNotice("Opportunity form opened in preview mode.")}><Plus size={14} /> Add opportunity</button></div><div className="opportunity-list"><div><span className="opportunity-dot" /><section><strong>Atelier No. 8</strong><small>Autumn editorial · 3 deliverables</small></section><b>In discussion</b></div><div><span className="opportunity-dot muted" /><section><strong>Form & Field</strong><small>Product feature · 1 reel + 2 stories</small></section><b>Proposal sent</b></div><div><span className="opportunity-dot green" /><section><strong>Studio Serein</strong><small>Seasonal lookbook · 6 assets</small></section><b>Confirmed</b></div></div></section><aside className="module-aside"><div className="aside-card"><div className="eyebrow">YOUR CREATOR OFFER</div><h3>Make your value easy to understand.</h3><p>Keep your positioning, audience snapshot, and collaboration formats ready for the next conversation.</p><div className="offer-stat"><span>MEDIA KIT</span><strong>Not published</strong></div><div className="offer-stat"><span>RATE CARD</span><strong>In progress</strong></div><button className="text-link" onClick={() => onNotice("Creator offer editor opened in preview mode.")}>Set up your offer <ArrowRight size={14} /></button></div></aside></div>;
}
