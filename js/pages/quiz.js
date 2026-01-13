/**
 * quiz.js
 * ==================================================
 * QUIZ MODEL 1 (Audio → Gambar)
 *
 * Fitur FINAL:
 * - Ambil konteks dari URL (tema, subtema, pertemuan)
 * - Generate soal dari kosakata
 * - Pilih → Periksa → Feedback
 * - Otomatis lanjut soal
 * - Selesai → simpan hasil + progress
 * - Redirect ke result.html
 */

/* ==================================================
   AMBIL PARAMETER URL (WAJIB)
   ================================================== */
const params = new URLSearchParams(window.location.search);

const temaId = params.get("tema");
const subtemaId = params.get("subtema");
const pertemuanId = params.get("pertemuan");

if (!temaId || !subtemaId || !pertemuanId) {
  alert("Parameter quiz tidak lengkap");
  throw new Error("URL quiz invalid");
}

/* ==================================================
   AMBIL ELEMEN DOM
   ================================================== */
const judulEl = document.getElementById("quiz-judul");
const instruksiEl = document.getElementById("soal-instruksi");
const audioSoalBtn = document.getElementById("btn-audio-soal");
const opsiContainer = document.getElementById("opsi-jawaban");
const btnPeriksa = document.getElementById("btn-periksa");
const progressBarEl = document.getElementById("progress-bar");

/* ==================================================
   STATE GLOBAL
   ================================================== */
let daftarSoal = [];
let indexSoalAktif = 0;
let jawabanBenar = null;
let opsiTerpilih = null;
let hasilQuiz = [];

/* ==================================================
   UTILITAS
   ================================================== */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function updateProgressBar() {
  const total = daftarSoal.length;
  const progress = ((indexSoalAktif + 1) / total) * 100;
  progressBarEl.style.width = `${progress}%`;
}

/* ==================================================
   BENTUK DAFTAR SOAL (MODEL 1)
   ================================================== */
function buatDaftarSoal(kosakata) {
  daftarSoal = [];

  kosakata.forEach((kata) => {
    const jawaban = kata;
    const distraktor = shuffle(
      kosakata.filter(k => k.id !== kata.id)
    ).slice(0, 3);

    daftarSoal.push({
      jawabanBenar: jawaban,
      opsi: shuffle([jawaban, ...distraktor])
    });
  });

  indexSoalAktif = 0;
  hasilQuiz = [];
}

/* ==================================================
   RENDER SOAL
   ================================================== */
function renderSoal() {
  const soal = daftarSoal[indexSoalAktif];

  /* ===============================
     JIKA SOAL HABIS
     =============================== */
  if (!soal) {
    const totalSoal = hasilQuiz.length;
    const totalBenar = hasilQuiz.filter(h => h.benar).length;
    const skor = totalSoal === 0
      ? 0
      : Math.round((totalBenar / totalSoal) * 100);

    // -------------------------------
    // SIMPAN HASIL QUIZ
    // -------------------------------
    localStorage.setItem(
      "resultQuiz",
      JSON.stringify({
        meta: {
          temaId,
          subtemaId,
          pertemuanId,
          totalSoal,
          totalBenar,
          skor
        },
        detail: hasilQuiz
      })
    );

    // -------------------------------
    // SIMPAN PROGRESS BELAJAR
    // -------------------------------
    const progress =
      JSON.parse(localStorage.getItem("progressBelajar")) || {};

    if (!progress[temaId]) progress[temaId] = {};
    if (!progress[temaId][subtemaId]) progress[temaId][subtemaId] = {};

    progress[temaId][subtemaId][pertemuanId] = {
      selesai: true,
      skor
    };

    localStorage.setItem(
      "progressBelajar",
      JSON.stringify(progress)
    );

    // -------------------------------
    // PINDAH KE RESULT
    // -------------------------------
    window.location.href = "result.html";
    return;
  }

  /* ===============================
     RENDER SOAL NORMAL
     =============================== */
  jawabanBenar = soal.jawabanBenar;
  opsiTerpilih = null;
  btnPeriksa.disabled = true;

  judulEl.textContent = "Pilih gambar yang sesuai dengan audio";
  instruksiEl.textContent =
    `Soal ${indexSoalAktif + 1} dari ${daftarSoal.length}`;

  updateProgressBar();

  // Audio soal utama
  const audioSoal = new Audio(jawabanBenar.audio);
  audioSoalBtn.onclick = () => audioSoal.play();

  // Render opsi
  opsiContainer.innerHTML = "";

  soal.opsi.forEach((kata) => {
    const opsiEl = document.createElement("div");
    opsiEl.className = "opsi-item";
    opsiEl.dataset.id = kata.id;

    const btnAudio = document.createElement("button");
    btnAudio.textContent = "🔊";
    btnAudio.onclick = (e) => {
      e.stopPropagation();
      new Audio(kata.audio).play();
    };

    const img = document.createElement("img");
    img.src = kata.image;
    img.alt = kata.arab;
    img.style.width = "120px";

    opsiEl.onclick = () => {
      document
        .querySelectorAll(".opsi-item")
        .forEach(el => el.classList.remove("selected"));

      opsiEl.classList.add("selected");
      opsiTerpilih = kata.id;
      btnPeriksa.disabled = false;
    };

    opsiEl.appendChild(btnAudio);
    opsiEl.appendChild(img);
    opsiContainer.appendChild(opsiEl);
  });
}

/* ==================================================
   TOMBOL PERIKSA
   ================================================== */
btnPeriksa.onclick = () => {
  if (!opsiTerpilih) return;

  const benar = opsiTerpilih === jawabanBenar.id;

  hasilQuiz.push({
    soalKe: indexSoalAktif + 1,
    jawabanBenarId: jawabanBenar.id,
    jawabanSiswaId: opsiTerpilih,
    benar
  });

  document.querySelectorAll(".opsi-item").forEach((el) => {
    el.classList.add("disabled");

    if (el.dataset.id === jawabanBenar.id) {
      el.classList.add("benar");
    }

    if (el.dataset.id === opsiTerpilih && !benar) {
      el.classList.add("salah");
    }
  });

  btnPeriksa.disabled = true;

  setTimeout(() => {
    indexSoalAktif++;
    renderSoal();
  }, 1200);
};

/* ==================================================
   LOAD DATA & MULAI QUIZ
   ================================================== */
import(`../../content/${temaId}/${subtemaId}/${pertemuanId}/kosakata.js`)
  .then((module) => {
    const kosakata = module.kosakata;

    if (!kosakata || kosakata.length < 4) {
      throw new Error("Kosakata minimal 4 item");
    }

    buatDaftarSoal(kosakata);
    renderSoal();
  })
  .catch((error) => {
    console.error(error);
    alert("Data quiz tidak ditemukan");
  });

