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
    const response = await fetch('https://aistartlab-practice.ru/api/init-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, amount })
    });
    
    const data = await response.json();
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl; // Redirect to payment form
    } else {
      alert('Ошибка при инициации платежа: ' + (data.message || 'Неизвестная ошибка'));
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при инициации платежа');
  }
}

// Ensure DOM is loaded before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    
    // Free course card click handler
    const freeCourseCard = document.querySelector('.free-course');
    if (freeCourseCard) {
      freeCourseCard.addEventListener('click', () => {
        document.getElementById('free-course-modal').style.display = 'flex';
      });
    }
  });
} else {
  initFAQ();
  
  // Free course card click handler
  const freeCourseCard = document.querySelector('.free-course');
  if (freeCourseCard) {
    freeCourseCard.addEventListener('click', () => {
      document.getElementById('free-course-modal').style.display = 'flex';
    });
  }
}

// Close modals when clicking outside content
window.addEventListener('click', (e) => {
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

// Close offer modal when clicking outside
window.addEventListener('click', (e) => {
  const offerModal = document.getElementById('offer-modal');
  if (offerModal && e.target === offerModal) {
    offerModal.style.display = 'none';
  }
});