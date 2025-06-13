
// FAQ
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const isVisible = answer.classList.contains('active');

    document.querySelectorAll('.faq-answer').forEach(a => {
      a.classList.remove('active');
      a.style.overflow = 'hidden'; // скрываем все ответы
      a.style.maxHeight = null;
    });

    if (!isVisible) {
      answer.classList.add('active');
      answer.style.overflow = 'visible'; // показываем текущий ответ
      answer.style.maxHeight = answer.scrollHeight + 'px';
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

// Закрытие модальных окон при клике вне контента
window.addEventListener('click', (e) => {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});