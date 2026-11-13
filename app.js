/* DIEL_ARY — offline dielectric materials reference */
const $ = s => document.querySelector(s);
const NR = v => (v === null || v === undefined || v === "") ? '<span class="nr">Not reported</span>' : v;
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = {
  g(k, d) { try { const v = localStorage.getItem('diel_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  s(k, v) { try { localStorage.setItem('diel_' + k, JSON.stringify(v)); } catch (e) {} }
};

const COLORS = {
  "Polymers": "#6C4DE6",
  "Crystals": "#3F83F8",
  "Minerals": "#8C6239",
  "Ceramics/Insulators": "#D85C8A",
  "Liquids": "#17B8A6",
  "Gases": "#E99A22"
};
const SHORT = {
  "Polymers": "Polymer",
  "Crystals": "Crystal",
  "Minerals": "Mineral",
  "Ceramics/Insulators": "Ceramic",
  "Liquids": "Liquid",
  "Gases": "Gas"
};
const BADGE_INK = {
  "Polymers": "#4B2FC9",
  "Crystals": "#1D5FBF",
  "Minerals": "#5E401F",
  "Ceramics/Insulators": "#A62B58",
  "Liquids": "#0B6C64",
  "Gases": "#8A5A0A"
};

let st = { tab:'home', cat:'All', q:'', sort:'name', cmp:[1,19], mat:null };
let settingsReturnState = null;
let settingsReturnScroll = 0;
const savedFs = store.g('fs', 16);
let currentTheme = store.g('theme', 'light') === 'dark' ? 'dark' : 'light';
document.documentElement.style.fontSize = savedFs + 'px';
document.documentElement.dataset.theme = currentTheme;
try { localStorage.removeItem('diel_done'); } catch (e) {}

const mat = id => M.find(x => x.id == id);
const ref = id => REFS.find(x => x.id == id);

function num(v) {
  if (v === null || v === undefined) return Infinity;
  let s = String(v).replace(/−/g, '-').replace(/,/g, '');
  const sup = {'⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9'};
  s = s.replace(/(\d+(?:\.\d+)?)\s*[×x]\s*10([⁻⁺]?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/gi, (m, base, sign, digits) => {
    const exp = [...digits].map(d => sup[d]).join('');
    return String(parseFloat(base) * Math.pow(10, (sign === '⁻' ? -1 : 1) * Number(exp)));
  });
  s = s.replace(/10([⁻⁺]?)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (m, sign, digits) => {
    const exp = [...digits].map(d => sup[d]).join('');
    return '1e' + (sign === '⁻' ? '-' : '') + exp;
  });
  const m = s.match(/-?\d*\.?\d+(?:e[+-]?\d+)?/i);
  return m ? parseFloat(m[0]) : Infinity;
}

const CAT_ART = {
  "Polymers": '<path d="M13 37l8-16 8 16 8-16 8 16" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><g fill="#fff"><circle cx="13" cy="37" r="3"/><circle cx="21" cy="21" r="3"/><circle cx="29" cy="37" r="3"/><circle cx="37" cy="21" r="3"/><circle cx="45" cy="37" r="3"/></g>',
  "Crystals": '<path d="M28 8l16 11v20L28 50 12 39V19z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><path d="M28 8v42M12 19l16 9 16-9" fill="none" stroke="#fff" stroke-width="1.7" opacity=".8"/>',
  "Minerals": '<path d="M12 19l16-8 16 8-16 8z" fill="#fff" opacity=".95"/><path d="M12 29l16-8 16 8-16 8z" fill="#fff" opacity=".72"/><path d="M12 39l16-8 16 8-16 8z" fill="#fff" opacity=".5"/>',
  "Ceramics/Insulators": '<rect x="13" y="14" width="30" height="7" rx="3.5" fill="#fff" opacity=".95"/><rect x="13" y="25" width="30" height="7" rx="3.5" fill="#fff" opacity=".75"/><rect x="13" y="36" width="30" height="7" rx="3.5" fill="#fff" opacity=".55"/>',
  "Liquids": '<path d="M28 9s-12 14-12 22a12 12 0 0 0 24 0c0-8-12-22-12-22z" fill="#fff" opacity=".92"/><circle cx="23" cy="32" r="2.2" fill="#0B6C64"/><circle cx="33" cy="35" r="1.6" fill="#0B6C64"/>',
  "Gases": '<rect x="10" y="12" width="36" height="33" rx="11" fill="none" stroke="#fff" stroke-width="2.2"/><g fill="#fff"><circle cx="22" cy="25" r="3"/><circle cx="34" cy="20" r="2.2" opacity=".8"/><circle cx="36" cy="34" r="3.4" opacity=".9"/><circle cx="23" cy="37" r="2" opacity=".7"/></g>'
};

function catIcon(c, cls) {
  const color = COLORS[c] || '#6C4DE6';
  return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 56 56" aria-hidden="true"><rect width="56" height="56" rx="16" fill="' + color + '"/><g>' + (CAT_ART[c] || '') + '</g></svg>';
}

const NAV = [
  { id:'home', label:'Home', icon:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>' },
  { id:'explore', label:'Explore', icon:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.6-4.6"/>' },
  { id:'compare', label:'Compare', icon:'<path d="M7 4v16M17 4v16M3 8l4-4 4 4M13 16l4 4 4-4"/>' }
];

function nav() {
  $('#nav').innerHTML = NAV.map(n =>
    '<button class="' + (st.tab === n.id ? 'on' : '') + '" onclick="go(\'' + n.id + '\')" aria-current="' + (st.tab === n.id ? 'page' : 'false') + '"><svg viewBox="0 0 24 24">' + n.icon + '</svg><span>' + n.label + '</span></button>'
  ).join('');
}

function go(t) {
  if (st.tab === 'about') settingsReturnState = null;
  st.tab = t; st.mat = null; render(); scrollTo(0, 0);
}

function toggleSettings() {
  if (st.tab === 'about' && settingsReturnState) {
    st = settingsReturnState;
    settingsReturnState = null;
    render();
    scrollTo(0, settingsReturnScroll);
    return;
  }
  settingsReturnState = Object.assign({}, st, { cmp:st.cmp.slice() });
  settingsReturnScroll = window.scrollY;
  st.tab = 'about';
  st.mat = null;
  render();
  scrollTo(0, 0);
}

function updateThemeControls() {
  const dark = currentTheme === 'dark';
  const toggle = $('#themeToggle');
  if (toggle) {
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    toggle.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/></svg>';
  }
  document.querySelectorAll('[data-theme-choice]').forEach(button => {
    const selected = button.dataset.themeChoice === currentTheme;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

function setTheme(theme) {
  currentTheme = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = currentTheme;
  store.s('theme', currentTheme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = currentTheme === 'dark' ? '#171522' : '#6C4DE6';
  updateThemeControls();
}

function toggleTheme() {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function openCategory(c) {
  st.cat = c; st.mat = null; st.tab = 'explore'; render(); scrollTo(0, 0);
}

function openMat(id) {
  st.mat = id; st.tab = 'explore'; render(); scrollTo(0, 0);
}

function backToExplore() {
  st.mat = null; render(); scrollTo(0, 0);
}

function scrollToTopic(n) {
  openTopic(n - 1);
}

function openTopic(i) {
  const t = TOPICS[i];
  if (!t) return;
  const dialog = $('#topicDialog');
  $('#topicDialogContent').innerHTML = '<div class="topic-dialog-head"><span class="topic-kicker">Fundamental ' + String(i + 1).padStart(2, '0') + '</span>' +
    '<button class="topic-dialog-close" onclick="closeTopic()" aria-label="Close fundamental details"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    topicContent(t, i) +
    '<div class="topic-dialog-nav">' +
      (i > 0 ? '<button class="btn ghost" onclick="openTopic(' + (i - 1) + ')">← Previous</button>' : '<span></span>') +
      (i < TOPICS.length - 1
        ? '<button class="btn" onclick="openTopic(' + (i + 1) + ')">Next →</button>'
        : '<button class="btn" onclick="finishTopics()">Finish</button>') +
    '</div>';
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

function closeTopic() {
  $('#topicDialog').close();
}

function finishTopics() {
  closeTopic();
  const section = $('#materials-section');
  if (section) section.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* ---------- shared pieces ---------- */
function badge(m) {
  const color = COLORS[m.c] || '#6C4DE6';
  const ink = BADGE_INK[m.c] || '#4B2FC9';
  return '<span class="badge" style="color:' + ink + ';background:' + color + '18">' + esc(SHORT[m.c] || m.c) + '</span>';
}

function card(m) {
  const x = m.m[0];
  return '<button class="mat-card" onclick="openMat(' + m.id + ')">' + catIcon(m.c) +
    '<span class="mat-info"><span class="mat-top"><b>' + esc(m.n) + '</b>' + badge(m) + '</span>' +
    '<span class="mat-tag">' + esc(m.tagline) + '</span>' +
    '<span class="mini-stats"><span>εr <b>' + esc(x.er) + '</b></span><span>Dielectric loss <b>' + esc(x.tan) + '</b></span></span></span></button>';
}

function tableHTML(tbl) {
  return '<div class="table-wrap"><table class="data-table"><thead><tr>' + tbl.head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
    tbl.rows.map(row => '<tr>' + row.map((cell, i) => '<td' + (i === 0 ? ' class="rowhead"' : '') + '>' + cell + '</td>').join('') + '</tr>').join('') +
    '</tbody></table></div>';
}

function refCard(r) {
  return '<div class="ref-card"><b>' + esc(r.t) + '</b><div class="sub">' + esc(r.a) + (r.ed ? ', ' + esc(r.ed) : '') + ' (' + r.y + '). ' + esc(r.pub) + '.' + (r.isbn ? ' ISBN ' + esc(r.isbn) + '.' : '') + '</div>' +
    (r.u ? '<a href="' + esc(r.u) + '" target="_blank" rel="noopener">' + esc(r.u) + '</a>' : '') +
    '<div class="ref-support">Supports: ' + esc(r.s) + '</div></div>';
}

/* ---------- home ---------- */
function topicContent(t, i) {
  return '<article class="topic-detail">' +
    '<div class="topic-media"><img src="' + t.img + '" alt="' + esc(t.alt) + '" loading="lazy"></div>' +
    '<div class="topic-body">' +
      '<h3 id="topicDialogTitle">' + esc(t.t) + '</h3>' +
      '<p class="topic-sub">' + esc(t.sub) + '</p>' +
      t.body.map(p => '<p>' + esc(p) + '</p>').join('') +
      '<div class="eq">' + t.eq + '</div>' +
      '<div class="eq-note">' + t.eqNote + '</div>' +
      '<div class="keypoints"><h4>Key points</h4><ul>' + t.points.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul></div>' +
      (t.table ? tableHTML(t.table) : '') +
      '<p class="caption">' + esc(t.cap) + '</p>' +
    '</div></article>';
}

function topicCard(t, i) {
  return '<article class="topic"><button class="topic-trigger" onclick="openTopic(' + i + ')" aria-haspopup="dialog" aria-label="Open ' + esc(t.t) + '">' +
    '<span>' + esc(t.t) + '</span><svg class="topic-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>' +
    '</button></article>';
}

function catTile(c) {
  const n = M.filter(m => m.c === c).length;
  return '<button class="cat-tile" onclick="openCategory(\'' + c + '\')">' + catIcon(c, 'cat-ico') +
    '<span class="cat-text"><b>' + c + '</b><span>' + n + ' material' + (n === 1 ? '' : 's') + '</span></span>' +
    '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>';
}

function miniSelect(i) {
  return '<label class="mini-select"><span>Material ' + (i + 1) + '</span><select onchange="setCmpHome(' + i + ',this.value)">' +
    M.map(m => '<option value="' + m.id + '"' + (m.id == st.cmp[i] ? ' selected' : '') + '>' + esc(m.n) + '</option>').join('') +
    '</select></label>';
}

function miniCompareHTML(a, b) {
  if (!a || !b) return '';
  const cell = m => '<div class="mini-mat" style="--cat:' + (COLORS[m.c] || '#6C4DE6') + '">' + badge(m) +
    '<b>' + esc(m.n) + '</b><div class="mini-values"><span>εr <b>' + esc(m.m[0].er) + '</b></span><span>Dielectric loss <b>' + esc(m.m[0].tan) + '</b></span><span>E<sub>b</sub> <b>' + esc(m.bd) + '</b></span></div></div>';
  return '<div class="mini-compare-body">' + cell(a) + '<div class="vs">vs</div>' + cell(b) + '</div>' +
    '<div class="mini-actions"><button class="btn ghost small" onclick="go(\'compare\')">Open full comparison</button></div>';
}

function home() {
  const featured = [6, 10, 19].map(mat).filter(Boolean);
  return '<section class="hero">' +
      '<div class="hero-copy">' +
      '<h1>See what holds a charge.</h1>' +
      '<p>Explore ' + M.length + ' dielectric materials, compare their electrical properties, and understand the physics that makes an insulator store energy.</p>' +
      '<div class="hero-actions"><button class="btn" onclick="go(\'explore\')">Explore materials</button><button class="btn ghost-light" onclick="scrollToTopic(1)">Start with the basics</button></div></div>' +
      '<img class="hero-img" src="hero-dielectric.svg" alt="A glowing dielectric slab between two capacitor plates">' +
    '</section>' +
    '<div class="stats">' +
      '<div class="stat"><b>' + M.length + '</b><span>Materials</span></div>' +
      '<div class="stat"><b>' + CATS.length + '</b><span>Categories</span></div>' +
      '<div class="stat"><b>7</b><span>Fundamentals</span></div>' +
    '</div>' +
    '<section class="section-head"><div><h2>Dielectric fundamentals</h2><p>Select a heading or arrow to open its details.</p></div><span class="pill">7 topics</span></section>' +
    TOPICS.map(topicCard).join('') +
    '<section class="section-head" id="materials-section"><div><h2>Explore materials</h2><p>Browse by category or open the full library.</p></div><button class="link-btn" onclick="go(\'explore\')">View all →</button></section>' +
    '<div class="cat-grid">' + CATS.map(catTile).join('') + '</div>' +
    '<h3 class="subhead">Featured materials</h3><div class="mat-grid">' + featured.map(card).join('') + '</div>' +
    '<div class="center"><button class="btn" onclick="go(\'explore\')">Browse all ' + M.length + ' materials</button></div>' +
    '<section class="section-head"><div><h2>Compare materials</h2><p>Two materials, one table, with the conditions kept visible.</p></div><button class="link-btn" onclick="go(\'compare\')">Full comparison →</button></section>' +
    '<div class="card compare-mini"><div class="mini-selects">' + miniSelect(0) + miniSelect(1) + '</div><div id="miniCompare">' + miniCompareHTML(mat(st.cmp[0]), mat(st.cmp[1])) + '</div></div>';
}

/* ---------- explore ---------- */
function filtered() {
  const q = st.q.trim().toLowerCase();
  let l = M.filter(m => (st.cat === 'All' || m.c === st.cat) &&
    (m.n + ' ' + m.c + ' ' + m.tagline + ' ' + m.ap + ' ' + m.d).toLowerCase().includes(q));
  if (st.sort === 'name') l.sort((a, b) => a.n.localeCompare(b.n));
  else if (st.sort === 'cat') l.sort((a, b) => a.c.localeCompare(b.c) || a.n.localeCompare(b.n));
  else if (st.sort === 'er') l.sort((a, b) => num(a.m[0].er) - num(b.m[0].er));
  else if (st.sort === 'erd') l.sort((a, b) => num(b.m[0].er) - num(a.m[0].er));
  else if (st.sort === 'loss') l.sort((a, b) => num(a.m[0].tan) - num(b.m[0].tan));
  return l;
}

function updateList() {
  const l = filtered();
  const lst = $('#lst');
  if (lst) lst.innerHTML = l.length ? l.map(card).join('') : '<div class="card empty">No materials match. Clear the search or choose another category.</div>';
  const count = $('#resultCount');
  if (count) count.textContent = l.length + (l.length === 1 ? ' material' : ' materials');
}

function setCat(c) {
  st.cat = c;
  document.querySelectorAll('#catChips .chip').forEach(el => el.classList.toggle('on', el.dataset.cat === c));
  updateList();
}

function explore() {
  if (st.mat) return detail(mat(st.mat));
  const cats = ['All'].concat(CATS.filter(c => M.some(m => m.c === c)));
  const l = filtered();
  return '<div class="page-head"><div><h2>Explore materials</h2><p>Browse ' + M.length + ' dielectrics by category, search by name or application, and open a full data sheet.</p></div><span class="pill">' + M.length + '</span></div>' +
    '<div class="search-box"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.6-4.6"/></svg><input id="q" type="search" placeholder="Search name, category or application" aria-label="Search materials" value="' + esc(st.q) + '" oninput="st.q=this.value;updateList()"></div>' +
    '<div class="chips" id="catChips">' + cats.map(c => '<button class="chip ' + (st.cat === c ? 'on' : '') + '" data-cat="' + c + '" onclick="setCat(\'' + c + '\')">' + c + '</button>').join('') + '</div>' +
    '<div class="list-tools"><span class="sub" id="resultCount">' + l.length + (l.length === 1 ? ' material' : ' materials') + '</span><select id="sort" aria-label="Sort materials" onchange="st.sort=this.value;updateList()">' +
      '<option value="name"' + (st.sort === 'name' ? ' selected' : '') + '>Name A–Z</option>' +
      '<option value="cat"' + (st.sort === 'cat' ? ' selected' : '') + '>Category</option>' +
      '<option value="er"' + (st.sort === 'er' ? ' selected' : '') + '>εr: low to high</option>' +
      '<option value="erd"' + (st.sort === 'erd' ? ' selected' : '') + '>εr: high to low</option>' +
      '<option value="loss"' + (st.sort === 'loss' ? ' selected' : '') + '>Lowest loss first</option>' +
    '</select></div>' +
    '<div id="lst" class="mat-grid">' + (l.length ? l.map(card).join('') : '<div class="card empty">No materials match. Clear the search or choose another category.</div>') + '</div>';
}

function qstat(label, value, note) {
  return '<div class="qstat"><span>' + esc(label) + '</span><b>' + esc(value) + '</b>' + (note ? '<small>' + esc(note) + '</small>' : '') + '</div>';
}

function detail(m) {
  if (!m) return '<div class="card">Material not found.</div>';
  const color = COLORS[m.c] || '#6C4DE6';
  const x = m.m[0];
  const rows = m.m.map(r => '<tr><td class="rowhead">' + esc(r.l) + (r.note ? '<small>' + esc(r.note) + '</small>' : '') + '</td><td class="er">' + esc(r.er) + '</td><td>' + esc(r.tan) + '</td><td>' + esc(r.f) + '</td><td>' + esc(r.t) + '</td><td>' + esc(r.p) + '</td></tr>').join('');
  return '<button class="back" onclick="backToExplore()">‹ All materials</button>' +
    '<div class="detail-hero" style="background:linear-gradient(135deg,' + color + ',#241B5E)">' + catIcon(m.c, 'detail-ico') +
      '<div class="detail-title"><span class="badge on-dark">' + esc(m.c) + '</span><h2>' + esc(m.n) + '</h2><p>' + esc(m.tagline) + '</p></div></div>' +
    '<div class="card"><h3>Overview</h3><p class="lead">' + esc(m.d) + '</p></div>' +
    '<div class="quick-grid">' +
      qstat('Relative permittivity (εr)', x.er, x.f + ' · ' + x.t) +
      qstat('Dielectric loss (tan δ)', x.tan, x.f + ' · ' + x.t) +
      qstat('Dielectric strength', m.bd, 'short-time; thickness dependent') +
      qstat('Volume resistivity', m.rho, 'room temperature') +
      qstat('Max service temperature', m.tmax, 'continuous / grade dependent') +
      qstat('Density', m.dens, 'typical') +
    '</div>' +
    '<div class="card"><h3>Dielectric behaviour</h3><p>' + esc(m.b) + '</p><div class="tagrow"><span class="tag">' + esc(m.polar) + '</span><span class="tag teal">' + esc(m.pol) + '</span></div></div>' +
    '<h3>Typical measured values</h3><div class="table-wrap"><table class="data-table"><thead><tr><th>Condition</th><th>εr</th><th>Dielectric loss (tan δ)</th><th>Frequency</th><th>Temperature</th><th>Pressure</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="table-note">Every record includes its conditions. Ranges show grade-to-grade or sample-to-sample variation; they are not measurement uncertainty.</p>' +
    '<div class="card"><h3>Material details</h3><table class="kv">' +
      '<tr><th>Composition</th><td>' + esc(m.comp) + '</td></tr>' +
      '<tr><th>Measurement basis</th><td>' + esc(m.me) + '</td></tr>' +
      '<tr><th>Polarization</th><td>' + esc(m.pol) + ' · ' + esc(m.polar) + '</td></tr>' +
      '<tr><th>Water absorption</th><td>' + esc(m.wa) + '</td></tr>' +
      '<tr><th>Breakdown strength</th><td>' + esc(m.bd) + '</td></tr>' +
      '<tr><th>Volume resistivity</th><td>' + esc(m.rho) + '</td></tr>' +
    '</table></div>' +
    '<div class="card two-col"><div><h4>Advantages</h4><ul class="ticks">' + m.adv.map(a => '<li>' + esc(a) + '</li>').join('') + '</ul></div><div><h4>Limitations</h4><ul class="crosses">' + m.lim.map(a => '<li>' + esc(a) + '</li>').join('') + '</ul></div></div>' +
    '<div class="card"><h3>Applications</h3><p>' + esc(m.ap) + '</p></div>' +
    '<h3>References</h3>' + m.r.map(id => { const r = ref(id); return r ? refCard(r) : ''; }).join('') +
    '<h3>Related materials</h3><div class="related-grid">' + (m.rel || []).map(id => mat(id)).filter(Boolean).map(r => '<button class="related" onclick="openMat(' + r.id + ')">' + catIcon(r.c, 'tiny') + '<span>' + esc(r.n) + '</span></button>').join('') + '</div>';
}

/* ---------- compare ---------- */
function compareSelect(i) {
  return '<label class="compare-select"><span>Material ' + (i + 1) + '</span><select onchange="setCmp(' + i + ',this.value)">' +
    M.map(m => '<option value="' + m.id + '"' + (m.id == st.cmp[i] ? ' selected' : '') + '>' + esc(m.n) + '</option>').join('') +
    '</select></label>';
}

function setCmp(i, val) {
  st.cmp[i] = +val; render();
}

function setCmpHome(i, val) {
  st.cmp[i] = +val; refreshMiniCompare();
}

function refreshMiniCompare() {
  const el = $('#miniCompare');
  if (el) el.innerHTML = miniCompareHTML(mat(st.cmp[0]), mat(st.cmp[1]));
}

function swapCmp() {
  st.cmp = [st.cmp[1], st.cmp[0]]; render();
}

function compareBars(a, b) {
  const va = Math.max(1.000001, num(a.m[0].er));
  const vb = Math.max(1.000001, num(b.m[0].er));
  const lm = Math.log10(Math.max(va, vb));
  const pct = v => Math.max(6, Math.round((Math.log10(v) / (lm || 1)) * 100));
  const row = (m, v) => '<div class="bar-row"><div class="bar-label">' + esc(m.n) + '</div><div class="bar-track"><i style="width:' + pct(v) + '%;background:' + (COLORS[m.c] || '#6C4DE6') + '"></i></div><b>' + esc(m.m[0].er) + '</b></div>';
  return '<div class="bar-head"><h3>Relative permittivity</h3><span class="pill">log scale</span></div>' + row(a, va) + row(b, vb) +
    '<p class="sub tiny">A log scale keeps gases near 1 and high-permittivity materials on one readable chart.</p>';
}

function verdict(a, b) {
  if (a.id === b.id) return '<p>Choose two different materials to see a comparison.</p>';
  const va = Math.max(1.000001, num(a.m[0].er)), vb = Math.max(1.000001, num(b.m[0].er));
  const high = va >= vb ? a : b, low = va >= vb ? b : a;
  const la = num(a.m[0].tan), lb = num(b.m[0].tan);
  const lowLoss = la <= lb ? a : b;
  const highBd = num(a.bd) >= num(b.bd) ? a : b;
  return '<p><b>' + esc(high.n) + '</b> has the higher quoted εr (' + esc(high.m[0].er) + ' vs ' + esc(low.m[0].er) + '), so it stores more charge per volt for the same geometry. <b>' + esc(lowLoss.n) + '</b> has the lower quoted dielectric loss, which matters for AC and RF heating. <b>' + esc(highBd.n) + '</b> has the higher quoted dielectric strength, which matters for high-voltage use.</p>' +
    '<p class="sub">These are separate trade-offs, not one overall score. The best choice depends on frequency, temperature, voltage, size, cost and lifetime.</p>';
}

function compare() {
  const a = mat(st.cmp[0]) || M[0], b = mat(st.cmp[1]) || M[1];
  if (!a || !b) return '<div class="card">Choose two materials.</div>';
  const x = a.m[0], y = b.m[0];
  const r = (label, f) => '<tr><td class="rowhead">' + label + '</td><td>' + f(a, x) + '</td><td>' + f(b, y) + '</td></tr>';
  return '<div class="page-head"><div><h2>Compare materials</h2><p>Put two dielectrics side by side. Check the conditions before deciding one is better.</p></div><span class="pill">' + M.length + ' available</span></div>' +
    '<div class="card compare-controls"><div class="compare-selects">' + compareSelect(0) + '<button class="swap" onclick="swapCmp()" aria-label="Swap materials">⇄</button>' + compareSelect(1) + '</div></div>' +
    '<div class="card compare-bars">' + compareBars(a, b) + '</div>' +
    '<div class="table-wrap"><table class="data-table compare-table"><thead><tr><th></th><th>' + esc(a.n) + '</th><th>' + esc(b.n) + '</th></tr></thead><tbody>' +
      r('Relative permittivity εr', (m, z) => '<b class="er">' + esc(z.er) + '</b>') +
      r('Dielectric loss (tan δ)', (m, z) => esc(z.tan)) +
      r('Dielectric strength', m => esc(m.bd)) +
      r('Volume resistivity', m => esc(m.rho)) +
      r('Max service temperature', m => esc(m.tmax)) +
      r('Density', m => esc(m.dens)) +
      r('Water absorption', m => esc(m.wa)) +
      r('Polarization', m => esc(m.pol) + '<br><span class="sub">' + esc(m.polar) + '</span>') +
      r('Measurement condition', (m, z) => esc(z.f) + '<br><span class="sub">' + esc(z.t) + ' · ' + esc(z.p) + '</span>') +
      r('Category', m => esc(m.c).replace(/\//g, '/<wbr>')) +
      r('Typical applications', m => esc(m.ap)) +
    '</tbody></table></div>' +
    '<div class="card"><h3>Quick verdict</h3>' + verdict(a, b) + '</div>';
}

/* ---------- about ---------- */
function fsz(d) {
  const cur = store.g('fs', 16);
  const v = d === 0 ? 16 : Math.min(22, Math.max(14, cur + d));
  store.s('fs', v);
  document.documentElement.style.fontSize = v + 'px';
  const label = $('#fsValue');
  if (label) label.textContent = Math.round(v / 16 * 100) + '%';
  const size = $('#fsPixels');
  if (size) size.textContent = v + ' px';
}

function resetPrefs() {
  store.s('fs', 16);
  document.documentElement.style.fontSize = '16px';
  setTheme('light');
  st = { tab:'home', cat:'All', q:'', sort:'name', cmp:[1,19], mat:null };
  settingsReturnState = null;
  try { localStorage.removeItem('diel_done'); } catch (e) {}
  render(); scrollTo(0, 0);
}

function about() {
  const fs = store.g('fs', 16);
  const pct = Math.round(fs / 16 * 100);
  const dark = currentTheme === 'dark';
  return '<div class="page-head"><div><h2>About DIEL_ARY</h2><p>A pocket reference for dielectric materials and their electrical properties.</p></div><span class="pill">v1.0</span></div>' +
    '<div class="card about-app"><img src="logo.svg" alt="DIEL_ARY logo"><div><h3>DIEL_ARY</h3><p class="sub">Dielectric materials, offline · ' + M.length + ' materials</p></div></div>' +
    '<div class="card"><h3>Project details</h3><table class="kv">' +
      '<tr><th>Application</th><td>DIEL_ARY</td></tr>' +
      '<tr><th>Project</th><td>Study of Dielectric Materials and Their Electrical Properties</td></tr>' +
      '<tr><th>Course</th><td>DPH-101 Physics</td></tr>' +
      '<tr><th>Institution</th><td>Harcourt Butler Technical University, Kanpur</td></tr>' +
      '<tr><th>Developer</th><td>Aryan</td></tr>' +
      '<tr><th>Version</th><td>1.0</td></tr>' +
    '</table></div>' +
    '<div class="card display-settings" id="display"><div class="settings-section-title"><span class="settings-icon theme-settings-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/></svg></span><div><h3>Appearance</h3><p class="sub">Choose a comfortable look for reading.</p></div></div>' +
      '<div class="theme-options" role="group" aria-label="Color theme">' +
        '<button class="theme-option ' + (!dark ? 'selected' : '') + '" data-theme-choice="light" aria-pressed="' + String(!dark) + '" onclick="setTheme(\'light\')"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg><span>Light</span></button>' +
        '<button class="theme-option ' + (dark ? 'selected' : '') + '" data-theme-choice="dark" aria-pressed="' + String(dark) + '" onclick="setTheme(\'dark\')"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z"/></svg><span>Dark</span></button>' +
      '</div>' +
      '<div class="text-size-setting"><div class="settings-section-title"><span class="settings-icon text-settings-icon">Aa</span><div><h3>Text size</h3><p class="sub">Adjust the text across the app.</p></div><b class="text-size-value" id="fsValue">' + pct + '%</b></div>' +
        '<div class="text-size-preview">Dielectric properties depend on frequency, temperature and moisture.</div>' +
        '<div class="font-controls"><button onclick="fsz(-1)" aria-label="Decrease text size">A−</button><span id="fsPixels">' + fs + ' px</span><button onclick="fsz(1)" aria-label="Increase text size">A+</button><button class="reset-fs" onclick="fsz(0)" aria-label="Reset text size">Reset</button></div>' +
      '</div>' +
      '<p class="settings-note">Your display preferences are saved on this device.</p>' +
    '</div>' +
    '<div class="card"><h3>How to read the data</h3><ul class="pts">' +
      '<li>εr and dielectric loss (tan δ) are quoted with frequency, temperature and pressure where available.</li>' +
      '<li>Ranges reflect grade-to-grade or sample-to-sample variation, not a single measured uncertainty.</li>' +
      '<li>Breakdown strength falls as thickness increases; thin films often show much higher values.</li>' +
      '<li>Volume resistivity is strongly affected by moisture, temperature and impurities.</li>' +
      '<li>Gases are described by permittivity and breakdown field; volume resistivity is not a bulk property of a gas.</li>' +
    '</ul></div>' +
    '<h3>References</h3>' + REFS.map(refCard).join('') +
    '<div class="card"><h3>Reset preferences</h3><p class="sub">Restore the default text size, clear the search, and return to the opening comparison.</p><button class="btn ghost" onclick="resetPrefs()">Reset preferences</button></div>';
}

function render() {
  nav();
  updateThemeControls();
  const view = $('#view');
  if (st.tab === 'explore') view.innerHTML = explore();
  else if (st.tab === 'compare') view.innerHTML = compare();
  else if (st.tab === 'about') view.innerHTML = about();
  else view.innerHTML = home();
}

render();
setTimeout(() => {
  const s = $('#splash');
  if (s) { s.style.opacity = 0; setTimeout(() => s.remove(), 500); }
}, 1600);
