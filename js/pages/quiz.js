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
const judulEl = document.getElementById("quiz-judul");

/* ==================================================
   GENERATE JUDUL OTOMATIS (BAB : MUFRODAT : PERTEMUAN)
   ================================================== */
function toRoman(num) {
  const romans = [
    ["M",1000],["CM",900],["D",500],["CD",400],["C",100],
    ["XC",90],["L",50],["XL",40],["X",10],["IX",9],
    ["V",5],["IV",4],["I",1]
  ];
  let result = "";
  let n = parseInt(num, 10);
  romans.forEach(([rom,val]) => {
    while (n >= val) {
      result += rom;
      n -= val;
    }
  });
  return result || num;
}

if (judulEl) {
  const temaNumber = temaId.replace(/\D/g, "");
  const subtemaNumber = subtemaId.replace(/\D/g, "");
  const pertemuanNumber = pertemuanId.replace(/\D/g, "");
  judulEl.textContent = `TEMA ${temaNumber} : MUFRODAT ${subtemaNumber} : PERTEMUAN ${pertemuanNumber}`;
}

if (!temaId || !subtemaId || !pertemuanId) {
  alert("Parameter quiz tidak lengkap");
  throw new Error("URL quiz invalid");
}

/* ==================================================
   AMBIL ELEMEN DOM
   ================================================== */
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
let currentAudio = null;
let audioCorrect = new Audio("assets/audio/backsound/benar.mp3");
let audioWrong = new Audio("assets/audio/backsound/salah.mp3");

// Unlock audio permission for autoplay on result.html
function unlockAudio() {
  const unlock = new Audio("assets/audio/backsound/silent.mp3");
  unlock.volume = 0;
  unlock.play().catch(() => {});
}

/* ==================================================
   UTILITAS
   ================================================== */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function updateProgressBar() {
  const total = daftarSoal.length;
  const progress = ((indexSoalAktif + 1) / total) * 100;
  const fill = document.querySelector("#progress-bar div");
  if (fill) fill.style.width = `${progress}%`;
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

  if (!soal) {
    const totalSoal = hasilQuiz.length;
    const totalBenar = hasilQuiz.filter(h => h.benar).length;
    const skor = totalSoal === 0
      ? 0
      : Math.round((totalBenar / totalSoal) * 100);

    localStorage.setItem(
      "resultQuiz",
      JSON.stringify({
        meta: { temaId, subtemaId, pertemuanId, totalSoal, totalBenar, skor },
        detail: hasilQuiz
      })
    );

    const progress = JSON.parse(localStorage.getItem("progressBelajar")) || {};

    if (!progress[temaId]) progress[temaId] = {};
    if (!progress[temaId][subtemaId]) progress[temaId][subtemaId] = {};

    progress[temaId][subtemaId][pertemuanId] = { selesai: true, skor };

    localStorage.setItem("progressBelajar", JSON.stringify(progress));

    // SHOW MODAL RESULT (no redirect)
    if (window.showQuizResult) {
      window.showQuizResult({
        skor,
        totalBenar,
        totalSoal
      });
    }

    return;
  }

  jawabanBenar = soal.jawabanBenar;
  opsiTerpilih = null;
  btnPeriksa.disabled = true;

  instruksiEl.textContent = "Pilih gambar yang sesuai dengan audio";

  const audioSoal = new Audio(jawabanBenar.audio);
  audioSoalBtn.onclick = () => audioSoal.play();

  opsiContainer.innerHTML = "";

  soal.opsi.forEach((kata) => {
    const opsiEl = document.createElement("div");
    opsiEl.className = "opsi-item";
    opsiEl.dataset.id = kata.id;

    const img = document.createElement("img");
    img.src = kata.image;
    img.alt = kata.arab;
    img.style.width = "120px";

    opsiEl.onclick = () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      currentAudio = new Audio(kata.audio);
      currentAudio.play();

      document.querySelectorAll(".opsi-item").forEach(el => el.classList.remove("selected"));

      opsiEl.classList.add("selected");
      opsiTerpilih = kata.id;
      btnPeriksa.disabled = false;
    };

    opsiEl.appendChild(img);
    opsiContainer.appendChild(opsiEl);
  });
}

/* ==================================================
   TOMBOL PERIKSA
   ================================================== */
btnPeriksa.onclick = () => {
  unlockAudio();
  if (!opsiTerpilih) return;

  const benar = opsiTerpilih === jawabanBenar.id;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (benar) {
    audioWrong.pause(); audioWrong.currentTime = 0;
    audioCorrect.pause(); audioCorrect.currentTime = 0;
    audioCorrect.play();
  } else {
    audioCorrect.pause(); audioCorrect.currentTime = 0;
    audioWrong.pause(); audioWrong.currentTime = 0;
    audioWrong.play();
  }

  hasilQuiz.push({ soalKe: indexSoalAktif + 1, jawabanBenarId: jawabanBenar.id, jawabanSiswaId: opsiTerpilih, benar });

  updateProgressBar();
  const progressText = document.getElementById("progress-text");
  if (progressText) {
    progressText.textContent = `${indexSoalAktif + 1}/${daftarSoal.length}`;
  }

  document.querySelectorAll(".opsi-item").forEach((el) => {
    el.classList.add("disabled");

    if (el.dataset.id === jawabanBenar.id) el.classList.add("benar");
    if (el.dataset.id === opsiTerpilih && !benar) el.classList.add("salah");
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

    if (!kosakata || kosakata.length < 4) throw new Error("Kosakata minimal 4 item");

    buatDaftarSoal(kosakata);
    renderSoal();
  })
  .catch((error) => {
    console.error(error);
    alert("Data quiz tidak ditemukan");
  });