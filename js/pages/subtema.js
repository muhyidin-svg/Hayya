import { temaList } from "../data/tema.js";
import { subtemaData } from "../data/subtema.js";

// AMBIL PARAM DARI URL
const params = new URLSearchParams(window.location.search);
const temaId = params.get("tema");

// AMBIL DATA TEMA
const tema = temaList.find(t => t.id === temaId);

// AMBIL LIST SUBTEMA DARI DATA
const listSubtema = subtemaData[temaId];

// TAMPILKAN NAMA SISWA
document.getElementById("nama-siswa").textContent =
  localStorage.getItem("namaSiswa") || "Nama Siswa";

// TAMPILKAN HEADER
document.getElementById("tema-nama").textContent = tema.nama;
document.getElementById("tema-urutan").textContent =
  temaList.indexOf(tema) + 1;

// PROGRESS (jika ada)
const progress = JSON.parse(localStorage.getItem("progressBelajar")) || {};
const subProgress = progress[temaId] || {};

// RENDER LIST SUBTEMA
const container = document.getElementById("subtema-list");

listSubtema.forEach((sub, i) => {
  const card = document.createElement("div");
  card.className = "subtema-card";

  // jika sudah selesai
  if (subProgress[sub.id]?.selesai) {
    card.classList.add("selesai");
  }

  card.innerHTML = `
    <div class="subtema-name">${sub.nama}</div>
    <span class="subtema-status">
      ${subProgress[sub.id]?.selesai ? "Selesai" : "Belum"}
    </span>
  `;

  // klik → menuju daftar pertemuan
  card.onclick = () => {
    window.location.href =
      `pertemuan.html?tema=${temaId}&subtema=${sub.id}`;
  };

  container.appendChild(card);
});

// ========= NAVIGATION ACTIVE =========
function setActive(menuId) {
  document.getElementById(menuId)?.classList.add("active");
}

// Isi link agar kembali ke subtema yang sama
document.getElementById("nav-subtema").href =
  `subtema.html?tema=${temaId}`;

setActive("nav-subtema");