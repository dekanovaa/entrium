const slides = document.querySelector('.slides');
let slideEls = document.querySelectorAll('.slide');
const pagination = document.querySelector('.pagination');

let currentIndex = 0;
let slideCount = slideEls.length;
let visibleSlides = 3;
let slideGap = 24;

function updateVisibleSlides() {
  if (window.innerWidth < 600) {
    visibleSlides = 1;
  } else if (window.innerWidth < 900) {
    visibleSlides = 2;
  } else {
    visibleSlides = 3;
  }
}

function getSlideWidth() {
  const slideStyle = window.getComputedStyle(slideEls[0]);
  const width = slideEls[0].offsetWidth;
  const marginRight = parseInt(slideStyle.marginRight) || slideGap;
  return width + marginRight;
}

function createPagination() {
  pagination.innerHTML = "";
  const groupCount = Math.max(slideCount - visibleSlides + 1, 1);
  for (let i = 0; i < groupCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('pagination-dot');
    if (i === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    pagination.appendChild(dot);
  }
}

function goToSlide(index) {
  const slideWidth = getSlideWidth();
  const totalOffset = index * slideWidth;
  slides.style.transform = `translateX(-${totalOffset}px)`;
  document.querySelectorAll('.pagination-dot').forEach(dot => dot.classList.remove('active'));
  if (pagination.children[index]) {
    pagination.children[index].classList.add('active');
  }
  currentIndex = index;
}

function autoplay() {
  const maxIndex = slideCount - visibleSlides;
  currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
  goToSlide(currentIndex);
}

function initSlider() {
  // Har safar yangilab olish
  slideEls = document.querySelectorAll('.slide');
  slideCount = slideEls.length;
  updateVisibleSlides();
  createPagination();
  goToSlide(currentIndex);
}

// Boshlanishda ishga tushirish
initSlider();

// Autoplay
let autoplayInterval = setInterval(autoplay, 3000);

// Responsive qayta hisoblash
window.addEventListener('resize', () => {
  initSlider();
});


// timer
let timerElement = document.getElementById("timer");
let timeInSeconds = 10 * 60; // 10 daqiqa

function updateTimer() {
  let minutes = Math.floor(timeInSeconds / 60);
  let seconds = timeInSeconds % 60;

  timerElement.textContent =
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");

  if (timeInSeconds > 0) {
    timeInSeconds--;
  } else {
    clearInterval(timerInterval);
    timerElement.textContent = "00:00";
    // Shu yerda istasangiz: tugadi degan matn yoki boshqa funksiya qo‘shishingiz mumkin
  }
}

let timerInterval = setInterval(updateTimer, 1000);

