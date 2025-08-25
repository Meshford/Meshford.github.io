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
      document.getElementById('free-course-modal').style.display = 'flex';
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
        // Store courseId and amount in global variables
        window.currentCourseId = courseId;
        window.currentAmount = amount;
        document.getElementById('offer-modal').style.display = 'flex';
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
});