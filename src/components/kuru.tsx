type KuruProps = { size?: number; className?: string; mood?: "sleepy" | "curious" | "cozy" };

export function KuruIllustration({ size = 420, className = "", mood = "sleepy" }: KuruProps) {
 return (
  <svg className={"kuru-art " + className} width={size} height={size * 0.92} viewBox="0 0 600 552" role="img" aria-label="KURU, a sleepy cream-coloured dream creature with large lavender ears and a golden crescent moon on its forehead">
   <defs>
    <linearGradient id="kuru-ear" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#d7c8df"/><stop offset="55%" stopColor="#b6a1c7"/><stop offset="100%" stopColor="#8f7b9e"/></linearGradient>
    <linearGradient id="kuru-body" x1="0" y1="0" x2=".8" y2="1"><stop offset="0%" stopColor="#fff8e9"/><stop offset="72%" stopColor="#ead9bd"/><stop offset="100%" stopColor="#d8c3a5"/></linearGradient>
    <linearGradient id="kuru-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffe8a0"/><stop offset="100%" stopColor="#d69c42"/></linearGradient>
    <filter id="kuru-shadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dy="12"/><feComponentTransfer><feFuncA type="linear" slope=".18"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="kuru-soft"><feGaussianBlur stdDeviation="2.4"/></filter>
   </defs>
   <ellipse cx="300" cy="507" rx="190" ry="25" fill="#8f7b9e" opacity=".12" filter="url(#kuru-soft)"/>
   <g className="kuru-ears">
    <path d="M203 194C151 98 83 44 54 79 13 128 49 266 101 345c29 46 93 44 123-8 26-44 13-88-21-143Z" fill="url(#kuru-ear)" stroke="#806b8f" strokeWidth="7" strokeLinejoin="round"/>
    <path d="M397 194c52-96 120-150 149-115 41 49 5 187-47 266-29 46-93 44-123-8-26-44-13-88 21-143Z" fill="url(#kuru-ear)" stroke="#806b8f" strokeWidth="7" strokeLinejoin="round"/>
    <path d="M72 129c14-29 40-17 53 12 18 40 26 79 48 108M528 129c-14-29-40-17-53 12-18 40-26 79-48 108" fill="none" stroke="#e8ddec" strokeWidth="13" strokeLinecap="round" opacity=".55"/>
    <path d="M86 290c25 25 44 27 65 13M514 290c-25 25-44 27-65 13" fill="none" stroke="#d9cbe1" strokeWidth="8" strokeLinecap="round" opacity=".7"/>
   </g>
   <g filter="url(#kuru-shadow)">
    <path d="M162 467c-30-43-35-117-15-189 20-72 71-110 153-112 82 2 133 40 153 112 20 72 15 146-15 189-28 40-248 40-276 0Z" fill="url(#kuru-body)" stroke="#a58c70" strokeWidth="7" strokeLinejoin="round"/>
    <path d="M214 450c-14 18-21 35-6 45 17 10 38-1 43-17M386 450c14 18 21 35 6 45-17 10-38-1-43-17" fill="#f7e8d0" stroke="#a58c70" strokeWidth="6" strokeLinecap="round"/>
    <path d="M274 148c5-16 15-23 26-22 11-1 21 6 26 22M263 177c-11-17-11-34 7-42" fill="none" stroke="#a58c70" strokeWidth="7" strokeLinecap="round"/>
   </g>
   <g className="kuru-face">
    <ellipse cx="214" cy="322" rx="27" ry="15" fill="#e6a4a0" opacity=".46"/><ellipse cx="386" cy="322" rx="27" ry="15" fill="#e6a4a0" opacity=".46"/>
    <path d="M219 256q26-20 47-3M334 253q21-20 47 3" fill="none" stroke="#745a4d" strokeWidth="12" strokeLinecap="round"/>
    <path d={mood === "curious" ? "M224 287q20-20 40-1M336 286q20-20 40 1" : "M224 286q20 12 40 0M336 286q20 12 40 0"} fill="none" stroke="#594b45" strokeWidth="8" strokeLinecap="round"/>
    <path d="M270 303c6-17 54-17 60 0 6 19-8 37-30 41-22-4-36-22-30-41Z" fill="#f3d4b8" stroke="#a58c70" strokeWidth="6"/>
    <ellipse cx="287" cy="307" rx="5" ry="4" fill="#745a4d"/><ellipse cx="313" cy="307" rx="5" ry="4" fill="#745a4d"/>
    <path d={mood === "cozy" ? "M289 354q11 10 22 0" : "M292 354q8 5 16 0"} fill="none" stroke="#9b6d5e" strokeWidth="5" strokeLinecap="round"/>
    <path d="M300 205c-19-12-17-33 0-42 17 9 19 30 0 42Z" fill="url(#kuru-gold)" stroke="#bd873b" strokeWidth="3"/>
    <path d="M303 170c10 8 8 20-1 27 13-1 23-12 19-23-3-10-11-13-18-4Z" fill="#fff5d5"/>
   </g>
   <g className="kuru-badge" transform="rotate(-8 460 202)">
    <path d="M453 148v21" stroke="#806b8f" strokeWidth="6" strokeLinecap="round"/><circle cx="453" cy="146" r="8" fill="#d7b46a" stroke="#806b8f" strokeWidth="4"/>
    <rect x="424" y="166" width="60" height="77" rx="9" fill="#f8edcf" stroke="#a58c70" strokeWidth="5"/>
    <path d="M444 187c-4-9 9-13 14-5 5-8 18-3 12 7-5 8-13 13-13 13s-8-6-13-15Z" fill="url(#kuru-gold)"/>
    <path d="M440 216h28M445 228h18" stroke="#9c8167" strokeWidth="4" strokeLinecap="round"/>
   </g>
   <g className="kuru-sparkles" fill="#d6a44d"><path d="m118 180 5 14 14 5-14 5-5 14-5-14-14-5 14-5Z" opacity=".85"/><path d="m486 359 4 11 11 4-11 4-4 11-4-11-11-4 11-4Z" opacity=".72"/><circle cx="157" cy="418" r="5" opacity=".65"/><circle cx="449" cy="116" r="4" opacity=".65"/></g>
  </svg>
 );
}
