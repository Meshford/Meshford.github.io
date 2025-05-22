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

// === НАСТРОЙКИ JUPYTERHUB ===
const JUPYTERHUB_API_URL = 'https://aistartlab-practice.ru/api/create_user';
const JUPYTERHUB_URL = 'https://aistartlab-practice.ru'; // <-- Укажите адрес вашего JupyterHub

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

// Курсы
const freeCourseBtn = document.getElementById('free-course-btn');
const freeCourseLock = document.getElementById('free-course-lock');
const simplifiedCourse = document.getElementById('simplified-course');
const extendedCourse = document.getElementById('extended-course');
const fullCourse = document.getElementById('full-course');

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
  } catch (error) {
    showToast('Ошибка выхода: ' + error.message);
  }
});

// Управление доступом к курсам
function updateCoursesByRole(role) {
  // Скрыть все курсы кроме бесплатного
  simplifiedCourse.classList.add('hidden-course');
  extendedCourse.classList.add('hidden-course');
  fullCourse.classList.add('hidden-course');

  // Бесплатный курс всегда открыт для всех авторизованных
  freeCourseBtn.disabled = false;
  freeCourseBtn.classList.add('unlocked');
  freeCourseBtn.title = "Перейти к курсу";
  freeCourseLock.textContent = "🔓";
  freeCourseLock.classList.add('unlocked');
  freeCourseLock.title = "Доступ открыт";

  // Открывать курсы по ролям
  if (role === "simple" || role === "admin") {
    simplifiedCourse.classList.remove('hidden-course');
  }
  if (role === "intermediate" || role === "admin") {
    extendedCourse.classList.remove('hidden-course');
  }
  if (role === "full" || role === "admin") {
    fullCourse.classList.remove('hidden-course');
  }
}

// Управление доступом к бесплатному курсу (для неавторизованных и basic)
function updateFreeCourseAccess(isAuthorized, userRole) {
  if (isAuthorized) {
    // Всегда открыт для всех авторизованных
    freeCourseBtn.disabled = false;
    freeCourseBtn.classList.add('unlocked');
    freeCourseBtn.title = "Перейти к курсу";
    freeCourseLock.textContent = "🔓";
    freeCourseLock.classList.add('unlocked');
    freeCourseLock.title = "Доступ открыт";
  } else {
    // Только замок для неавторизованных
    freeCourseBtn.disabled = true;
    freeCourseBtn.classList.remove('unlocked');
    freeCourseBtn.title = "Доступ только для зарегистрированных";
    freeCourseLock.textContent = "🔒";
    freeCourseLock.classList.remove('unlocked');
    freeCourseLock.title = "Доступ только для зарегистрированных";
  }
  // Скрыть все остальные курсы для неавторизованных и basic
  simplifiedCourse.classList.add('hidden-course');
  extendedCourse.classList.add('hidden-course');
  fullCourse.classList.add('hidden-course');
}

// === ИНТЕГРАЦИЯ С JUPYTERHUB для бесплатного курса ===
freeCourseBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    showToast('Пожалуйста, войдите в аккаунт');
    return;
  }

  try {
    // 1. Получаем роль пользователя из Firestore
    const userDocRef = doc(db, "allowed_users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists() || userDocSnap.data().role !== "basic") {
      showToast('У вас нет доступа к этому курсу');
      return;
    }

    // 2. Формируем имя пользователя для JupyterHub
    const jhubUsername = user.email.replace(/[^a-zA-Z0-9]/g, '_');
    const jhubPassword = user.uid;

    // 3. Получаем _xsrf из HTML страницы
    const loginPageResponse = await fetch('https://aistartlab-practice.ru/hub/login ', {
      method: 'GET',
      credentials: 'include',
      redirect: 'manual'  // ❗ ВАЖНО: предотвращает редирект
    });

    const html = await loginPageResponse.text();
    const xsrfMatch = html.match(/name="_xsrf" value="([^"]+)"/);
    const xsrfToken = xsrfMatch ? xsrfMatch[1] : null;

    if (!xsrfToken) {
      throw new Error("Не удалось получить _xsrf из HTML");
    }

    // 4. Отправляем запрос на создание пользователя
    const createUserResponse = await fetch(JUPYTERHUB_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: jhubUsername, 
        password: jhubPassword, 
        role: 'basic',
        _xsrf: xsrfToken  // ✅ Передаём в теле
      }),
      credentials: 'include'
    });

    const userData = await createUserResponse.json();
    if (!createUserResponse.ok || userData.status !== 'ok') {
      showToast('Ошибка создания пользователя в JupyterHub');
      return;
    }

    // 5. Запрашиваем токен через наш прокси API
    const tokenResponse = await fetch(JUPYTERHUB_API_URL.replace('/create_user', '/get_jhub_token'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: jhubUsername, 
        password: jhubPassword,
        _xsrf: xsrfToken
      }),
      credentials: 'include'
    });

    if (!tokenResponse.ok) {
      throw new Error("Не удалось получить токен");
    }

    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    // 6. Переходим в JupyterHub с токеном
    window.open(`https://aistartlab-practice.ru/user/ ${jhubUsername}/lab?token=${token}`, '_blank');

  } catch (error) {
    showToast(`Ошибка: ${error.message}`);
  }
});

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
      updateCoursesByRole(userRole);
    } catch (e) {
      updateFreeCourseAccess(true, "basic");
      updateCoursesByRole("basic");
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
