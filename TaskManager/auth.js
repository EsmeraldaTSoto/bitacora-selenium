const SESSION_KEY = "bitacora_logged_in";

// Usuario válido "hardcodeado" (no hay backend en este proyecto)
const VALID_USERNAME = "admin";
const VALID_PASSWORD = "admin123";

const MIN_LENGTH = 4;
const MAX_LENGTH = 20;

const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");

function showLoginError(message) {
  loginError.textContent = message;
  loginError.classList.remove("hidden");
}

function clearLoginError() {
  loginError.textContent = "";
  loginError.classList.add("hidden");
}

function validateCredentials(username, password) {
  if (username.trim() === "" || password.trim() === "") {
    return 'Usuario y contraseña son obligatorios.';
  }

  if (username.length < MIN_LENGTH || password.length < MIN_LENGTH) {
    return `Usuario y contraseña deben tener al menos ${MIN_LENGTH} caracteres.`;
  }

  if (username.length > MAX_LENGTH || password.length > MAX_LENGTH) {
    return `Usuario y contraseña no pueden superar los ${MAX_LENGTH} caracteres.`;
  }

  return null;
}

function attemptLogin(username, password) {
  const validationError = validateCredentials(username, password);
  if (validationError) {
    return { success: false, message: validationError };
  }

  if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
    return { success: false, message: "Usuario o contraseña incorrectos." };
  }

  return { success: true };
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    const result = attemptLogin(username, password);

    if (!result.success) {
      showLoginError(result.message);
      return;
    }

    clearLoginError();
    localStorage.setItem(SESSION_KEY, "true");
    window.location.href = "index.html";
  });
}

function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "login.html";
  }
}