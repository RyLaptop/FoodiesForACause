// The publishable key is public by design: RLS lets it insert into contact_messages and nothing else.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const $ = id => document.getElementById(id);
const say = (t, ok) => { const m = $("msg"); m.textContent = t; m.className = "form-msg " + (ok ? "ok" : "err"); };
$("cf").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, d = new FormData(f);
  if (d.get("website")) return; // honeypot
  const name = (d.get("name") || "").trim(), email = (d.get("email") || "").trim(), message = (d.get("message") || "").trim();
  if (name.length < 2) return say("Please enter your name.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say("Please enter a valid email.");
  if (message.length < 2) return say("Please enter a message.");
  const btn = $("go"); btn.disabled = true; say("");
  try {
    const r = await fetch(SB + "/rest/v1/contact_messages", {
      method: "POST",
      headers: {apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", Prefer: "return=minimal"},
      body: JSON.stringify({name, email, message})
    });
    if (r.ok) { f.reset(); say("Thank you! We'll get back to you soon.", true); }
    else say("Something went wrong. Please try again.");
  } catch (err) { say("Network error. Please try again."); }
  btn.disabled = false;
});
