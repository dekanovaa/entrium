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
const modal = document.getElementById('modalOverlay');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const myForm = document.getElementById('myForm');
const modalForm = document.getElementById('modalForm');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const uploadArea = document.getElementById('uploadArea');
const errorMessage = document.getElementById('errorMessage');
const submitBtn = document.getElementById('submitBtn');
let formData = {};

// Initialize selected radio option
function updateSelectedRadio() {
  document.querySelectorAll('.radio-option').forEach(option => {
    option.classList.remove('selected');
    if (option.querySelector('.radio-input').checked) {
      option.classList.add('selected');
    }
  });
}

// Set initial selected state
updateSelectedRadio();

// Add event listeners to radio inputs
document.querySelectorAll('.radio-input').forEach(input => {
  input.addEventListener('change', updateSelectedRadio);
});

function openModal() {
  modal.classList.add('show');
  modal.querySelector('input, button').focus();
}

function closeModal() {
  modal.classList.remove('show');
  setTimeout(() => (modal.style.display = 'none'), 300);
}



function displayFiles(files) {
  fileList.innerHTML = '';
  if (files.length > 0) {
    const file = files[0];
    const div = document.createElement('div');
    div.textContent = file.name;
    fileList.appendChild(div);
  }
}

function validateFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    errorMessage.textContent = 'Допустимы только PDF, JPG или PNG файлы.';
    return false;
  }
  if (file.size > maxSize) {
    errorMessage.textContent = 'Файл слишком большой (макс. 5MB).';
    return false;
  }
  errorMessage.textContent = '';
  return true;
}

fileInput.addEventListener('change', () => {
  if (fileInput.files.length > 0 && validateFile(fileInput.files[0])) {
    displayFiles(fileInput.files);
  } else {
    fileInput.value = '';
    fileList.innerHTML = '';
  }
});

uploadArea.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover'].forEach(eventName => {
  uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
  uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && validateFile(file)) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;
    displayFiles(fileInput.files);
  }
});

function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

myForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (myForm.checkValidity()) {
    formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      region: document.querySelector('input[name="region"]:checked').value
    };
    modal.style.display = 'flex';
    setTimeout(() => openModal(), 10);
    trapFocus(modal);
  } else {
    myForm.reportValidity();
  }
});

modalForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (fileInput.files.length === 0) {
    errorMessage.textContent = 'Пожалуйста, загрузите чек оплаты.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  const googleFormUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSch-54C8BzCVP74nBGRCtBfSusb_ACGuDDHF_g0GQyC10QTKA/formResponse';
  const formDataToSend = new FormData();
  formDataToSend.append('entry.425806587', formData.name);
  formDataToSend.append('entry.1625887631', formData.phone);
  formDataToSend.append('entry.1370774814', formData.region);
  formDataToSend.append('entry.813980677', fileInput.files[0].name);

  try {
    console.log('Submitting to Google Form:', Object.fromEntries(formDataToSend));
    await fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: formDataToSend
    });
    setTimeout(() => {
      window.location.href = './thankYou.html';
    }, 1000);
  } catch (error) {
    console.error('Error submitting to Google Form:', error);
    errorMessage.textContent = 'Ошибка при отправке формы. Пожалуйста, попробуйте снова.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить чек и подтвердить';
  }
});

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});