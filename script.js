document.getElementById('registration-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const phone = document.getElementById('phone').value;

    if (!firstName || !lastName || !phone) {
        alert("Пожалуйста, заполните все поля.");
        return;
    }

    alert(`Спасибо за регистрацию, ${firstName}! Мы свяжемся с вами по телефону ${phone}.`);

    const formData = new FormData(this);
    
    try {
        const response = await fetch("https://formspree.io/f/mqaqaddz", {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Форма успешно отправлена!');
        } else {
            alert('Произошла ошибка при отправке формы.');
        }
    } catch (error) {
        alert('Произошла ошибка.');
    }
});
