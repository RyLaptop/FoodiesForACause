// The publishable key is public by design: RLS lets it insert into event_signups and nothing else.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const $ = id => document.getElementById(id);
const say = (t, ok) => { const m = $("msg"); m.textContent = t; m.className = "form-msg " + (ok ? "ok" : "err"); };
$("sf").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, d = new FormData(f);
  if (d.get("website")) return; // honeypot
  const name = (d.get("name") || "").trim(), phone = (d.get("phone") || "").trim(), email = (d.get("email") || "").trim();
  if (name.length < 2) return say("Please enter your full name.");
  if (phone.replace(/\D/g, "").length < 7) return say("Please enter a valid phone number.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say("Please enter a valid email.");
  const body = {form: f.dataset.form, name, phone, email};
  for (const k of f.dataset.fields.split(",")) {
    const v = d.get(k);
    if (!v) return say("Please answer every question.");
    body[k === "volunteering" ? "attending" : k] = v === "yes";
  }
  const btn = $("go"); btn.disabled = true; say("");
  try {
    const r = await fetch(SB + "/rest/v1/event_signups", {
      method: "POST",
      headers: {apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", Prefer: "return=minimal"},
      body: JSON.stringify(body)
    });
    if (r.ok) { f.reset(); say("Thank you! You're signed up.", true); }
    else say("Something went wrong. Please try again.");
  } catch (err) { say("Network error. Please try again."); }
  btn.disabled = false;
});
