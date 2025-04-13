import './authoriz_style.css';
import { createHtmlElement } from '../helper';
import { createHeader, divHaed, buttonContainer } from '../header/header';
import { createFooter } from '../footer/footer';
import { createMain } from '../main/main';

const containerForm = createHtmlElement('div', 'container_form') as HTMLDivElement;
export let user: string;
let socket: WebSocket;

export function createAuthorization() {
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

  submitButton.addEventListener('click', () => {
    const userInput = document.getElementById('username') as HTMLInputElement;
    user = userInput.value;
    divHaed.classList.remove('header_none');
    divHaed.textContent = '';
    containerForm.textContent = '';
    buttonContainer.textContent = '';
    createMain();
    createHeader();
    createFooter();
    onOpen();
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
  document.body.append(containerForm);
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

function onOpen() {
  socket = new WebSocket(`ws://localhost:4000?username=${encodeURIComponent(user)}`);
  socket.onopen = () => {
    console.log('open');
  };
}
