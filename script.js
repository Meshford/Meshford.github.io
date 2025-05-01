document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
  
    if (!firstName || !lastName || !phone) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }
  
    // Простая проверка телефона (можно расширить)
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      alert("Пожалуйста, введите корректный номер телефона.");
      return;
    }
  
    alert(`Спасибо за регистрацию, ${firstName}! Мы свяжемся с вами по телефону ${phone}.`);
  
    const formData = new FormData(this);
  
    try {
      const response = await fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        alert('Форма успешно отправлена!');
        this.reset();
      } else {
        alert('Произошла ошибка при отправке формы.');
      }
    } catch (error) {
      alert('Произошла ошибка.');
      console.error(error);
    }
  });
  