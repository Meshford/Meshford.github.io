// Импорт Firebase SDK (если подключаете через <script type="module"> в HTML)
// Если используете обычный <script>, подключите Firebase SDK в HTML и уберите import из JS

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getFirestore, doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

// Ваш конфиг Firebase (замените на свой из консоли Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyB2KpF2HDbDcB6D1P8MU6wGcnAdHCvFxcg",
  authDomain: "ai-start-lab-1ee12.firebaseapp.com",
  projectId: "ai-start-lab-1ee12",
  storageBucket: "ai-start-lab-1ee12.firebasestorage.app",
  messagingSenderId: "489390775494",
  appId: "1:489390775494:web:97531e4b7ab542b2930bc7",
  measurementId: "G-NZNHV0Q18C"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Обработчик отправки формы регистрации
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

  // Для Firebase Authentication нужен email и пароль, но в вашей форме их нет.
  // Предлагаю использовать телефон как email с фиктивным доменом (например, phone@aistartlab.ru)
  // И сгенерировать временный пароль или запросить пароль отдельно.
  // Для примера ниже создадим email из телефона и пароль по умолчанию.

  const email = phone.replace(/\D/g, '') + '@aistartlab.ru'; // Например, +7(915)951-24-54 → 79159512454@aistartlab.ru
  const password = 'defaultPassword123'; // Рекомендуется сделать отдельное поле для пароля!

  try {
    // Создаём пользователя в Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Сохраняем дополнительные данные пользователя в Firestore
    await setDoc(doc(db, 'users', user.uid), {
      firstName,
      lastName,
      phone,
      email,
      createdAt: new Date()
    });

    alert(`Спасибо за регистрацию, ${firstName}! Ваш аккаунт создан.`);

    this.reset();

  } catch (error) {
    // Обработка ошибок Firebase (например, пользователь уже существует)
    alert(`Ошибка регистрации: ${error.message}`);
    console.error(error);
  }
});
