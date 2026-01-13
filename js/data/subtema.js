/**
 * subtema.js (AUTO GENERATOR)
 * ------------------------------------------------------
 * Fungsi:
 * - Menghasilkan daftar subtema untuk 16 Tema
 * - Setiap Tema memiliki 10 subtema:
 *
 *   1. Mufrodat A
 *   2. Mufrodat B
 *   3. Hiwar A
 *   4. Hiwar B
 *   5. Kaidah A
 *   6. Kaidah B
 *   7. Qira'ah A
 *   8. Qira'ah B
 *   9. Kitabah A
 *  10. Kitabah B
 *
 * Catatan:
 * - Nomor subtema naik sesuai tema.
 *   Tema 1 → 1–2
 *   Tema 2 → 3–4
 *   Tema 3 → 5–6
 *   ...
 *   Tema 16 → 31–32
 *
 * Output:
 * subtemaData = {
 *   t01: [ {id:"st01", nama:"Mufrodat 1"}, ... ],
 *   t02: [ ... ],
 *   ...
 *   t16: [ ... ]
 * }
 */

export const subtemaData = {};

/**
 * Generate 10 subtema untuk satu Tema
 * @param {number} themeIndex - (1–16)
 */
function generateSubtemaForTema(themeIndex) {
  // Nomor urutan subtema yg naik 2 setiap tema
  const start = (themeIndex - 1) * 2 + 1;
  const A = start;
  const B = start + 1;

  return [
    { id: "st01", nama: `Mufrodat ${A}` },
    { id: "st02", nama: `Mufrodat ${B}` },

    { id: "st03", nama: `Hiwar ${A}` },
    { id: "st04", nama: `Hiwar ${B}` },

    { id: "st05", nama: `Kaidah ${A}` },
    { id: "st06", nama: `Kaidah ${B}` },

    { id: "st07", nama: `Qira'ah ${A}` },
    { id: "st08", nama: `Qira'ah ${B}` },

    { id: "st09", nama: `Kitabah ${A}` },
    { id: "st10", nama: `Kitabah ${B}` }
  ];
}

/**
 * Generate otomatis untuk semua Tema (t01 – t16)
 */
for (let i = 1; i <= 16; i++) {
  const temaId = `t${String(i).padStart(2, "0")}`;
  subtemaData[temaId] = generateSubtemaForTema(i);
}

// Debug opsional:
// console.log("SUBTEMA GENERATED:", subtemaData);