// ==============================================
// GLOBAL NAVIGATION CONTROLLER
// ==============================================

const pageName = window.location.pathname.split("/").pop();
const params = new URLSearchParams(window.location.search);

const temaId = params.get("tema");
const subtemaId = params.get("subtema");

// ==============================================
// SET LINK DINAMIS
// ==============================================

// Subtema → harus tahu tema-nya
if (temaId) {
  const el = document.getElementById("nav-subtema");
  if (el) el.href = `subtema.html?tema=${temaId}`;
}

// Pertemuan → harus tahu tema + subtema
if (temaId && subtemaId) {
  const el = document.getElementById("nav-pertemuan");
  if (el) el.href = `pertemuan.html?tema=${temaId}&subtema=${subtemaId}`;
}


// ==============================================
// ACTIVE STATE
// ==============================================

// Tema
if (pageName.includes("tema")) {
  document.getElementById("nav-tema")?.classList.add("active");
}

// Subtema
if (pageName.includes("subtema")) {
  document.getElementById("nav-subtema")?.classList.add("active");
}

// Pertemuan
if (pageName.includes("pertemuan")) {
  document.getElementById("nav-pertemuan")?.classList.add("active");
}

// Quiz – dianggap bagian dari pertemuan
if (pageName.includes("quiz")) {
  document.getElementById("nav-pertemuan")?.classList.add("active");
}

// Profil
if (pageName.includes("profil")) {
  document.getElementById("nav-profil")?.classList.add("active");
}