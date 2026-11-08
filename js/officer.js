// Officer portal. Reads the form tables with the officer's own login; RLS (supabase-officers.sql) decides who sees what.
// The publishable key is public by design. Never put a service key here.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const sb = supabase.createClient(SB, KEY);
const $ = id => document.getElementById(id);
const PAGE = location.origin + location.pathname;

const TABLES = {
  ftv_rsvps: {label: "Meal RSVPs", cols: ["created_at", "event_date", "name", "party_size", "contact", "note", "photo_release"]},
  event_signups: {label: "Volunteer sign-ups", cols: ["created_at", "form", "event_date", "name", "phone", "email", "attending", "needs_ride", "can_give_rides", "can_bake", "can_cook", "associate_screener"]},
  members: {label: "Members", cols: ["created_at", "name", "email", "phone", "uin", "class_year"]},
  contact_messages: {label: "Contact messages", cols: ["created_at", "name", "email", "message"]}
};
let current = "ftv_rsvps", rows = [];

function say(t, ok) { const m = $("msg"); m.textContent = t || ""; m.className = "form-msg " + (ok ? "ok" : "err"); }
function show(id) { for (const x of ["auth", "reset", "denied", "app"]) $(x).hidden = x !== id; }
function cell(c, v) {
  if (v === null || v === undefined) return "";
  if (c === "created_at") return new Date(v).toLocaleString("en-US", {timeZone: "America/Chicago"});
  if (typeof v === "boolean") return v ? "yes" : "no";
  return String(v);
}

async function route(session) {
  if (!session) { show("auth"); return; }
  const email = session.user.email;
  const {data, error} = await sb.rpc("is_officer");
  if (error || data !== true) { $("who-denied").textContent = email; show("denied"); return; }
  $("who").textContent = email;
  say("");
  show("app");
  buildTabs();
  load();
}

function buildTabs() {
  $("tabs").innerHTML = "";
  for (const [k, t] of Object.entries(TABLES)) {
    const b = document.createElement("button");
    b.type = "button"; b.className = "btn btn-outline" + (k === current ? " on" : ""); b.textContent = t.label;
    b.onclick = () => { current = k; $("q").value = ""; buildTabs(); load(); };
    $("tabs").appendChild(b);
  }
}

async function load() {
  $("sum").textContent = "Loading...";
  const {data, error} = await sb.from(current).select("*").order("created_at", {ascending: false}).limit(1000);
  if (error) { rows = []; $("sum").textContent = ""; say("Could not load: " + error.message); render(); return; }
  say("");
  rows = data;
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

async function creds() {
  const email = $("em").value.trim(), password = $("pw").value;
  if (!email) { say("Enter your email."); return null; }
  if (password.length < 10) { say("Password must be at least 10 characters."); return null; }
  return {email, password};
}

$("af").addEventListener("submit", async e => {
  e.preventDefault();
  const c = await creds(); if (!c) return;
  say("");
  const {error} = await sb.auth.signInWithPassword(c);
  if (error) say(error.message === "Email not confirmed" ? "Confirm your email first. Check your inbox." : "Wrong email or password.");
});
$("signup").onclick = async () => {
  const c = await creds(); if (!c) return;
  const {data, error} = await sb.auth.signUp({...c, options: {emailRedirectTo: PAGE}});
  if (error) return say(error.message);
  say(data.session ? "Account created." : "Check your inbox and confirm your email, then sign in.", true);
};
$("forgot").onclick = async () => {
  const email = $("em").value.trim();
  if (!email) return say("Enter your email first.");
  const {error} = await sb.auth.resetPasswordForEmail(email, {redirectTo: PAGE});
  say(error ? error.message : "If that email has an account, a reset link is on its way.", !error);
};
$("rf").addEventListener("submit", async e => {
  e.preventDefault();
  const password = $("np").value;
  if (password.length < 10) return say("Password must be at least 10 characters.");
  const {error} = await sb.auth.updateUser({password});
  if (error) return say(error.message);
  recovering = false;
  say("Password updated.", true);
  const {data} = await sb.auth.getSession();
  route(data.session);
});
document.querySelectorAll("[data-signout]").forEach(b => b.onclick = () => sb.auth.signOut());
$("refresh").onclick = load;
$("csv").onclick = csv;
for (const id of ["q", "f-event", "f-form"]) $(id).addEventListener("input", render);

let recovering = false; // reset-link visit: hold on the new-password form until it is saved
sb.auth.onAuthStateChange((event, session) => {
  if (event === "PASSWORD_RECOVERY") { recovering = true; show("reset"); return; }
  if (recovering) return;
  if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") setTimeout(() => route(session), 0);
});
