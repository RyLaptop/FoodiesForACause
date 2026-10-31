// The publishable key is public by design: RLS lets it insert into members and nothing else.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const $ = id => document.getElementById(id);
const say = (t, ok) => { const m = $("msg"); m.textContent = t; m.className = "form-msg " + (ok ? "ok" : "err"); };
$("mf").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, d = new FormData(f);
  if (d.get("website")) return; // honeypot
  const v = k => (d.get(k) || "").trim();
  const name = v("name"), phone = v("phone"), email = v("email"), uin = v("uin"), class_year = v("class_year");
  if (name.length < 2) return say("Please enter your full name.");
  if (phone.replace(/\D/g, "").length < 10) return say("Please enter a valid phone number.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say("Please enter a valid email.");
  if (!/^\d{9}$/.test(uin)) return say("UIN must be 9 digits.");
  if (!class_year) return say("Please select your class year.");
  const btn = $("go"); btn.disabled = true; say("");
  try {
    const r = await fetch(SB + "/rest/v1/members", {
      method: "POST",
      headers: {apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", Prefer: "return=minimal"},
      body: JSON.stringify({name, phone, email, uin, class_year})
    });
    if (r.ok) { f.reset(); say("Thank you! You're signed up.", true); }
    else say("Something went wrong. Please try again.");
  } catch (err) { say("Network error. Please try again."); }
  btn.disabled = false;
});
