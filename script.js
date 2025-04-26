document.getElementById('registration-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Получаем данные формы
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Здесь можно отправить эти данные на сервер, например, через AJAX или хранить их в базе данных
    alert(`Спасибо за регистрацию, ${name}! Мы свяжемся с вами по email: ${email} или телефону: ${phone}.`);

    // Очистка формы
    document.getElementById('registration-form').reset();
});
