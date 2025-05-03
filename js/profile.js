import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';

// Ваш Firebase конфиг
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
const closeLoginBtn = document.getElementById('close-login');
const popupAuthForm = document.getElementById('popup-auth-form');
const popupRegisterForm = document.getElementById('popup-register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');

// Управление попапом
function toggleLoginPopup(show = true) {
  if (show) {
    loginPopup.classList.remove('hidden');
    showLoginForm();
  } else {
    loginPopup.classList.add('hidden');
  }
}

function showLoginForm() {
  popupAuthForm.classList.remove('hidden');
  popupRegisterForm.classList.add('hidden');
  showLoginBtn.classList.add('hidden');
  showRegisterBtn.classList.remove('hidden');
}

function showRegisterForm() {
  popupAuthForm.classList.add('hidden');
  popupRegisterForm.classList.remove('hidden');
  showLoginBtn.classList.remove('hidden');
  showRegisterBtn.classList.add('hidden');
}

showRegisterBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showRegisterForm();
});
showLoginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  showLoginForm();
});

loginButton.addEventListener('click', () => toggleLoginPopup(true));
closeLoginBtn.addEventListener('click', () => toggleLoginPopup(false));
window.addEventListener('click', (e) => {
  if (e.target === loginPopup) toggleLoginPopup(false);
});

// Регистрация
popupRegisterForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('Регистрация успешна! Вы вошли в систему.');
    toggleLoginPopup(false);
  } catch (error) {
    alert('Ошибка регистрации: ' + error.message);
  }
});

// Вход
popupAuthForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('popup-email').value.trim();
  const password = document.getElementById('popup-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Вход выполнен успешно!');
    toggleLoginPopup(false);
  } catch (error) {
    alert('Ошибка входа: ' + error.message);
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
