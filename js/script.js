// FAQ functionality
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isVisible = answer.classList.contains('active');
      // Hide all answers
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.classList.remove('active');
        a.style.maxHeight = null;
      });
      // Show current answer if it was hidden
      if (!isVisible) {
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}
// Payment initiation function
async function initPayment(courseId, amount) {
  try {
    // ИСПРАВЛЕНО: Убраны лишние пробелы в URL
    const response = await fetch('https://aistartlab-practice.ru/api/init-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, amount })
    });
    const data = await response.json();
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl; // Redirect to payment form
    } else {
      console.log(data); // Debug API response
      alert('Ошибка при инициации платежа: ' + (data.message || 'Неизвестная ошибка'));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при инициации платежа');
  }
}
// Функции для оферты
function declineOffer() {
  document.getElementById('offer-modal').style.display = 'none';
}
function acceptOffer() {
  document.getElementById('offer-modal').style.display = 'none';
  // ИСПРАВЛЕНО: Используем глобальные переменные из этого же файла
  initPayment(window.currentCourseId, window.currentAmount);
}

// ===== НОВЫЙ КОД ДЛЯ АВТОРИЗАЦИИ =====

// Инициализация Firebase
let firebaseAuth = null;
if (typeof firebase !== 'undefined') {
    const firebaseConfig = {
        apiKey: "AIzaSyB2KpF2HDbDcB6D1P8MU6wGcnAdHCvFxcg",
        authDomain: "ai-start-lab-1ee12.firebaseapp.com",
        projectId: "ai-start-lab-1ee12",
        storageBucket: "ai-start-lab-1ee12.appspot.com",
        messagingSenderId: "489390775494",
        appId: "1:489390775494:web:97531e4b7ab542b2930bc7",
        measurementId: "G-NZNHV0Q18C"
    };
    
    try {
        firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Error initializing Firebase:', error);
    }
} else {
    console.warn('Firebase SDK not loaded. Authentication features will be limited.');
}

// Функция показа всплывающего уведомления
function showToast(message) {
    // Проверяем, существует ли уже тост
    let toast = document.getElementById('main-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'main-toast';
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-message" id="main-toast-message"></div>
            <button class="close-toast">&times;</button>
        `;
        document.body.appendChild(toast);
        
        // Обработчик закрытия
        toast.querySelector('.close-toast').addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }
    
    // Устанавливаем сообщение и показываем
    document.getElementById('main-toast-message').textContent = message;
    toast.classList.add('show');
    
    // Автоматическое закрытие через 4 секунды
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Функция обновления UI в зависимости от состояния аутентификации
function updateUI(user) {
    const profileBtn = document.querySelector('.profile-btn');
    if (!profileBtn) return;
    
    if (user) {
        // Пользователь авторизован
        // Заменяем кнопку "Профиль" на аватар-ссылку
        if (!document.querySelector('.profile-avatar')) {
            const avatarLink = document.createElement('a');
            avatarLink.href = 'profile.html';
            avatarLink.className = 'profile-avatar';
            avatarLink.setAttribute('aria-label', 'Профиль пользователя');
            
            const avatar = document.createElement('div');
            avatar.className = 'avatar';
            avatar.setAttribute('aria-hidden', 'true');
            
            const letter = document.createElement('span');
            letter.className = 'avatar-letter';
            letter.textContent = user.email ? user.email[0].toUpperCase() : 'U';
            
            avatar.appendChild(letter);
            avatarLink.appendChild(avatar);
            
            profileBtn.replaceWith(avatarLink);
        }
    } else {
        // Пользователь не авторизован
        // Заменяем аватар на кнопку "Профиль", если она была заменена
        const avatar = document.querySelector('.profile-avatar');
        if (avatar) {
            const profileLink = document.createElement('a');
            profileLink.href = 'profile.html';
            profileLink.className = 'profile-btn';
            profileLink.setAttribute('aria-label', 'Профиль пользователя');
            profileLink.textContent = 'Профиль';
            
            avatar.replaceWith(profileLink);
        }
    }
}

// ===== КОНЕЦ НОВОГО КОДА =====

// Сделаем функции доступными глобально
window.initFAQ = initFAQ;
window.initPayment = initPayment;
window.declineOffer = declineOffer;
window.acceptOffer = acceptOffer;
// Глобальные переменные для хранения данных курса
window.currentCourseId = '';
window.currentAmount = '';
// Ensure DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  // Burger menu functionality
  const burgerMenu = document.querySelector('.burger-menu');
  if (burgerMenu) {
    burgerMenu.addEventListener('click', function() {
      const nav = document.querySelector('.header-bar__nav');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      nav.classList.toggle('active');
    });
  }
  // Free course card click handler
  const freeCourseCard = document.querySelector('.free-course');
  if (freeCourseCard) {
    freeCourseCard.addEventListener('click', () => {
      // Проверяем авторизацию перед открытием бесплатного курса
      if (firebaseAuth && firebaseAuth.currentUser) {
        document.getElementById('free-course-modal').style.display = 'flex';
      } else {
        showToast('Для получения доступа к курсу необходимо войти в профиль');
      }
    });
  }
  
  // Payment button handlers for paid courses
  const payButtons = document.querySelectorAll('.modal-button');
  payButtons.forEach(button => {
    const courseId = button.getAttribute('data-course-id');
    const amount = button.getAttribute('data-amount');
    if (courseId && amount) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Проверяем, авторизован ли пользователь
        if (firebaseAuth && firebaseAuth.currentUser) {
          // Store courseId and amount in global variables
          window.currentCourseId = courseId;
          window.currentAmount = amount;
          document.getElementById('offer-modal').style.display = 'flex';
        } else {
          // Показываем уведомление, что нужно войти
          showToast('Для получения доступа к курсу необходимо войти в профиль');
        }
      });
    }
  });
  // Close modals when clicking outside content
  window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal-overlay, .offer-overlay');
    modals.forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Отслеживаем состояние аутентификации, если Firebase инициализирован
  if (firebaseAuth) {
    firebaseAuth.onAuthStateChanged(function(user) {
        updateUI(user);
    });
  }
});