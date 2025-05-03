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
