// The publishable key is public by design: RLS lets it insert into the signups_* tables and nothing else.
const SB = "https://rtzmvgpomudzxumlnmyh.supabase.co", KEY = "sb_publishable_GX60hLmCo8t7SU48Zkee1w_gr79c7MJ";
const $ = id => document.getElementById(id);
const EV = window.SIGNUP_EVENT; // set on pages tied to one dated event (see ftv-volunteer.html)
async function loadCounts() {
  if (!EV) return;
  try {
    const r = await fetch(SB + "/rest/v1/rpc/ftv_signup_counts", {method: "POST", headers: {apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json"}, body: JSON.stringify({p_date: EV.date})});
    const c = await r.json();
    if (c && typeof c.volunteers === "number") {
      // At zero left: gray out that role's button (hub link and/or the form's submit button) and say it is filled.
      const set = (id, need, got, page) => {
        if (!$(id) || typeof got !== "number") return;
        const left = Math.max(0, need - got);
        $(id).textContent = left;
        if (left) return;
        const btns = [...document.querySelectorAll('a[href="' + page + '"]')];
        if ($("go") && sf) btns.push($("go"));
        for (const b of btns) { b.textContent = "Filled"; b.classList.add("filled"); b.setAttribute("aria-disabled", "true"); if (b.tagName === "BUTTON") b.disabled = true; }
        if (sf) say("This sign-up has been filled.");
      };
      set("need-vol", EV.needs.volunteers, c.volunteers, "ftv-handout.html");
      set("need-cook", EV.needs.cooks, c.cooks, "ftv-cooking.html");
      set("need-scr", EV.needs.screeners, c.screeners, "ftv-screener.html");
    }
  } catch (e) {}
}
loadCounts();
const say = (t, ok) => { const m = $("msg"); m.textContent = t; m.className = "form-msg " + (ok ? "ok" : "err"); };
const sf = $("sf");
if (sf) {
  // Screener form: the cert dropdown only shows when "Yes" is picked, and "Other" asks for a description.
  const syncCert = () => {
    if (!$("cert-wrap")) return;
    const yes = sf.elements.vitals_trained.value === "yes";
    $("cert-wrap").hidden = !yes;
    $("cert-other-wrap").hidden = !(yes && sf.elements.vitals_cert.value === "Other");
  };
  if ($("cert-wrap")) sf.addEventListener("change", syncCert);
  sf.addEventListener("submit", async e => {
    e.preventDefault();
    const f = e.target, d = new FormData(f);
    if (d.get("website")) return; // honeypot
    const name = (d.get("name") || "").trim(), phone = (d.get("phone") || "").trim(), email = (d.get("email") || "").trim();
    if (name.length < 2) return say("Please enter your full name.");
    if (phone.replace(/\D/g, "").length < 7) return say("Please enter a valid phone number.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say("Please enter a valid email.");
    const table = {ftv: "signups_ftv", service: "signups_service", social: "signups_social", fundraiser: "signups_fundraiser"}[f.dataset.form];
    const body = {name, phone, email};
    if (EV) body.event_date = EV.date;
    for (const k of f.dataset.fields.split(",")) {
      const v = d.get(k);
      if (!v) return say("Please answer every question.");
      body[k === "volunteering" ? "attending" : k] = v === "yes";
    }
    // FTV role (handout | cook | screener). The role's own flag mirrors the "will you be volunteering" answer.
    const role = f.dataset.role;
    if (role) {
      body.role = role;
      if (role === "cook") body.can_cook = body.attending;
      if (role === "screener") body.associate_screener = body.attending;
    }
    let noTraining = false;
    if ($("cert-wrap")) {
      const vt = d.get("vitals_trained");
      if (!vt) return say("Please answer every question.");
      body.vitals_trained = vt === "yes";
      noTraining = vt === "no";
      if (body.vitals_trained) {
        let cert = d.get("vitals_cert") || "";
        if (!cert) return say("Please choose your certification or training.");
        if (cert === "Other") {
          const o = (d.get("vitals_cert_other") || "").trim();
          if (!o) return say("Please describe your training.");
          cert = "Other: " + o;
        }
        body.vitals_cert = cert;
      }
    }
    const btn = $("go"); btn.disabled = true; say("");
    try {
      const r = await fetch(SB + "/rest/v1/" + table, {
        method: "POST",
        headers: {apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", Prefer: "return=minimal"},
        body: JSON.stringify(body)
      });
      if (r.ok) {
        f.reset(); syncCert();
        say((f.dataset.thanks || "Thank you! You're signed up.") + (noTraining ? " Since you have no vitals training yet, watch for an email 1 week before the event to schedule your 1-hour in-person training." : ""), true);
        loadCounts();
      }
      else say("Something went wrong. Please try again.");
    } catch (err) { say("Network error. Please try again."); }
    btn.disabled = false;
  });
}
