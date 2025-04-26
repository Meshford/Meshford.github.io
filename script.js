// Обработка отправки формы с помощью Formspree
document.getElementById('registration-form').addEventListener('submit', function(e) {
    // Останавливаем стандартное поведение формы
    e.preventDefault();

    // Получаем данные из формы
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;

    // Проверка данных
    if (firstName === '' || lastName === '' || phone === '') {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    // Показать сообщение об успешной регистрации
    alert(`Спасибо за регистрацию, ${firstName}! Мы свяжемся с вами по телефону ${phone}.`);

    // Отправка формы через Formspree
    const form = document.getElementById('registration-form');
    
    // Убедимся, что форма имеет правильный action
    form.action = "https://formspree.io/f/mqaqaddz";  // Замените на ваш реальный URL из Formspree

    // Используем submit() для отправки данных формы
    form.submit();
});
