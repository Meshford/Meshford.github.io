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

const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastCloseBtn = toast.querySelector('.close-toast');

// Функция показа всплывающего уведомления
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Закрытие уведомления по кнопке
toastCloseBtn.addEventListener('click', () => {
  toast.classList.remove('show');
});

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

// Проверка корректности email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Обработка формы входа
popupAuthForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('popup-email').value.trim();
  const password = document.getElementById('popup-password').value;

  if (!validateEmail(email)) {
    showToast('Некорректный email');
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showToast('Вход выполнен успешно!');
    loginPopup.classList.add('hidden');
  } catch (error) {
    showToast('Ошибка входа: ' + error.message);
  }
});

// Обработка формы регистрации
popupRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const passwordRepeat = document.getElementById('register-password-repeat').value;

  if (!validateEmail(email)) {
    showToast('Некорректный email');
    return;
  }

  if (password !== passwordRepeat) {
    showToast('Пароли не совпадают');
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showToast('Регистрация успешна! Вы вошли в систему.');
    registerPopup.classList.add('hidden');
  } catch (error) {
    showToast('Ошибка регистрации: ' + error.message);
  }
});

// Выход
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    showToast('Вы вышли из аккаунта.');
    // Скрываем меню и показываем кнопку входа
    userMenu.classList.add('hidden');
    loginButton.classList.remove('hidden');
    userDropdown.classList.add('hidden');
  } catch (error) {
    showToast('Ошибка выхода: ' + error.message);
  }
});

// Отслеживание состояния пользователя
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Скрываем кнопку входа
    loginButton.classList.add('hidden');

    // Показываем кнопку с email пользователя
    userMenu.classList.remove('hidden');
    userNameBtn.textContent = user.email;
    userNameBtn.classList.add('profile-user-btn');
    userNameBtn.classList.remove('profile-login-btn');

    // Скрываем меню по умолчанию
    userDropdown.classList.add('hidden');

    // Переключение меню по клику на email
    userNameBtn.onclick = () => {
      userDropdown.classList.toggle('hidden');
    };
  } else {
    // Показываем кнопку входа
    loginButton.classList.remove('hidden');

    // Скрываем меню пользователя
    userMenu.classList.add('hidden');
    userDropdown.classList.add('hidden');

    // Восстанавливаем стиль кнопки входа
    userNameBtn.classList.remove('profile-user-btn');
    userNameBtn.classList.add('profile-login-btn');
    userNameBtn.textContent = '';
  }
});
