import './authoriz_style.css';
import { createHtmlElement } from '../helper';
import { createHeader, divHaed, buttonContainer } from '../header/header';
import { createFooter } from '../footer/footer';
import { createMain } from '../main/main';

const containerForm = createHtmlElement('div', 'container_form');
export let user: string;

export function createAuthorization() {
  const form = createHtmlElement('form', 'form');
  const divForm = createHtmlElement('div', 'form_container');
  const divInput = createHtmlElement('div', 'container_input');
  const p = createHtmlElement('p', 'form_title', 'Авторизация');

  const fields = [
    { type: 'text', label: 'Имя', id: 'username' },
    { type: 'password', label: 'Пароль', id: 'password' },
  ];

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

    fieldDiv.append(label, input);
    divInput.append(fieldDiv);
  });

  const submitButton = createHtmlElement('button', 'submit_btn', 'Войти') as HTMLButtonElement;
  submitButton.type = 'submit';
  // submitButton.disabled = true;

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
    console.log(user);
  });

  divForm.append(p, divInput, submitButton);
  form.append(divForm);
  containerForm.append(form);
  document.body.append(containerForm);
}

export function validateName() {
  const nameVal = document.querySelector('.input_element') as HTMLInputElement;

  if (nameVal.value === '' || nameVal.value.length < 3 || nameVal.value.length > 15) {
    nameVal.placeholder = 'Должно быть от 3 символов';
    nameVal.style.borderColor = 'red';
  }
}
