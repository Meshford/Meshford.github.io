import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    updateProfile
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

// Элементы для уведомления о неподтвержденном email
const unverifiedEmailBanner = document.getElementById('unverified-email-banner');
const resendVerificationBtn = document.getElementById('resend-verification');

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
  }, 8000);
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

  if (password.length < 6) {
    showToast('Пароль должен содержать не менее 6 символов');
    return;
  }

  try {
    // 1. Регистрируем пользователя в Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Отправляем письмо для подтверждения email
    await sendEmailVerification(user, {
      url: 'https://aistartlab.ru/profile.html',
      handleCodeInApp: true
    });



    showToast('Регистрация почти завершена! Проверьте ваш email для подтверждения адреса');
    registerPopup.classList.add('hidden');
    
    // Обновляем UI для отображения баннера о неподтвержденном email
    if (unverifiedEmailBanner) {
      unverifiedEmailBanner.classList.remove('hidden');
    }
  } catch (error) {
    showToast('Ошибка регистрации: ' + error.message);
  }
});

// Повторная отправка письма с подтверждением
if (resendVerificationBtn) {
  resendVerificationBtn.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user, {
          url: window.location.origin + '/profile.html',
          handleCodeInApp: true
        });
        showToast('Письмо для подтверждения отправлено повторно');
      } catch (error) {
        showToast('Ошибка отправки письма: ' + error.message);
      }
    } else if (user && user.emailVerified) {
      showToast('Ваш email уже подтвержден!');
    }
  });
}

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
function updateFreeCourseAccess(isAuthorized, userRole, emailVerified) {
  if (isAuthorized) {
    if (emailVerified) {
      // Открыт для авторизованных с подтвержденным email
      freeCourseBtn.disabled = false;
      freeCourseBtn.classList.add('unlocked');
      freeCourseBtn.title = "Перейти к курсу";
      freeCourseLock.textContent = "🔓";
      freeCourseLock.classList.add('unlocked');
      freeCourseLock.title = "Доступ открыт";
      
      // Скрыть баннер о неподтвержденном email
      if (unverifiedEmailBanner) {
        unverifiedEmailBanner.classList.add('hidden');
      }
    } else {
      // Заблокирован для авторизованных с неподтвержденным email
      freeCourseBtn.disabled = true;
      freeCourseBtn.classList.remove('unlocked');
      freeCourseBtn.title = "Подтвердите email для доступа к курсу";
      freeCourseLock.textContent = "🔒";
      freeCourseLock.classList.remove('unlocked');
      freeCourseLock.title = "Подтвердите email для доступа к курсу";
      
      // Показать баннер о неподтвержденном email
      if (unverifiedEmailBanner) {
        unverifiedEmailBanner.classList.remove('hidden');
      }
    }
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

// === ИНТЕГРАЦИЯ С JUPYTERHUB через GitHub OAuth ===
freeCourseBtn.addEventListener('click', async () => {
  const user = auth.currentUser;
  if (!user) {
    showToast('Пожалуйста, войдите в аккаунт');
    return;
  }
  
  if (!user.emailVerified) {
    showToast('Пожалуйста, подтвердите ваш email');
    return;
  }

  try {
    // Перенаправление на GitHub OAuth
    window.open('https://aistartlab-practice.ru/hub/oauth_login',  '_blank');
  } catch (error) {
    showToast(`Ошибка: ${error.message}`);
  }
});

// Отслеживание состояния пользователя
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

    try {
      const userDocRef = doc(db, "allowed_users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let userRole = "basic";
      let emailVerified = user.emailVerified;
      
      // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Если email подтвержден, но пользователя нет в Firestore, добавляем его
      if (user.emailVerified && !userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          role: "basic",
          createdAt: new Date(),
          emailVerified: true
        });
        showToast('Регистрация завершена! Добро пожаловать!');
      }
      
      // Если пользователь существует в Firestore, используем данные оттуда
      if (userDocSnap.exists()) {
        if (userDocSnap.data().role) {
          userRole = userDocSnap.data().role;
        }
        if (userDocSnap.data().emailVerified !== undefined) {
          emailVerified = userDocSnap.data().emailVerified;
        }
      }
      
      // Обновляем статус emailVerified на основе Firebase Auth, если нет данных в Firestore
      if (!userDocSnap.exists()) {
        emailVerified = user.emailVerified;
      }
      
      // Если email не подтвержден, показываем уведомление
      if (!emailVerified) {
        showToast('Пожалуйста, подтвердите ваш email для завершения регистрации');
      }
      
      updateFreeCourseAccess(true, userRole, emailVerified);
      updateCoursesByRole(userRole);
    } catch (e) {
      console.error('Error in auth state change:', e);
      updateFreeCourseAccess(true, "basic", user.emailVerified);
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

    updateFreeCourseAccess(false, null, false);
  }
});