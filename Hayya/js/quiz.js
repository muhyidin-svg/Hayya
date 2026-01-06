const optionsEl = document.getElementById("options");
const checkBtn = document.getElementById("checkBtn");
const playAudioBtn = document.getElementById("play-audio");

let currentIndex = 0;
let selected = null;

function renderQuestion() {
  const current = mufrodat[currentIndex];
  optionsEl.innerHTML = "";

  mufrodat.forEach(item => {
    const img = document.createElement("img");
    img.src = item.image;
    img.onclick = () => {
      document.querySelectorAll("img").forEach(i => i.classList.remove("selected"));
      img.classList.add("selected");
      selected = item;
      checkBtn.disabled = false;
    };
    optionsEl.appendChild(img);
  });

  playAudioBtn.onclick = () => {
    new Audio(current.audio).play();
  };
}

checkBtn.onclick = () => {
  const current = mufrodat[currentIndex];
  if (!selected) return;

  alert(selected.id === current.id ? "BENAR" : "SALAH");
  selected = null;
  checkBtn.disabled = true;

  currentIndex++;
  if (currentIndex < mufrodat.length) {
    renderQuestion();
  } else {
    alert("Soal selesai");
  }
};

renderQuestion();
