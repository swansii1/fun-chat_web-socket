import './authoriz_style.css';
import { createHtmlElement } from '../helper';
import { router } from '../router';
import { User } from '../intergace';
export let user: string;
export let ws: WebSocket;

const generateId = () => Math.random().toString(36).substring(2, 15);

export function connectWebSocket(onOpen: () => void): WebSocket {
  const newWs = new WebSocket(`ws://localhost:4000`);

  newWs.addEventListener('open', () => {
    console.log('Соединение установлено');
    onOpen();
  });

  newWs.addEventListener('close', () => {
    console.log('Соединение закрыто');
    setTimeout(connectWebSocket, 1000);
  });

  newWs.addEventListener('error', (error) => {
    console.error('Ошибка соединения:', error);
  });

  newWs.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'USER_LOGIN' && data.payload.user.isLogined) {
        user = data.payload.user.login;
        router.navigate('/chat');
      } else if (data.type === 'ERROR') {
        console.error('Ошибка авторизации:', data.payload.error);
      }
    } catch (e) {
      console.error('Ошибка парсинга сообщения:', e);
    }
  });

  return newWs;
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
    const userName = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    ws = connectWebSocket(() => {
      const authMessage: User = {
        id: generateId(),
        type: 'USER_LOGIN',
        payload: {
          user: {
            login: userName,
            password: password,
          },
        },
      };

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(authMessage));
        console.log('Отправлено:', authMessage);
      }
      router.navigate('/chat');
    });
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

  const existingError = field?.querySelector('.error');
  if (existingError) {
    existingError.remove();
  }

  if (input.value.length < 3) {
    const err = createHtmlElement('span', 'error', 'От 3 символов');
    field?.append(err);
  }
  if (input.value.length > 12) {
    const err = createHtmlElement('span', 'error', 'До 10 символов');
    field?.append(err);
  }
  validateAllFields();
}

function validateAllFields() {
  const nameInput = document.getElementById('username') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;
  const submitButton = document.querySelector('.submit_btn') as HTMLButtonElement;

  const isNameValid = nameInput.value.length >= 3 && nameInput.value.length <= 12;
  const isPasswordValid = passwordInput.value.length >= 3 && passwordInput.value.length <= 12;

  submitButton.disabled = !(isNameValid && isPasswordValid);
  submitButton.classList.add('no_disabled');
}
