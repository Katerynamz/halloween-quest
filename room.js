const form = document.getElementById("answer-form");
const input = document.getElementById("code");
const status = document.getElementById("status");
const next = document.getElementById("next");
const stars = document.getElementById("stars");
const hint = document.getElementById("hint");
const list = document.getElementById("collected-list");
const answers = (form.dataset.answers || "").split(",").map((item) => item.trim());
const HINT = (hint && hint.textContent.trim()) || form.dataset.hint || "";
let solved = false;

function normalize(value) {
  return value.trim().toLowerCase().replace(/[.!?…]+$/g, "");
}

function readHints() {
  try {
    return JSON.parse(sessionStorage.getItem("questHints") || "[]");
  } catch {
    return [];
  }
}

function renderHints() {
  if (!list) return;
  const hints = readHints();
  list.innerHTML = hints.length
    ? hints.map((item) => `<li>${item}</li>`).join("")
    : "<li class='empty'>поки порожньо</li>";
}

function saveHint() {
  if (!HINT) return;
  const hints = readHints();
  if (!hints.includes(HINT)) hints.push(HINT);
  sessionStorage.setItem("questHints", JSON.stringify(hints));
  renderHints();
}

function showStars() {
  if (!stars || !stars.hidden) return;
  stars.hidden = false;
  for (let i = 0; i < 42; i += 1) {
    const star = document.createElement("span");
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 1.2 + "s";
    stars.appendChild(star);
  }
}

function openChest() {
  const chest = document.getElementById("chest");
  if (!chest) return;
  chest.hidden = false;
  chest.classList.add("is-open");
  if (next) next.hidden = false;
}

function unlockNext() {
  if (!next) return;
  next.classList.remove("is-disabled");
  next.removeAttribute("aria-disabled");
}

renderHints();

if (next) {
  next.addEventListener("click", (event) => {
    if (next.classList.contains("is-disabled")) event.preventDefault();
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (solved) return;
  const answer = normalize(input.value);
  const ok = answers.includes(answer);
  status.hidden = false;

  if (ok) {
    solved = true;
    if (form.dataset.success === "chest") {
      status.hidden = true;
      status.textContent = "";
    } else {
      status.hidden = false;
      status.textContent = form.dataset.ok || "Двері відчиняються.";
      status.className = "status good";
    }
    if (HINT && hint) {
      hint.textContent = HINT;
      hint.hidden = false;
      saveHint();
    }
    if (form.dataset.success === "chest") openChest();
    else if (stars) showStars();
    if (form.dataset.redirect) {
      setTimeout(() => { window.location.href = form.dataset.redirect; }, 1200);
    } else {
      unlockNext();
    }
    input.disabled = true;
    return;
  }

  status.textContent = "Невірно. Спробуй ще раз.";
  status.className = "status bad";
  input.value = "";
  input.focus();
});
