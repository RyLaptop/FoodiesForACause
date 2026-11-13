// Officer portal. No Supabase accounts and no email: each officer has a private access code, checked inside the
// officer_data() database function (supabase-officers.sql). The publishable key is public by design.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const $ = id => document.getElementById(id);

const TABLES = {
  summary: {label: "Summary", cols: []},
  ftv_rsvps: {label: "Meal RSVPs", cols: ["created_at", "event_date", "name", "party_size", "contact", "note", "photo_release"]},
  // FTV volunteers are one table (signups_ftv) shown as three role tabs.
  ftv_cook: {label: "FTV cooks", src: "signups_ftv", role: "cook", cols: ["created_at", "event_date", "name", "phone", "email", "role", "attending", "needs_ride", "can_give_rides"]},
  ftv_handout: {label: "FTV handout", src: "signups_ftv", role: "handout", cols: ["created_at", "event_date", "name", "phone", "email", "role", "attending", "needs_ride", "can_give_rides"]},
  ftv_screener: {label: "FTV screeners", src: "signups_ftv", role: "screener", cols: ["created_at", "event_date", "name", "phone", "email", "role", "attending", "vitals_trained", "vitals_cert", "needs_ride", "can_give_rides"]},
  signups_service: {label: "Service sign-ups", cols: ["created_at", "event_date", "name", "phone", "email", "attending", "needs_ride", "can_give_rides"]},
  signups_social: {label: "Social sign-ups", cols: ["created_at", "event_date", "name", "phone", "email", "attending", "needs_ride", "can_give_rides"]},
  signups_fundraiser: {label: "Fundraiser sign-ups", cols: ["created_at", "event_date", "name", "phone", "email", "attending", "can_bake", "needs_ride", "can_give_rides"]},
  members: {label: "Members", cols: ["created_at", "name", "email", "phone", "uin", "class_year"]},
  contact_messages: {label: "Contact messages", cols: ["created_at", "name", "email", "message"]}
};
let current = "summary", rows = [], auth = null; // auth = {email, code}, kept in this tab only

// Rows from before roles existed (role is null) match by their old flags, same as the sign-up page counters.
const inRole = (r, role) => r.role ? r.role === role : !!({cook: r.can_cook, screener: r.associate_screener, handout: r.attending})[role];

function say(t, ok) { const m = $("msg"); m.textContent = t || ""; m.className = "form-msg " + (ok ? "ok" : "err"); }
function show(id) { for (const x of ["auth", "app"]) $(x).hidden = x !== id; }
function cell(c, v) {
  if (v === null || v === undefined) return "";
  if (c === "created_at") return new Date(v).toLocaleString("en-US", {timeZone: "America/Chicago"});
  if (typeof v === "boolean") return v ? "yes" : "no";
  return String(v);
}

async function fetchRows(table) {
  const r = await fetch(SB + "/rest/v1/rpc/officer_data", {
    method: "POST",
    headers: {apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json"},
    body: JSON.stringify({p_email: auth.email, p_code: auth.code, p_table: table})
  });
  if (r.ok) return {data: await r.json()};
  return {denied: r.status === 400 || r.status === 401 || r.status === 403, error: "Could not load (" + r.status + ")"};
}

function signOut() {
  auth = null; rows = [];
  try { sessionStorage.removeItem("ffac-officer"); } catch (e) {}
  $("code").value = "";
  show("auth");
}

function buildTabs() {
  $("tabs").innerHTML = "";
  for (const [k, t] of Object.entries(TABLES)) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn btn-solid" + (k === current ? " on" : ""); b.textContent = t.label;
    b.onclick = () => { current = k; $("q").value = ""; buildTabs(); load(); };
    $("tabs").appendChild(b);
  }
}

function setMode(summary) { $("tools").hidden = summary; $("wrap2").hidden = !summary; }

function fillTable(t, head, data) {
  t.innerHTML = "";
  const hr = t.createTHead().insertRow();
  for (const h of head) { const th = document.createElement("th"); th.textContent = h; hr.appendChild(th); }
  const body = t.createTBody();
  data.forEach((row, i) => {
    const tr = body.insertRow();
    row.forEach(v => { const td = tr.insertCell(); td.textContent = v; });
    if (row[0] === "Total") tr.style.fontWeight = "700";
  });
}

