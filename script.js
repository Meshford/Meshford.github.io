// Обработка формы
document.getElementById('registration-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Получаем данные из формы
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;

    // Отправка формы на почту через AJAX
    const emailContent = `Имя: ${firstName}\nФамилия: ${lastName}\nТелефон: ${phone}`;
    window.location.href = `mailto:super.ya-nikitka-23@ya.ru?subject=Заявка на курс Python&body=${encodeURIComponent(emailContent)}`;

    // Показ уведомления
    alert(`Спасибо за регистрацию, ${firstName}! Мы свяжемся с вами по телефону ${phone}.`);

    // Очистка формы
    document.getElementById('registration-form').reset();
});
