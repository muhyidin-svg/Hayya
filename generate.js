import fs from "fs";
import path from "path";

const __dirname = process.cwd();

// List tema
const temaList = Array.from({ length: 16 }, (_, i) =>
  `t${String(i + 1).padStart(2, "0")}`
);

// Folder root
const ROOT = path.join(__dirname, "assets");

// Struktur yang akan digenerate
const DIRS = [
  "audio/kalimat",
  "audio/kosakata",
  "images/kosakata"
];

console.log("=== MULAI GENERATE FOLDER ===");

DIRS.forEach(mainDir => {
  temaList.forEach(tema => {
    const fullPath = path.join(ROOT, mainDir, tema);

    // buat folder jika belum ada
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log("✓ Folder dibuat:", fullPath);
    } else {
      console.log("• Skip (sudah ada):", fullPath);
    }
  });
});

console.log("=== SELESAI GENERATE ===");