// Overview: counts per sign-up type and event, plus meal RSVPs per event.
async function loadSummary() {
  setMode(true);
  $("sum").textContent = "Loading...";
  const names = ["signups_ftv", "signups_service", "signups_social", "signups_fundraiser", "ftv_rsvps"];
  const res = await Promise.all(names.map(fetchRows));
  if (res.some(r => r.denied)) { signOut(); return say("Wrong email or password."); }
  const bad = res.find(r => r.error);
  if (bad) { $("sum").textContent = ""; return say(bad.error); }
  say("");
  const [ftv, service, social, fund, rsvps] = res.map(r => r.data);
  const n = (list, f) => list.filter(f).length;
  const kinds = [["FTV volunteers", ftv], ["Service", service], ["Social", social], ["Fundraiser", fund]];
  const tot = [0, 0, 0, 0, 0, 0, 0], out = [];
  for (const [label, list] of kinds) {
    for (const d of [...new Set(list.map(r => r.event_date || ""))].sort().reverse()) {
      const g = list.filter(r => (r.event_date || "") === d), isFtv = label === "FTV volunteers", isFund = label === "Fundraiser";
      const v = [g.length, n(g, r => r.attending), n(g, r => r.needs_ride), n(g, r => r.can_give_rides), n(g, r => r.can_cook), n(g, r => r.can_bake), n(g, r => r.associate_screener)];
      v.forEach((x, i) => tot[i] += x);
      out.push([label, d || "no date", v[0], v[1], v[2], v[3], isFtv ? v[4] : "-", isFund ? v[5] : "-", isFtv ? v[6] : "-"]);
    }
  }
  out.push(["Total", "", ...tot]);
  fillTable($("tbl"), ["Type", "Event date", "Signed up", "Will attend / volunteer", "Need rides", "Can give rides", "Can cook", "Can bake", "Associate screeners"], out);
  const rs = [];
  let rt = [0, 0, 0];
  for (const d of [...new Set(rsvps.map(r => r.event_date || ""))].sort().reverse()) {
    const g = rsvps.filter(r => (r.event_date || "") === d), meals = g.reduce((s, r) => s + (r.party_size || 0), 0);
    rs.push(["Meal RSVPs", d || "no date", g.length, meals, n(g, r => r.photo_release)]);
    rt = [rt[0] + g.length, rt[1] + meals, rt[2] + n(g, r => r.photo_release)];
  }
  rs.push(["Total", "", ...rt]);
  fillTable($("tbl2"), ["Type", "Event date", "RSVPs", "Meals reserved", "Photo release ok"], rs);
  $("sum").textContent = tot[0] + " volunteer sign-ups, " + tot[2] + " need rides, " + tot[6] + " can screen, " + rt[1] + " meals reserved";
}

async function load() {
  if (current === "summary") return loadSummary();
  setMode(false);
  $("sum").textContent = "Loading...";
  const t = TABLES[current], res = await fetchRows(t.src || current);
  if (res.denied) { signOut(); return say("Wrong email or password."); }
  if (res.error) { rows = []; $("sum").textContent = ""; say(res.error); render(); return; }
  say("");
  rows = t.role ? res.data.filter(r => inRole(r, t.role)).map(r => ({...r, role: t.role})) : res.data; // old rows have no role, show the tab's
  fillFilter("f-event", "event_date", "All events");
  fillFilter("f-form", "form", "All forms");
  render();
}

function fillFilter(id, col, allLabel) {
  const s = $(id), has = TABLES[current].cols.includes(col);
  s.hidden = !has;
  if (!has) return;
  const vals = [...new Set(rows.map(r => r[col]).filter(v => v !== null && v !== undefined))].sort().reverse();
  s.innerHTML = "";
  for (const v of ["", ...vals]) { const o = document.createElement("option"); o.value = v; o.textContent = v || allLabel; s.appendChild(o); }
}

function filtered() {
  const q = $("q").value.trim().toLowerCase(), ev = $("f-event").hidden ? "" : $("f-event").value, fm = $("f-form").hidden ? "" : $("f-form").value;
  return rows.filter(r => (!ev || r.event_date === ev) && (!fm || r.form === fm) &&
    (!q || TABLES[current].cols.some(c => cell(c, r[c]).toLowerCase().includes(q))));
}

function render() {
  const cols = TABLES[current].cols, list = filtered(), t = $("tbl");
  t.innerHTML = "";
  const head = t.createTHead().insertRow();
  for (const c of cols) { const th = document.createElement("th"); th.textContent = c.replace(/_/g, " "); head.appendChild(th); }
  const body = t.createTBody();
  for (const r of list) {
    const tr = body.insertRow();
    for (const c of cols) { const td = tr.insertCell(); td.textContent = cell(c, r[c]); if (c === "note" || c === "message") td.className = "wrap"; }
  }
  let s = list.length + " row" + (list.length === 1 ? "" : "s");
  if (current === "ftv_rsvps") s += ", " + list.reduce((n, r) => n + (r.party_size || 0), 0) + " meals";
  $("sum").textContent = s;
}

function csv() {
  const cols = TABLES[current].cols;
  const esc = v => { let s = cell("", v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return '"' + s.replace(/"/g, '""') + '"'; };
  const lines = [cols.join(",")].concat(filtered().map(r => cols.map(c => esc(c === "created_at" ? cell(c, r[c]) : r[c])).join(",")));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([lines.join("\n")], {type: "text/csv"}));
  a.download = current + "-" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

async function enter(email, code) {
  auth = {email, code};
  const res = await fetchRows("ftv_rsvps"); // credential check
  if (res.denied) { auth = null; return say("Wrong email or password."); }
  if (res.error) { auth = null; return say(res.error); }
  try { sessionStorage.setItem("ffac-officer", JSON.stringify(auth)); } catch (e) {}
  $("who").textContent = email;
  say("");
  show("app");
  buildTabs();
  load();
}

$("af").addEventListener("submit", e => {
  e.preventDefault();
  const email = $("em").value.trim(), code = $("code").value.trim();
  if (!email || !code) return say("Enter your email and password.");
  enter(email, code);
});
document.querySelectorAll("[data-signout]").forEach(b => b.onclick = signOut);
$("refresh").onclick = load;
$("csv").onclick = csv;
for (const id of ["q", "f-event", "f-form"]) $(id).addEventListener("input", render);

try {
  const saved = JSON.parse(sessionStorage.getItem("ffac-officer") || "null");
  if (saved && saved.email && saved.code) enter(saved.email, saved.code); else show("auth");
} catch (e) { show("auth"); }
