import { createHtmlElement } from '../helper';
import './header_style.css';
import { createAuthorization } from '../authorization_page/authorization';

const header = document.createElement('header');
export const divHaed = createHtmlElement('div', 'header_container');
const buttonHeader = ['Инфо', 'Выход'];
export const buttonContainer = createHtmlElement('div', 'btn_container');

export function createHeader() {
  const userName = createHtmlElement('p', 'user_name', 'Пользователь:');
  const titleApp = createHtmlElement('p', 'user_name', 'Веселый чат');

  buttonHeader.forEach((elem, ind) => {
    const btn = createHtmlElement('button', `btn_${ind}`, elem);
    if (ind === 1) {
      btn.addEventListener('click', () => {
        divHaed.classList.add('header_none');
        buttonContainer.textContent = '';
        createAuthorization();
      });
    }
    buttonContainer.append(btn);
  });

  divHaed.append(userName, titleApp, buttonContainer);
  header.append(divHaed);
  document.body.prepend(header);
}
