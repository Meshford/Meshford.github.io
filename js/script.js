// FAQ
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const isVisible = answer.classList.contains('active');
      
      // Скрыть все ответы
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.classList.remove('active');
        a.style.maxHeight = null;
      });
      
      // Показать текущий ответ, если он был скрыт
      if (!isVisible) {
        answer.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// Убедитесь, что DOM загружен
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFAQ);
} else {
  initFAQ();
}

// Добавьте в script.js
document.addEventListener('DOMContentLoaded', function() {
  const freeCourseCard = document.querySelector('.free-course');
  if (freeCourseCard) {
    freeCourseCard.addEventListener('click', function() {
      document.getElementById('free-course-modal').style.display = 'flex';
    });
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
