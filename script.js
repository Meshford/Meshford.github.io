// Импорт Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

// Firebase конфигурация
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

// ===== ФОРМА РЕГИСТРАЦИИ =====
const registrationForm = document.getElementById('registration-form');
if (registrationForm) {
  registrationForm.addEventListener('submit', async function(e) {
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

    const email = phone.replace(/\D/g, '') + '@aistartlab.ru';
    const password = 'defaultPassword123'; // В будущем можно запросить отдельно

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

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
      alert(`Ошибка регистрации: ${error.message}`);
      console.error(error);
    }
  });
}

// ===== ФОРМА ВХОДА =====
const loginPopup = document.getElementById("login-popup");
const loginBtn = document.getElementById("login-btn");
const closeLoginBtn = document.getElementById("close-login");
const loginSubmitBtn = document.getElementById("submit-login");

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    loginPopup.style.display = "block";
  });
}

if (closeLoginBtn) {
  closeLoginBtn.addEventListener("click", () => {
    loginPopup.style.display = "none";
  });
}

window.addEventListener("click", (event) => {
  if (event.target === loginPopup) {
    loginPopup.style.display = "none";
  }
});

if (loginSubmitBtn) {
  loginSubmitBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Пожалуйста, введите email и пароль.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("Успешный вход! Добро пожаловать, " + user.email);
      loginPopup.style.display = "none";
      window.location.href = "profile.html";
    } catch (error) {
      alert("Ошибка входа: " + error.message);
    }
  });
}
