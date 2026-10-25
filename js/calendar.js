// To add an event: append a line to EVENTS. d = YYYY-MM-DD, c = meeting | fundraiser | service | social | ftv.
const CATS = {meeting: "Meeting", fundraiser: "Fundraiser", service: "Service", social: "Social", ftv: "Feed The Valley"};
const EVENTS = [
  {d: "2026-04-18", c: "service", t: "Brazos Valley Food Bank", time: "", where: "Brazos Valley Food Bank", href: "events/service.html"},
  {d: "2026-08-27", c: "fundraiser", t: "Bake Sale", time: "10 PM–1 AM", where: "Northgate, behind Bottlecap Alley", href: "events/fundraisers.html"},
  {d: "2026-08-28", c: "fundraiser", t: "Bake Sale", time: "10 PM–1 AM", where: "Northgate, behind Bottlecap Alley", href: "events/fundraisers.html"},
  {d: "2026-09-09", c: "meeting", t: "First General Meeting", time: "5:30–6:30 PM", where: "Koldus Building, Room 146", href: "meetings.html"},
  {d: "2026-09-10", c: "fundraiser", t: "Bake Sale", time: "10 PM–1 AM", where: "Northgate, behind Bottlecap Alley", href: "events/fundraisers.html"},
  {d: "2026-09-12", c: "ftv", t: "Feed The Valley", time: "", where: "Brazos County", href: "feed-the-valley.html"},
  {d: "2026-09-23", c: "meeting", t: "Second General Meeting", time: "5:30–6:30 PM", where: "Koldus Building, Room 146", href: "meetings.html"},
  {d: "2026-09-26", c: "service", t: "Aggieland Humane Society", time: "9:30–10:30 AM", where: "5359 Leonard Rd, Bryan", href: "events/service.html"},
  {d: "2026-09-26", c: "fundraiser", t: "Bake Sale", time: "10 PM–1 AM", where: "Northgate, behind Bottlecap Alley", href: "events/fundraisers.html"},
  {d: "2026-10-18", c: "fundraiser", t: "Bake Sale with Cloud9 Run Club", time: "5–8 PM", where: "The Corner Bar, Northgate", href: "events/fundraisers.html"},
  {d: "2026-10-21", c: "meeting", t: "Third General Meeting", time: "5:30–6:30 PM", where: "AGLS Building, Room 419", href: "meetings.html"},
  {d: "2026-10-23", c: "service", t: "Bridge Ministry", time: "11:30 AM–12:30 PM", where: "304 Post Office St, Bryan", href: "events/service.html"},
  {d: "2026-10-25", c: "social", t: "FFAC Cookout", time: "2:30 PM", where: "2415 Junction Boys Road", href: "events/social.html"},
  {d: "2026-10-29", c: "fundraiser", t: "Bake Sale at Bottlecap Alley", time: "10 PM–1 AM", where: "Northgate, behind Bottlecap Alley", href: "events/fundraisers.html"},
  {d: "2026-11-07", c: "ftv", t: "Feed The Valley", time: "1–3 PM (may change)", where: "903 N Washington Ave, Bryan", href: "feed-the-valley.html"}
];
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, "0");
const iso = (y, m, d) => y + "-" + pad(m + 1) + "-" + pad(d);
const now = new Date(), todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate());
let y = now.getFullYear(), m = now.getMonth();

$("legend").innerHTML = Object.entries(CATS).map(([k, v]) => '<span class="cal-key"><i class="cal-dot cat-' + k + '"></i>' + v + "</span>").join("");

function detail(e) { return [e.time, e.where].filter(Boolean).join(" · "); }

function render() {
  $("month-label").textContent = new Date(y, m, 1).toLocaleString("en-US", {month: "long", year: "numeric"});
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  let html = "";
  for (let i = 0; i < first; i++) html += '<div class="cal-cell cal-empty"></div>';
  for (let d = 1; d <= days; d++) {
    const key = iso(y, m, d), evs = EVENTS.filter(e => e.d === key);
    html += '<div class="cal-cell' + (key === todayIso ? " cal-today" : "") + '"><span class="cal-num">' + d + "</span>" +
      evs.map(e => '<a class="cal-chip cat-' + e.c + '" href="' + e.href + '" title="' + e.t + " — " + detail(e) + '">' + e.t + "</a>").join("") + "</div>";
  }
  $("grid").innerHTML = html;
}

function upcoming() {
  const list = EVENTS.filter(e => e.d >= todayIso).sort((a, b) => a.d.localeCompare(b.d));
  $("upcoming").innerHTML = list.length ? list.map(e => {
    const dt = new Date(e.d + "T12:00:00");
    return '<a class="cal-item" href="' + e.href + '"><span class="cal-when"><b>' + dt.toLocaleString("en-US", {month: "short"}).toUpperCase() + "</b>" + dt.getDate() +
      '</span><span><strong>' + e.t + '</strong><br><small><i class="cal-dot cat-' + e.c + '"></i>' + CATS[e.c] + " · " + detail(e) + "</small></span></a>";
  }).join("") : '<p class="section-lede">No upcoming events right now. Check back soon.</p>';
}

function past() {
  const list = EVENTS.filter(e => e.d < todayIso).sort((a, b) => b.d.localeCompare(a.d));
  $("past").innerHTML = list.map(e => {
    const dt = new Date(e.d + "T12:00:00");
    return '<a class="cal-item" href="' + e.href + '"><span class="cal-when"><b>' + dt.toLocaleString("en-US", {month: "short"}).toUpperCase() + "</b>" + dt.getDate() +
      '</span><span><strong>' + e.t + '</strong><br><small><i class="cal-dot cat-' + e.c + '"></i>' + CATS[e.c] + " · " + detail(e) + "</small></span></a>";
  }).join("");
}

$("prev").onclick = () => { m--; if (m < 0) { m = 11; y--; } render(); };
$("next").onclick = () => { m++; if (m > 11) { m = 0; y++; } render(); };
render(); upcoming(); past();
