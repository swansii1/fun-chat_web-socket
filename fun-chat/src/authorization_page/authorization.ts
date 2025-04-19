import './authoriz_style.css';
import { createHtmlElement } from '../helper';
import { router } from '../router';

// export let user: { login: string; password?: string };
export let ws: WebSocket | null = null;
export let currentUser: { login: string } | null = null;
export let userCredentials: { login: string; password: string };
export let isLoggedOut = false;

export function setLoggedOutStatus(status: boolean) {
  isLoggedOut = status;
}

export const generateId = () => Math.random().toString(36).substring(2, 15);

export function setCurrentUser(user: { login: string } | null) {
  currentUser = user;
}

export function setCredentials(login: string, password: string) {
  userCredentials = { login, password };
  sessionStorage.setItem('userCredentials', JSON.stringify(userCredentials));
  setCurrentUser({ login });
}

export function savedCredentials() {
  const stored = sessionStorage.getItem('userCredentials');
  if (stored) {
    userCredentials = JSON.parse(stored);
    setCurrentUser({ login: userCredentials.login });
  }
}

export function connectWebSocket(): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://localhost:4000');

    socket.addEventListener('open', () => {
      console.log('Соединение установлено');
      if (userCredentials) {
        const authMessage = {
          id: generateId(),
          type: 'USER_LOGIN',
          payload: {
            user: userCredentials,
          },
        };
        socket.send(JSON.stringify(authMessage));
      }
      resolve(socket);
    });

    socket.addEventListener('message', handleMessage);

    socket.addEventListener('error', (e) => {
      console.error('Ошибка соединения:', e);
      reject(e);
    });

    socket.addEventListener('close', () => {
      console.log('Соединение закрыто');

      if (isLoggedOut) {
        return;
      }

      setTimeout(async () => {
        try {
          const newSocket = await connectWebSocket();
          ws = newSocket;
        } catch (err) {
          console.error('Ошибка при реконнекте:', err);
        }
      }, 2000);
    });

    ws = socket;
  });
}

export function createAuthorization() {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';

  const containerForm = createHtmlElement('div', 'container_form') as HTMLDivElement;
  const form = createHtmlElement('form', 'form');
  const divForm = createHtmlElement('div', 'form_container');
  const divInput = createHtmlElement('div', 'container_input');
  const p = createHtmlElement('p', 'form_title', 'Авторизация');

  const fields = [
    { type: 'text', label: 'Имя', id: 'username' },
    { type: 'password', label: 'Пароль', id: 'password' },
  ];

  let nameInput: HTMLInputElement | undefined;
  let passwordInput: HTMLInputElement | undefined;

  fields.forEach((field) => {
    const fieldDiv = createHtmlElement('div', 'input_field');
    const label = createHtmlElement('label', 'input_label', field.label) as HTMLLabelElement;
    label.htmlFor = field.id;

    const input = createHtmlElement(
      'input',
      'input_element',
      '',
      `input_${field.label}`,
    ) as HTMLInputElement;

    input.type = field.type;
    input.id = field.id;
    input.name = field.id;
    input.required = true;

    if (field.id === 'username') {
      nameInput = input;
    }
    if (field.id === 'password') {
      passwordInput = input;
    }
    fieldDiv.append(label, input);
    divInput.append(fieldDiv);
  });

  const submitButton = createHtmlElement(
    'button',
    'submit_btn',
    'Войти',
    'buuton_1',
  ) as HTMLButtonElement;

  submitButton.type = 'submit';
  submitButton.disabled = true;

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const userName = nameInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!userName || !password) {
      return;
    }
    setCredentials(userName, password);

    try {
      await connectWebSocket();
      if (!ws) {
        return;
      }
    } catch (err) {
      console.error('Не удалось подключиться к серверу:', err);
    }
  });

  if (nameInput) {
    nameInput.addEventListener('input', validateName);
    nameInput.addEventListener('blur', validateName);
  }
  if (passwordInput) {
    passwordInput.addEventListener('input', validateName);
    passwordInput.addEventListener('blur', validateName);
  }

  divForm.append(p, divInput, submitButton);
  form.append(divForm);
  containerForm.append(form);
  app.append(containerForm);
}

export function validateName(event: Event) {
  const input = event.target as HTMLInputElement;
  const field = input.closest('.input_field');
  const isPasswordField = input.id === 'password';

  const existingError = field?.querySelector('.error');
  if (existingError) existingError.remove();

  const errors: string[] = [];

  if (input.value.length < 3) errors.push('От 3 символов');
  if (input.value.length > 12) errors.push('До 12 символов');
  if (isPasswordField && !hasUpperCase(input.value)) errors.push('Нужна заглавная буква');

  if (errors.length > 0) {
    const errorElement = createHtmlElement('span', 'error', errors.join(', '));
    field?.append(errorElement);
  }

  validateAllFields();
}

function validateAllFields() {
  const nameInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const submitButton = document.querySelector('.submit_btn') as HTMLButtonElement;

  const isNameValid = nameInput.value.length >= 3 && nameInput.value.length <= 12;
  const isPasswordValid =
    passwordInput.value.length >= 3 &&
    passwordInput.value.length <= 12 &&
    hasUpperCase(passwordInput.value);

  submitButton.disabled = !(isNameValid && isPasswordValid);
  submitButton.classList.add('no_disabled');
}

function hasUpperCase(str: string): boolean {
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      return true;
    }
  }
  return false;
}

function handleMessage(event: MessageEvent) {
  try {
    const data = JSON.parse(event.data);

    if (data.type === 'USER_LOGIN') {
      const { user } = data.payload;
      if (user.isLogined) {
        setCurrentUser({ login: user.login });
        router.navigate('/chat');
      } else {
        console.log('Неверный логин или пароль');
      }
    }

    if (data.type === 'ERROR') {
      console.log(`Ошибка: ${data.payload.error}`);
      const form = document.querySelector('.form_container');
      const existingError = document.querySelector('.error_message');
      if (existingError) {
        existingError.remove();
      }
      const errormessage = createHtmlElement('div', 'error_message', 'Неверный пароль!');
      form?.append(errormessage);
    }
  } catch (err) {
    console.error('Ошибка обработки сообщения:', err);
  }
}
