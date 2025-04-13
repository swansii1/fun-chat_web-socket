import { createHtmlElement } from '../helper';
import './header_style.css';

const header = document.createElement('header');
const divHaed = createHtmlElement('div', 'header_container');
const buttonHeader = ['Инфо', 'Выход'];
const buttonContainer = createHtmlElement('div', 'btn_container');

export function createHeader() {
  const userName = createHtmlElement('p', 'user_name', 'Пользователь:');
  const titleApp = createHtmlElement('p', 'user_name', 'Веселый чат');

  buttonHeader.forEach((elem) => {
    const btn = createHtmlElement('button', 'btn_info', elem);

    buttonContainer.append(btn);
  });
  divHaed.append(userName, titleApp, buttonContainer);

  document.body.append(header);
  header.append(divHaed);
}
