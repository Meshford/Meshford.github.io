import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

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
const db = getFirestore(app);

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

// Бесплатный курс
const freeCourseBtn = document.getElementById('free-course-btn');
const freeCourseLock = document.getElementById('free-course-lock');

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

// Функция открытия окна входа
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
        // 1. Регистрируем пользователя в Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Добавляем пользователя в Firestore с ролью "basic"
        await setDoc(doc(db, "allowed_users", user.uid), {
            email: user.email,
            role: "basic",
            createdAt: new Date()
        });

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
        // Состояние обновится через onAuthStateChanged
    } catch (error) {
        showToast('Ошибка выхода: ' + error.message);
    }
});

// Управление доступом к бесплатному курсу
function updateFreeCourseAccess(isAuthorized, userRole) {
  if (isAuthorized && userRole === 'basic') {
    freeCourseBtn.disabled = false;
    freeCourseBtn.classList.add('unlocked');
    freeCourseBtn.title = "Перейти к курсу";
    freeCourseLock.textContent = "🔓";
    freeCourseLock.classList.add('unlocked');
    freeCourseLock.title = "Доступ открыт";
  } else {
    freeCourseBtn.disabled = true;
    freeCourseBtn.classList.remove('unlocked');
    freeCourseBtn.title = "Доступ только для зарегистрированных";
    freeCourseLock.textContent = "🔒";
    freeCourseLock.classList.remove('unlocked');
    freeCourseLock.title = "Доступ только для зарегистрированных";
  }
}

// Отслеживание состояния пользователя
onAuthStateChanged(auth, async (user) => {
      if (user) {
        loginButton.classList.add('hidden');
        loginButton.style.display = 'none';
        loginButton.setAttribute('aria-hidden', 'true');

        userMenu.classList.remove('hidden');
        userMenu.style.display = 'flex';
        userMenu.setAttribute('aria-hidden', 'false');
        userNameBtn.textContent = user.email;
        userDropdown.classList.add('hidden');
        userNameBtn.onclick = () => {
            userDropdown.classList.toggle('hidden');
        };

      // Получаем роль пользователя из Firestore
      try {
        const userDocRef = doc(db, "allowed_users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let userRole = "basic";
        if (userDocSnap.exists() && userDocSnap.data().role) {
          userRole = userDocSnap.data().role;
        }
        updateFreeCourseAccess(true, userRole);
      } catch (e) {
        updateFreeCourseAccess(true, "basic");
      }
    } else {
        loginButton.classList.remove('hidden');
        loginButton.style.display = 'inline-block';
        loginButton.setAttribute('aria-hidden', 'false');

        userMenu.classList.add('hidden');
        userMenu.style.display = 'none';
        userMenu.setAttribute('aria-hidden', 'true');
        userDropdown.classList.add('hidden');
        userNameBtn.textContent = '';
        updateFreeCourseAccess(false, null);
    }
});
