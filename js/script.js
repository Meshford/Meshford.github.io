
// FAQ
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const isVisible = answer.style.display === 'block';
    
    // Скрыть все ответы
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    
    // Показать текущий ответ, если он был скрыт
    if (!isVisible) {
      answer.style.display = 'block';
    }
  });
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

// FAQ accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const isOpen = answer.style.display === 'block';
    
    // Закрыть все ответы
    document.querySelectorAll('.faq-answer').forEach(a => a.style.display = 'none');
    
    // Открыть текущий, если он был закрыт
    if (!isOpen) {
      answer.style.display = 'block';
    }
  });
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