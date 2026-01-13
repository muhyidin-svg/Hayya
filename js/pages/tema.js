import { temaList } from "../data/tema.js";

const nama = localStorage.getItem("namaSiswa") || "Nama Siswa";
document.getElementById("nama-siswa").textContent = nama;

const container = document.getElementById("tema-list");

temaList.forEach(tema => {

  const temaNumber = Number(tema.id.replace("t", ""));
  let kelas = "";
  let semester = "";
  let kelasClass = "";

  // Kelas & Semester mapping terbaru
  if (temaNumber >= 1 && temaNumber <= 3) {
    kelas = "7"; semester = "Semester 1"; kelasClass = "kelas7";
  } else if (temaNumber >= 4 && temaNumber <= 6) {
    kelas = "7"; semester = "Semester 2"; kelasClass = "kelas7";
  } else if (temaNumber >= 7 && temaNumber <= 8) {
    kelas = "8"; semester = "Semester 1"; kelasClass = "kelas8";
  } else if (temaNumber >= 9 && temaNumber <= 10) {
    kelas = "8"; semester = "Semester 2"; kelasClass = "kelas8";
  } else if (temaNumber >= 11 && temaNumber <= 13) {
    kelas = "9"; semester = "Semester 1"; kelasClass = "kelas9";
  } else if (temaNumber >= 14 && temaNumber <= 16) {
    kelas = "9"; semester = "Semester 2"; kelasClass = "kelas9";
  }

  const card = document.createElement("div");
  card.className = "tema-card";

  card.innerHTML = `
    <div class="tema-header-box">
      <h3 class="tema-name">${tema.nama}</h3>
      <p class="tema-desc">${tema.deskripsi}</p>
    </div>

    <div class="tema-info ${kelasClass}">
      <span>Kelas ${kelas}</span>
      <span>${semester}</span>
    </div>
  `;

  card.onclick = () => {
    window.location.href = `subtema.html?tema=${tema.id}`;
  };

  container.appendChild(card);
});

// =====================
// SET ACTIVE MENU
// =====================
function setActive(menuId) {
  document.getElementById(menuId)?.classList.add("active");
}

setActive("nav-home");
// Highligt menu bottom nav
document.getElementById("nav-home")?.classList.add("active");
