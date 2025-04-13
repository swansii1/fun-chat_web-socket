import './main_style.css';
import { createHtmlElement } from '../helper';

const main = createHtmlElement('main');

export function createMain() {
  const wrapperMain = createHtmlElement('div', 'wrapper_main');
  const usersContainer = createHtmlElement('div', 'users_container');
  const messageContainer = createHtmlElement('div', 'users_message');

  main.append(wrapperMain);
  wrapperMain.append(usersContainer, messageContainer);
}

document.body.append(main);
