const items = document.getElementById("items");
const status = document.getElementById("status");
const next = document.getElementById("next");
const check = document.getElementById("check");
const correct = items.dataset.correct || "map";
const reward = items.dataset.reward || "";
let solved = false;

function selectedChoice() {
  const picked = items.querySelector(".item.picked, .trail.picked");
  return picked ? picked.dataset.choice : "";
}

function unlockNext() {
  next.classList.remove("is-disabled");
  next.removeAttribute("aria-disabled");
}

function fillMarks(marks) {
  const layer = document.getElementById("tracks");
  if (!layer) return;
  layer.hidden = false;
  layer.innerHTML = "";
  for (let i = 0; i < 26; i += 1) {
    const mark = document.createElement("span");
    const src = marks[i % marks.length];
    if (src.startsWith("images/")) {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.style.width = 42 + Math.random() * 46 + "px";
      img.style.transform = "rotate(" + (Math.random() * 50 - 25) + "deg)";
      mark.appendChild(img);
    } else {
      mark.textContent = src;
      mark.style.fontSize = 16 + Math.random() * 12 + "px";
    }
    mark.style.left = 4 + Math.random() * 88 + "%";
    mark.style.top = 6 + Math.random() * 82 + "%";
    mark.style.animationDelay = Math.random() * 2.4 + "s";
    mark.style.animationDuration = 1.6 + Math.random() * 1.6 + "s";
    layer.appendChild(mark);
  }
}

items.addEventListener("click", (event) => {
  if (solved) return;
  const button = event.target.closest(".item, .trail");
  if (!button) return;
  items.querySelectorAll(".item, .trail").forEach((item) => item.classList.remove("picked"));
  button.classList.add("picked");
  if (status) {
    status.hidden = true;
    status.textContent = "";
  }
  if (!check && button.dataset.choice === correct) {
    solved = true;
    unlockNext();
    if (reward === "spiders") fillMarks(["🕷️"]);
  } else if (!check) {
    next.classList.add("is-disabled");
    next.setAttribute("aria-disabled", "true");
  }
});

if (check) {
  check.addEventListener("click", () => {
    if (solved) return;
    if (selectedChoice() !== correct) {
      status.hidden = false;
      status.textContent = "Шлях не відкрився. Спробуй ще раз";
      status.className = "status bad";
      return;
    }
    solved = true;
    status.hidden = false;
    status.textContent = "Вірно.";
    status.className = "status good";
    check.disabled = true;
    if (reward === "spiders") fillMarks(["🕷️"]);
    unlockNext();
  });
}

next.addEventListener("click", (event) => {
  if (next.classList.contains("is-disabled")) event.preventDefault();
});
