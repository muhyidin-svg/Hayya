/**
 * result.js
 * Menampilkan hasil quiz secara visual
 */

// Ambil data dari localStorage
const data = JSON.parse(localStorage.getItem("resultQuiz"));

if (!data) {
  alert("Data hasil tidak ditemukan");
  throw new Error("resultQuiz kosong");
}

// Ambil elemen
const skorEl = document.getElementById("skor");
const totalBenarEl = document.getElementById("total-benar");
const totalSoalEl = document.getElementById("total-soal");
const starsEl = document.getElementById("stars");
const badgeEl = document.getElementById("badge");
const messageEl = document.getElementById("message");

// Isi skor
const skor = data.meta.skor;
skorEl.textContent = `${skor}%`;
totalBenarEl.textContent = data.meta.totalBenar;
totalSoalEl.textContent = data.meta.totalSoal;

// ===============================
// LOGIKA BINTANG (1–5)
// ===============================
let jumlahBintang = 1;

if (skor >= 90) jumlahBintang = 5;
else if (skor >= 75) jumlahBintang = 4;
else if (skor >= 60) jumlahBintang = 3;
else if (skor >= 40) jumlahBintang = 2;

// Render bintang
starsEl.innerHTML = "";
for (let i = 0; i < jumlahBintang; i++) {
  const star = document.createElement("span");
  star.textContent = "⭐";
  star.className = "star";
  starsEl.appendChild(star);
}

// ===============================
// LOGIKA BADGE
// ===============================
let badgeText = "";
let badgeClass = "";
let messageText = "";

if (skor >= 85) {
  badgeText = "🌟 Sangat Baik";
  badgeClass = "good";
  messageText = "Luar biasa! Pemahaman kamu sangat bagus. Teruskan!";
} else if (skor >= 60) {
  badgeText = "👍 Cukup Baik";
  badgeClass = "medium";
  messageText = "Bagus! Tinggal sedikit lagi untuk hasil yang lebih maksimal.";
} else {
  badgeText = "💪 Perlu Latihan";
  badgeClass = "low";
  messageText = "Tidak apa-apa. Ayo ulangi dan belajar lagi dengan semangat!";
}

badgeEl.textContent = badgeText;
badgeEl.className = `badge ${badgeClass}`;
messageEl.textContent = messageText;

// ===============================
// TOMBOL ULANGI QUIZ
// ===============================
document.getElementById("btn-ulangi").onclick = () => {
  const { temaId, subtemaId, pertemuanId } = data.meta;

  if (!temaId || !subtemaId || !pertemuanId) {
    alert("Konteks quiz tidak lengkap");
    return;
  }

  window.location.href =
    `quiz.html?tema=${temaId}&subtema=${subtemaId}&pertemuan=${pertemuanId}`;
};

// ===============================
// TOMBOL KEMBALI KE PERTEMUAN
// ===============================
document.getElementById("btn-kembali").onclick = () => {
  const { temaId, subtemaId } = data.meta;

  if (!temaId || !subtemaId) {
    alert("Konteks pertemuan tidak lengkap");
    return;
  }

  window.location.href =
    `pertemuan.html?tema=${temaId}&subtema=${subtemaId}`;
};

// ========= NAV ACTIVE =========
function setActive(menuId) {
  document.getElementById(menuId)?.classList.add("active");
}

// agar tombol nav Subtema kembali ke halaman yang benar
const temaId = params.get("tema");
document.getElementById("nav-subtema").href =
  `subtema.html?tema=${temaId}`;

setActive("nav-subtema");