import { createElement, createElements } from "./helper.js";

const starCount = 5;
const smileys = ["😢", "😞", "😐", "😀", "😎"];

let rating = 0;
let filled = 0;
let unfilled = 0;

const starContainer = document.getElementById("star-container");
const smileyContainer = document.getElementById("smiley-container");
const ratingValue = document.getElementById("rating-value");

starContainer.appendChild(
  createElements(
    starCount,
    (i) =>
      createElement("button", { class: "star star-empty", "data-index": i }),
    1
  )
);
const stars = starContainer.querySelectorAll(".star");

starContainer.addEventListener("mouseover", hoverListener);
starContainer.addEventListener("mouseleave", leaveListener);
starContainer.addEventListener("click", clickListener);

function fillStars(count) {
  for (let i = filled; i < count; i++) {
    stars[i].classList.add("star-filled");
    stars[i].classList.remove("star-empty");
  }

  for (let i = count; i < unfilled; i++) {
    stars[i].classList.remove("star-filled");
    stars[i].classList.add("star-empty");
  }

  filled = count;
  unfilled = count;
}

function setRatingValue(value) {
  ratingValue.textContent = `Rating: ${value.toFixed(0)} Star`;
}

function clickListener(event) {
  const target = event.target;
  if (target.classList.contains("star")) {
    rating = +target.dataset.index;
    fillStars(rating);
    setSmiley(rating);
    setRatingValue(rating);
  }
}

function hoverListener(event) {
  const target = event.target;
  if (target.classList.contains("star")) {
    const index = target.dataset.index;
    fillStars(+index);
  }
}

function leaveListener() {
  fillStars(+rating);
}

function setSmiley(rating) {
  const index = Math.ceil((smileys.length * rating) / starCount) - 1;
  smileyContainer.textContent = smileys[index];
}
