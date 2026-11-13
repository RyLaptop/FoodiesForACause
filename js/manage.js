// Manage my sign-up. The publishable key is public by design: the only way in is the three RPC functions in
// supabase-manage-signups.sql, and each needs the matching name + phone + email before it returns or changes anything.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const $ = id => document.getElementById(id);
const TYPES = {signups_ftv: "Feed The Valley", signups_service: "Service event", signups_social: "Social event", signups_fundraiser: "Fundraiser"};
const ROLES = {cook: "Cooking", handout: "Food handout", screener: "Associate screener"};
let who = null; // {name, phone, email} of the person who looked up, kept in memory only

async function rpc(fn, body) {
  const r = await fetch(SB + "/rest/v1/rpc/" + fn, {
    method: "POST",
    headers: {apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json"},
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(r.status);
  return r.json();
}
const say = (el, t, ok) => { el.textContent = t || ""; el.className = "form-msg " + (ok ? "ok" : "err"); };
const fmt = d => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", {weekday: "long", month: "long", day: "numeric", year: "numeric"}) : "Date not set";
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; };

function yn(id, legend, key, value, disabled) {
  const f = el("fieldset", "yn"), l = el("legend", "", legend);
  f.appendChild(l);
  for (const [v, label] of [["yes", "Yes"], ["no", "No"]]) {
    const lab = el("label", "opt"), i = document.createElement("input");
    i.type = "radio"; i.name = id + key; i.value = v; i.dataset.key = key; i.disabled = disabled;
    i.checked = value === (v === "yes");
    lab.append(i, " " + label);
    f.appendChild(lab);
  }
  return f;
}

function card(s) {
  const c = el("article", "mcard"), msg = el("div", "form-msg"), id = s.tbl + s.id + "-";
  c.appendChild(el("h3", "", TYPES[s.tbl] + (s.role ? ": " + ROLES[s.role] : "")));
  c.appendChild(el("p", "mdate", fmt(s.event_date)));
  if (s.locked) c.appendChild(el("p", "mlock", "This event has passed, so this sign-up can no longer be changed."));
  const d = s.locked, form = el("div", "mfields");
  form.appendChild(yn(id, s.tbl === "signups_ftv" ? "Will you be volunteering?" : "Will you be attending?", "attending", s.attending, d));
  if (s.tbl === "signups_fundraiser") form.appendChild(yn(id, "Can you bake?", "can_bake", s.can_bake, d));
  form.appendChild(yn(id, "Do you need a ride?", "needs_ride", s.needs_ride, d));
  form.appendChild(yn(id, "Can you provide rides to others?", "can_give_rides", s.can_give_rides, d));
  let cert = null;
  if (s.role === "screener") {
    form.appendChild(yn(id, "Do you have a certification or training in taking vitals?", "vitals_trained", s.vitals_trained, d));
    cert = el("input"); cert.type = "text"; cert.maxLength = 160; cert.placeholder = "Which certification or training?"; cert.value = s.vitals_cert || ""; cert.disabled = d;
    form.appendChild(cert);
  }
  c.appendChild(form);
  if (!s.locked) {
    const save = el("button", "btn btn-solid btn-small", "Save changes"), del = el("button", "btn btn-solid btn-small mdel", "Delete sign-up");
    save.type = del.type = "button";
    save.onclick = async () => {
      const changes = {};
      for (const i of form.querySelectorAll("input[type=radio]:checked")) changes[i.dataset.key] = i.value === "yes";
      if (cert) changes.vitals_cert = cert.value.trim();
      save.disabled = true; say(msg, "");
      try {
        const r = await rpc("update_signup", {p_table: s.tbl, p_id: s.id, p_name: who.name, p_phone: who.phone, p_email: who.email, p_changes: changes});
        say(msg, r.updated ? "Saved." : "Could not save. The event may have passed.", !!r.updated);
      } catch (e) { say(msg, "Something went wrong. Please try again."); }
      save.disabled = false;
    };
    del.onclick = async () => {
      if (!confirm("Delete this sign-up? This cannot be undone.")) return;
      del.disabled = true; say(msg, "");
      try {
        const r = await rpc("delete_signup", {p_table: s.tbl, p_id: s.id, p_name: who.name, p_phone: who.phone, p_email: who.email});
        if (r.deleted) { c.remove(); if (!$("results").querySelector(".mcard")) say($("lmsg"), "Your sign-up was deleted. No other sign-ups found.", true); }
        else { say(msg, "Could not delete. The event may have passed."); del.disabled = false; }
      } catch (e) { say(msg, "Something went wrong. Please try again."); del.disabled = false; }
    };
    const row = el("div", "mbtns");
    row.append(save, del);
    c.appendChild(row);
  }
  c.appendChild(msg);
  return c;
}

$("lf").addEventListener("submit", async e => {
  e.preventDefault();
  const d = new FormData(e.target), box = $("results");
  if (d.get("website")) return; // honeypot
  const name = (d.get("name") || "").trim(), phone = (d.get("phone") || "").trim(), email = (d.get("email") || "").trim();
  if (name.length < 2) return say($("lmsg"), "Please enter your full name.");
  if (phone.replace(/\D/g, "").length < 7) return say($("lmsg"), "Please enter a valid phone number.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say($("lmsg"), "Please enter a valid email.");
  const btn = $("find"); btn.disabled = true; say($("lmsg"), ""); box.innerHTML = "";
  try {
    const list = await rpc("my_signups", {p_name: name, p_phone: phone, p_email: email});
    who = {name, phone, email};
    if (!list.length) say($("lmsg"), "No sign-ups found. Use the same name, phone number and email you signed up with.");
    else { say($("lmsg"), list.length + " sign-up" + (list.length === 1 ? "" : "s") + " found.", true); list.forEach(s => box.appendChild(card(s))); }
  } catch (err) { say($("lmsg"), "Something went wrong. Please try again."); }
  btn.disabled = false;
});
