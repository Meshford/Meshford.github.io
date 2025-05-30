// Пример: обработка формы регистрации заявки (без Firebase)

document.getElementById('registration-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!firstName || !lastName || !phone) {
    alert("Пожалуйста, заполните все поля.");
    return;
  }

  const phoneRegex = /^[\d\s\+\-\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    alert("Пожалуйста, введите корректный номер телефона.");
    return;
  }

  alert(`Спасибо за регистрацию, ${firstName}! Мы свяжемся с вами по телефону ${phone}.`);

  // Здесь можно добавить отправку данных на сервер или API
});

// Добавьте в script.js
document.addEventListener('DOMContentLoaded', function() {
  const freeCourseCard = document.querySelector('.free-course');
  if (freeCourseCard) {
    freeCourseCard.addEventListener('click', function() {
      document.getElementById('free-course-modal').style.display = 'flex';
    });
  }
});

// Функция смены темы и логотипа
function toggleTheme() {
  const body = document.body;
  const logo = document.querySelector('.header-logo');
  const themeBtn = document.querySelector('.theme-toggle');

  // Переключаем классы тем
  if (body.classList.contains('dark-mode')) {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    logo.src = logo.dataset.lightLogo;
    themeBtn.textContent = '🌙';
  } else {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    logo.src = logo.dataset.darkLogo;
    themeBtn.textContent = '☀️';
  }

  // Сохраняем тему в localStorage
  const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
}

// Загрузка темы при старте
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  const body = document.body;
  const logo = document.querySelector('.header-logo');
  const themeBtn = document.querySelector('.theme-toggle');

  if (savedTheme === 'dark') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    logo.src = logo.dataset.darkLogo;
    themeBtn.textContent = '☀️';
  } else if (savedTheme === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    logo.src = logo.dataset.lightLogo;
    themeBtn.textContent = '🌙';
  } else {
    // Если тема не сохранена — проверяем системную тему
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      body.classList.remove('light-mode');
      body.classList.add('dark-mode');
      logo.src = logo.dataset.darkLogo;
      themeBtn.textContent = '☀️';
    }
  }
});

// Закрытие модальных окон при клике вне контента
window.addEventListener('click', (e) => {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});