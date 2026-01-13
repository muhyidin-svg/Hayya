import { temaList } from "../data/tema.js";
import { subtemaData } from "../data/subtema.js";
import { pertemuanData } from "../data/pertemuan.js";

const params = new URLSearchParams(window.location.search);

const temaId = params.get("tema");
const subtemaId = params.get("subtema");

const tema = temaList.find(t => t.id === temaId);
const subtema = subtemaData[temaId].find(s => s.id === subtemaId);

document.getElementById("nama-siswa").textContent =
  localStorage.getItem("namaSiswa") || "Nama Siswa";

document.getElementById("subtema-nama").textContent = subtema.nama;
document.getElementById("subtema-urutan").textContent =
  subtemaData[temaId].indexOf(subtema) + 1;

// Progress
const progress = JSON.parse(localStorage.getItem("progressBelajar")) || {};
const subProgress = progress[temaId]?.[subtemaId] || {};

const allPertemuan = pertemuanData[subtemaId];

// Default pertemuan (first or latest)
let defaultPert = allPertemuan[0].id;

// Cari yang sudah selesai
const selesai = allPertemuan
  .filter(p => subProgress[p.id]?.selesai)
  .map(p => p.id);

if (selesai.length > 0) {
  defaultPert = selesai[selesai.length - 1];
}

function updateCard(id) {
  const p = allPertemuan.find(x => x.id === id);

  document.getElementById("materi-name").textContent = "Pertemuan " + p.nama;

  document.getElementById("btn-mulai").onclick = () => {
    window.location.href =
      `quiz.html?tema=${temaId}&subtema=${subtemaId}&pertemuan=${p.id}`;
  };
}

// ZIGZAG Placement
const listEl = document.getElementById("step-list");

const DIST_Y = 130;
const OFFSET = 120;
const SIZE = 78;
const HALF = SIZE / 2;

allPertemuan.forEach((p, i) => {
  const item = document.createElement("div");
  item.className = "step-item";
  item.textContent = p.nama;

  if (subProgress[p.id]?.selesai) item.classList.add("selesai");

  const top = i * DIST_Y;

  let x = 0;
  if (i % 4 === 1) x = OFFSET;
  if (i % 4 === 3) x = -OFFSET;

  item.style.top = `${top}px`;
  item.style.left = `calc(50% + ${x}px - ${HALF}px)`;

  item.onclick = () => updateCard(p.id);

  listEl.appendChild(item);
});

// Card awal
updateCard(defaultPert);


// ========= NAV ACTIVE =========
function setActive(menuId) {
  document.getElementById(menuId)?.classList.add("active");
}

document.getElementById("nav-subtema").href =
  `subtema.html?tema=${temaId}`;

setActive("nav-subtema");