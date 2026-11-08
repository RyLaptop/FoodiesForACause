// Officer portal. No Supabase accounts and no email: each officer has a private access code, checked inside the
// officer_data() database function (supabase-officers.sql). The publishable key is public by design.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const $ = id => document.getElementById(id);

const TABLES = {
  ftv_rsvps: {label: "Meal RSVPs", cols: ["created_at", "event_date", "name", "party_size", "contact", "note", "photo_release"]},
  event_signups: {label: "Volunteer sign-ups", cols: ["created_at", "form", "event_date", "name", "phone", "email", "attending", "needs_ride", "can_give_rides", "can_bake", "can_cook", "associate_screener"]},
  members: {label: "Members", cols: ["created_at", "name", "email", "phone", "uin", "class_year"]},
  contact_messages: {label: "Contact messages", cols: ["created_at", "name", "email", "message"]}
};
let current = "ftv_rsvps", rows = [], auth = null; // auth = {email, code}, kept in this tab only

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

async function load() {
  $("sum").textContent = "Loading...";
  const res = await fetchRows(current);
  if (res.denied) { signOut(); return say("Wrong email or password."); }
  if (res.error) { rows = []; $("sum").textContent = ""; say(res.error); render(); return; }
  say("");
  rows = res.data;
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
  if (current === "event_signups") s += ", " + list.filter(r => r.associate_screener).length + " screeners, " + list.filter(r => r.can_cook).length + " cooks";
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
  const res = await fetchRows(current);
  if (res.denied) { auth = null; return say("Wrong email or password."); }
  if (res.error) { auth = null; return say(res.error); }
  try { sessionStorage.setItem("ffac-officer", JSON.stringify(auth)); } catch (e) {}
  $("who").textContent = email;
  say("");
  show("app");
  buildTabs();
  rows = res.data;
  fillFilter("f-event", "event_date", "All events");
  fillFilter("f-form", "form", "All forms");
  render();
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
