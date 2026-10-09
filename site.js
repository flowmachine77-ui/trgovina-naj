const menuBtn = document.querySelector(".menu-btn");
const mobile = document.querySelector("#mobilni-meni");
menuBtn.addEventListener("click", () => {
  const open = mobile.hasAttribute("hidden");
  mobile.toggleAttribute("hidden", !open);
  mobile.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.textContent = open ? "Zapri" : "Meni";
});
mobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobile.setAttribute("hidden", "");
    mobile.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "Meni";
  });
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const id = chip.dataset.filter;
    document.querySelectorAll(".chip").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === chip));
    });
    document.querySelectorAll(".card").forEach((card) => {
      card.hidden = id !== "vse" && card.dataset.id !== id;
    });
  });
});

const ranges = {
  1: [[8 * 60, 12 * 60], [15 * 60, 19 * 60]],
  2: [[8 * 60, 12 * 60], [15 * 60, 19 * 60]],
  3: [[8 * 60, 12 * 60], [15 * 60, 19 * 60]],
  4: [[8 * 60, 12 * 60], [15 * 60, 19 * 60]],
  5: [[8 * 60, 12 * 60], [15 * 60, 19 * 60]],
  6: [[8 * 60, 12 * 60]],
  0: [],
};

const parts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Ljubljana",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
}).formatToParts(new Date());
const pick = (type) => parts.find((part) => part.type === type)?.value ?? "";
const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
const day = days[pick("weekday")] ?? 0;
const mins = Number(pick("hour")) * 60 + Number(pick("minute"));
const open = (ranges[day] ?? []).some(([from, to]) => mins >= from && mins < to);
document.querySelector("#odprto").textContent = open ? "Zdaj" : "Danes";
document.querySelector("#odprto-opis").textContent = open ? "smo odprti" : "glej urnik";
document.querySelector("#stanje").textContent = open ? "Trenutno odprto." : "Trenutno zaprto — urnik je spodaj.";
document.querySelector(`#urnik [data-day="${day}"]`)?.classList.add("today");
document.querySelector(`#urnik [data-day="${day}"] span`)?.insertAdjacentHTML(
  "beforeend",
  '<span class="today-tag">danes</span>',
);

const form = document.querySelector("#obrazec");
const thanks = document.querySelector("#hvala");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("ime") ?? "").trim();
  const phone = String(data.get("telefon") ?? "").trim();
  const note = String(data.get("sporocilo") ?? "").trim();
  const body = [`Ime: ${name}`, phone ? `Telefon: ${phone}` : "", "", note].filter(Boolean).join("\n");
  window.location.href = `mailto:trgovina.naj@t-2.net?subject=${encodeURIComponent(`Povpraševanje – ${name}`)}&body=${encodeURIComponent(body)}`;
  form.hidden = true;
  thanks.hidden = false;
});
document.querySelector("#znova").addEventListener("click", () => {
  form.hidden = false;
  thanks.hidden = true;
  form.reset();
});
