import { createHtmlElement } from '../helper';
import './header_style.css';
import { createAuthorization, user } from '../authorization_page/authorization';
import { main } from '../main/main';
import { footer, wrapperFooter } from '../footer/footer';
import { createInfo } from '../info_page/info';
import { wrapperInfo } from '../info_page/info';

const header = document.createElement('header');
export const divHaed = createHtmlElement('div', 'header_container');
const buttonHeader = ['Инфо', 'Выход'];
export const buttonContainer = createHtmlElement('div', 'btn_container');

export function createHeader() {
  const userName = createHtmlElement('p', 'user_name', `Пользователь: ${user}`);
  const titleApp = createHtmlElement('p', 'user_name', 'Веселый чат');

  buttonHeader.forEach((elem, ind) => {
    const btn = createHtmlElement('button', `btn_${ind}`, elem);
    if (ind === 0) {
      btn.addEventListener('click', () => {
        divHaed.classList.add('header_none');
        buttonContainer.textContent = '';
        main.textContent = '';
        footer.textContent = '';
        wrapperFooter.textContent = '';
        wrapperInfo.classList.remove('wrapper_hiden');
        createInfo();
      });
    } else if (ind === 1) {
      btn.addEventListener('click', () => {
        divHaed.classList.add('header_none');
        buttonContainer.textContent = '';
        main.textContent = '';
        footer.textContent = '';
        wrapperFooter.textContent = '';
        createAuthorization();
      });
    }
    buttonContainer.append(btn);
  });

  divHaed.append(userName, titleApp, buttonContainer);
  header.append(divHaed);
  document.body.prepend(header);
}
