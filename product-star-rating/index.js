let ratings = [0, 0, 0, 0, 0];
let totalRatings = 0;

function updatingResults() {
  for (let i = 0; i < 5; i++) {
    const percentage = totalRatings > 0 ? (ratings[i] / totalRatings) * 100 : 0;

    const fillElement = document.getElementById(`fill-${i + 1}`);
    const percentageElement = document.getElementById(`percentage-${i + 1}`);
    const countElement = document.getElementById(`count-${i + 1}`);

    fillElement.style.width = `${percentage}%`;
    percentageElement.textContent = `${Math.round(percentage)}%`;
    countElement.textContent = `(${ratings[i]} vote${
      ratings[i] === 1 ? "" : "s"
    })`;
  }
}

function highlightOnlyClickedStar(rating) {
  const stars = document.querySelectorAll("#stars button");
  stars.forEach((star, index) => {
    if (index === rating - 1) {
      star.classList.add("selected");
      star.textContent = "★";
    } else {
      star.classList.remove("selected");
      star.textContent = "☆";
    }
  });
}

function handleStarClick(event) {
  const rating = parseInt(event.target.dataset.rating);
  ratings[rating - 1] += 1;
  totalRatings += 1;
  highlightOnlyClickedStar(rating);
  updatingResults();
}

const stars = document.querySelectorAll("#stars button");
stars.forEach((star) => {
  star.addEventListener("click", handleStarClick);
});
