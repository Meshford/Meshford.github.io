import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

// Firebase конфиг и инициализация
const firebaseConfig = {
  apiKey: "AIzaSyB2KpF2HDbDcB6D1P8MU6wGcnAdHCvFxcg",
  authDomain: "ai-start-lab-1ee12.firebaseapp.com",
  projectId: "ai-start-lab-1ee12",
  storageBucket: "ai-start-lab-1ee12.appspot.com",
  messagingSenderId: "489390775494",
  appId: "1:489390775494:web:97531e4b7ab542b2930bc7",
  measurementId: "G-NZNHV0Q18C"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM элементы
const loginButton = document.getElementById('login-button');
const userMenu = document.getElementById('user-menu');
const userNameBtn = document.getElementById('user-name-btn');
const userDropdown = document.getElementById('user-dropdown');
const logoutBtn = document.getElementById('logout-btn');

const loginPopup = document.getElementById('login-popup');
const registerPopup = document.getElementById('register-popup');

const closeLoginBtn = document.getElementById('close-login');
const closeRegisterBtn = document.getElementById('close-register');

const popupAuthForm = document.getElementById('popup-auth-form');
const popupRegisterForm = document.getElementById('popup-register-form');

const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

// Открыть окно входа
loginButton.addEventListener('click', () => {
  showLoginPopup();
});

// Закрыть окна
closeLoginBtn.addEventListener('click', () => {
  loginPopup.classList.add('hidden');
});
closeRegisterBtn.addEventListener('click', () => {
  registerPopup.classList.add('hidden');
});

// Переключение между окнами
showRegisterBtn.addEventListener('click', () => {
  loginPopup.classList.add('hidden');
  registerPopup.classList.remove('hidden');
});

showLoginBtn.addEventListener('click', () => {
  registerPopup.classList.add('hidden');
  loginPopup.classList.remove('hidden');
});

// Закрыть при клике вне контента
window.addEventListener('click', (e) => {
  if (e.target === loginPopup) loginPopup.classList.add('hidden');
  if (e.target === registerPopup) registerPopup.classList.add('hidden');
});

// Функции открытия окон
function showLoginPopup() {
  loginPopup.classList.remove('hidden');
  registerPopup.classList.add('hidden');
}

// Обработка формы входа
popupAuthForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('popup-email').value.trim();
  const password = document.getElementById('popup-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Вход выполнен успешно!');
    loginPopup.classList.add('hidden');
  } catch (error) {
    alert('Ошибка входа: ' + error.message);
  }
});

// Обработка формы регистрации
popupRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('Регистрация успешна! Вы вошли в систему.');
    registerPopup.classList.add('hidden');
  } catch (error) {
    alert('Ошибка регистрации: ' + error.message);
  }
});

// Выход
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('Вы вышли из аккаунта.');
  } catch (error) {
    alert('Ошибка выхода: ' + error.message);
  }
});

// Отслеживание состояния пользователя
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginButton.classList.add('hidden');
    userMenu.classList.remove('hidden');
    userNameBtn.textContent = user.email;
    userDropdown.classList.add('hidden');

    userNameBtn.onclick = () => {
      userDropdown.classList.toggle('hidden');
    };
  } else {
    loginButton.classList.remove('hidden');
    userMenu.classList.add('hidden');
    userDropdown.classList.add('hidden');
  }
});
