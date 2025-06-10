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



// form
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
fileInput.addEventListener('change', () => {
  fileList.innerHTML = '';
  Array.from(fileInput.files).forEach(file => {
    const div = document.createElement('div');
    div.textContent = file.name;
    fileList.appendChild(div);
  });
});
// Form yuborish
const modalForm = document.getElementById('modalForm');
modalForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const region = document.querySelector('input[name="region"]:checked').value;
  const file = fileInput.files[0];

  if (!file) {
    alert('Iltimos, chekni yuklang!');
    return;
  }

  // Google Formga ma'lumot yuborish
  const formData = new FormData();
  formData.append('entry.425806587', name); // O'zingizning entry ID bilan almashtiring
  formData.append('entry.1625887631', phone); // O'zingizning entry ID bilan almashtiring
  formData.append('entry.1370774814', region); // O'zingizning entry ID bilan almashtiring

  try {
    // Matnli ma'lumotlarni yuborish
    await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSch-54C8BzCVP74nBGRCtBfSusb_ACGuDDHF_g0GQyC10QTKA/formResponse', {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    });

    // Faylni Google Drive y'a yuborish uchun Google API ishlatish kerak,
    // lekin bu yerda Google Forms file upload qo'llab-quvvatlaydi
    const fileFormData = new FormData();
    fileFormData.append('entry.813980677', file); // Fayl uchun entry ID
    await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSch-54C8BzCVP74nBGRCtBfSusb_ACGuDDHF_g0GQyC10QTKA/formResponse', {
      method: 'POST',
      body: fileFormData,
      mode: 'no-cors'
    });

    // Muvaffaqiyatli yuborilgandan so'ng
    window.location.href = 'thankYou.html';
  } catch (error) {
    console.error('Xato:', error);
    alert('Malumotlarni yuborishda xato yuz berdi.');
  }
});