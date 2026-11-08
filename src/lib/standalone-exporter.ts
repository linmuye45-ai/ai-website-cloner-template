import type { CoursePack, WhiteLabelConfig } from "@/types/platform";

export function buildPortableStandaloneHtml(
  brand: WhiteLabelConfig,
  courses: CoursePack[]
): string {
  const safeData = JSON.stringify({ brand, courses }).replace(
    /</g,
    "\\u003c"
  );

  return `<!DOCTYPE html>
<html lang="${brand.locale}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${brand.brandName} — Offline Curriculum & OEM Suite</title>
<style>
  :root {
    --bg: #faf9f6;
    --card: #ffffff;
    --muted-bg: #f2f0ec;
    --ink: #121519;
    --muted: #5b616b;
    --line: #e3e0d8;
    --brand: ${
      brand.theme === "royal"
        ? "#1e3a8a"
        : brand.theme === "crimson"
        ? "#881337"
        : brand.theme === "amber"
        ? "#78350f"
        : "#065f46"
    };
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { overflow-x: clip; background: var(--bg); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans", sans-serif; line-height: 1.6; }
  .wrap { max-width: 1240px; margin: 0 auto; padding: 28px 24px 56px; }
  header { background: var(--bg); border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 20; }
  .topbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; max-width: 1240px; margin: 0 auto; padding: 0 24px; min-height: 54px; }
  .tabs { display: flex; gap: 20px; flex-wrap: wrap; }
  .tab-btn { border: none; border-bottom: 2px solid transparent; background: transparent; padding: 16px 0; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--muted); }
  .tab-btn.active { color: var(--ink); border-bottom-color: var(--ink); }
  .sheet { background: var(--card); border: 1px solid var(--line); border-radius: 8px; margin-bottom: 24px; }
  .pad { padding: 24px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); border-top: 1px solid var(--line); }
  .cell { padding: 20px 24px; border-right: 1px solid var(--line); }
  .cell:last-child { border-right: none; }
  h1 { font-size: 30px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 10px; }
  h2 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-variant-numeric: tabular-nums; }
  .stat-num { font-size: 26px; font-weight: 600; color: var(--ink); margin-top: 4px; }
  .btn-primary { background: var(--brand); color: #fff; border: none; padding: 9px 16px; border-radius: 6px; font-weight: 500; cursor: pointer; font-size: 13px; }
  input[type="text"], select { width: 100%; padding: 9px 12px; border: 1px solid var(--line); border-radius: 6px; font-size: 13px; background: var(--card); color: var(--ink); }
  input[type="range"] { width: 100%; margin: 10px 0; accent-color: var(--brand); }
  .msg { padding: 12px 14px; border-radius: 8px; margin-bottom: 10px; font-size: 13px; white-space: pre-line; }
  .msg-ai { background: var(--bg); border: 1px solid var(--line); }
  .msg-user { background: var(--ink); color: #fff; margin-left: 14%; }
  .hidden { display: none; }
</style>
</head>
<body>
<header>
  <div class="topbar">
    <div>
      <strong id="brandTitle" style="font-size:15px;font-weight:600;"></strong>
      <span class="mono" style="margin-left:10px;font-size:11px;color:var(--muted);">Offline Standalone Build</span>
    </div>
    <nav class="tabs" aria-label="Offline views">
      <button class="tab-btn active" onclick="switchView('roi', this)">商业概览与测算</button>
      <button class="tab-btn" onclick="switchView('tutor', this)">教材伴读与导师</button>
      <button class="tab-btn" onclick="switchView('quiz', this)">三级变式卷与周报</button>
    </nav>
  </div>
</header>
<main class="wrap">
  <section id="view-roi">
    <div class="sheet">
      <div class="pad">
        <h1 id="heroTitle"></h1>
        <p id="heroSub" style="color:var(--muted);max-width:68ch;font-size:14px;"></p>
      </div>
      <div class="grid-3">
        <div class="cell"><div style="font-size:12px;color:var(--muted);">机构白标年费</div><div class="stat-num mono" id="orgPriceTxt"></div></div>
        <div class="cell"><div style="font-size:12px;color:var(--muted);">个人席位年费</div><div class="stat-num mono" id="stuPriceTxt"></div></div>
        <div class="cell"><div style="font-size:12px;color:var(--muted);">区域合伙人分润比例</div><div class="stat-num mono" id="splitTxt"></div></div>
      </div>
    </div>

    <div class="sheet grid-2">
      <div class="pad" style="border-right:1px solid var(--line);">
        <h2>机构首年净增营业利润测算</h2>
        <label style="font-size:13px;display:block;margin-top:12px;">当前在读学员规模：<strong class="mono" id="stuVal">120</strong></label>
        <input type="range" min="20" max="600" step="10" value="120" oninput="calcRoi(this.value)" />
        <p style="font-size:12px;color:var(--muted);">按释放 70% 重复批改工时及 30% 存量学员加购督学服务测算。</p>
      </div>
      <div class="pad" style="background:var(--muted-bg);">
        <div style="font-size:12px;color:var(--muted);">预计首年净增营业利润</div>
        <div class="stat-num mono" id="netGainTxt" style="font-size:32px;color:var(--brand);margin:6px 0;"></div>
        <div id="beTxt" style="font-size:12px;color:var(--muted);"></div>
      </div>
    </div>
  </section>

  <section id="view-tutor" class="hidden">
    <div class="sheet pad">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-bottom:16px;border-bottom:1px solid var(--line);margin-bottom:16px;">
        <h2>教材逐页引证伴读工作台</h2>
        <select id="courseSelect" style="width:auto;" onchange="renderCourse()"></select>
      </div>
      <div class="grid-2" style="gap:20px;">
        <div id="docList"></div>
        <div>
          <div id="chatBox" style="max-height:420px;overflow-y:auto;padding:12px;border:1px solid var(--line);border-radius:8px;margin-bottom:10px;background:var(--bg);"></div>
          <div style="display:flex;gap:8px;">
            <input type="text" id="chatInput" placeholder="输入疑难问题或提交作答内容…" onkeydown="if(event.key==='Enter')sendChat()" />
            <button class="btn-primary" onclick="sendChat()">发送</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="view-quiz" class="hidden">
    <div class="grid-2" style="gap:20px;">
      <div class="sheet pad">
        <h2>同考点三级变式训练卷</h2>
        <div id="quizBox" style="margin-top:12px;"></div>
      </div>
      <div class="sheet pad">
        <h2>家长端周度学情评估单</h2>
        <div id="reportBox" style="margin-top:12px;background:var(--bg);padding:16px;border-radius:8px;border:1px solid var(--line);font-size:13px;"></div>
      </div>
    </div>
  </section>
</main>
<script>
const DATA = ${safeData};
const b = DATA.brand;
document.getElementById('brandTitle').textContent = b.brandName;
document.getElementById('heroTitle').textContent = b.brandName + ' — ' + b.brandSubtitle;
document.getElementById('heroSub').textContent = '首席导师：' + b.tutorName + '（' + b.tutorRole + '） / 接入端：' + b.imChannelLabel;
document.getElementById('orgPriceTxt').textContent = b.currencySymbol + b.orgWhitelabelPrice.toLocaleString() + '/yr';
document.getElementById('stuPriceTxt').textContent = b.currencySymbol + b.studentAnnualPrice.toLocaleString() + '/yr';
document.getElementById('splitTxt').textContent = b.partnerSplitPercent + '%';

function calcRoi(n) {
  const stu = Number(n);
  document.getElementById('stuVal').textContent = stu;
  const saved = Math.round(2 * b.defaultTaMonthlyCost * 12 * 0.7);
  const upsell = Math.round(stu * 0.3) * b.defaultUpsellTicket;
  const gain = Math.max(0, saved + upsell - b.orgWhitelabelPrice);
  const be = Math.max(1, Math.ceil(b.orgWhitelabelPrice / b.defaultUpsellTicket));
  document.getElementById('netGainTxt').textContent = '+' + b.currencySymbol + gain.toLocaleString();
  document.getElementById('beTxt').textContent = '投资回收线：存量学员转化 ' + be + ' 名即可覆盖全年白标授权费。';
}
calcRoi(120);

function switchView(id, btn) {
  ['roi','tutor','quiz'].forEach(v => document.getElementById('view-' + v).classList.add('hidden'));
  document.getElementById('view-' + id).classList.remove('hidden');
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
}

const sel = document.getElementById('courseSelect');
DATA.courses.forEach((c, idx) => {
  const opt = document.createElement('option');
  opt.value = idx;
  opt.textContent = c.code + ' — ' + c.title;
  sel.appendChild(opt);
});

function renderCourse() {
  const c = DATA.courses[Number(sel.value)] || DATA.courses[0];
  document.getElementById('docList').innerHTML = c.sections.map(s =>
    '<div style="border-bottom:1px solid var(--line);padding:14px 0;">' +
    '<div class="mono" style="font-size:12px;font-weight:600;color:var(--brand);">P.' + s.pageNumber + ' ' + s.sectionCode + ' (' + s.examFrequency + ')</div>' +
    '<div style="font-weight:600;margin:4px 0;">' + s.title + '</div>' +
    '<div style="font-size:13px;color:var(--muted);">' + s.content + '</div>' +
    '<div class="mono" style="margin-top:8px;font-size:12px;color:var(--ink);">判据：' + s.keyFormulaOrRule + '</div>' +
    '</div>'
  ).join('');
  document.getElementById('chatBox').innerHTML = '<div class="msg msg-ai">你好，我是 ' + b.tutorName + '。已挂载《' + c.title + '》，每次解答均严格引证讲义页码。</div>';
  document.getElementById('quizBox').innerHTML = c.defaultVariants.map(q =>
    '<div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);">' +
    '<div class="mono" style="font-size:12px;font-weight:600;color:var(--brand);">' + q.tier + ' (P.' + q.sourcePage + ')</div>' +
    '<div style="font-weight:500;margin:6px 0;font-size:13px;">' + q.stem + '</div>' +
    q.options.map((op, oi) => '<div onclick="alert(this.dataset.msg)" data-msg="' + (oi===q.correctIndex ? '作答正确\\n' : '命中易错边界\\n') + q.rubricAndAnalysis.replace(/"/g,'&quot;') + '" style="padding:8px 10px;border:1px solid var(--line);border-radius:6px;margin-top:6px;cursor:pointer;font-size:12px;background:var(--bg);">' + String.fromCharCode(65+oi) + '. ' + op + '</div>').join('') +
    '</div>'
  ).join('');
  const p = c.studentProfile;
  document.getElementById('reportBox').innerHTML =
    '<strong>' + b.brandName + ' — 周度学情评估单</strong><br/>学员：' + p.studentName +
    '<br/>目标：' + p.targetGoal + '<br/>基线：' + p.baselineScore + ' / 当前预测：<strong>' + p.currentPredictedScore + '</strong>' +
    '<br/><br/><strong>L3 下阶段处方：</strong>' + p.l3SynthesisStrategy;
}
renderCourse();

function sendChat() {
  const inp = document.getElementById('chatInput');
  const q = inp.value.trim();
  if (!q) return;
  const c = DATA.courses[Number(sel.value)] || DATA.courses[0];
  const s = c.sections[0];
  const box = document.getElementById('chatBox');
  box.innerHTML += '<div class="msg msg-user">' + q.replace(/</g,'&lt;') + '</div>';
  box.innerHTML += '<div class="msg msg-ai"><strong>' + b.tutorName + ' [P.' + s.pageNumber + ' ' + s.sectionCode + ']：</strong>\\n1. 核心判据：' + s.keyFormulaOrRule + '\\n2. 常见失分边界：' + s.commonTrap + '\\n已写入本地 L1 学情记录（FSRS +3d 复查）。</div>';
  inp.value = '';
  box.scrollTop = box.scrollHeight;
}
</script>
</body>
</html>`;
}

export function triggerDownloadStandaloneHtml(
  brand: WhiteLabelConfig,
  courses: CoursePack[]
): void {
  if (typeof window === "undefined") return;
  const html = buildPortableStandaloneHtml(brand, courses);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `DeepScholar-Eternal-${brand.locale.toUpperCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
