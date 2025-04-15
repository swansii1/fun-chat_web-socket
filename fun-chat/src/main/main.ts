import './main_style.css';
import { createHtmlElement } from '../helper';

export const main = createHtmlElement('main');

export function createMain(): HTMLElement {
  const main = createHtmlElement('main');
  const wrapperMain = createHtmlElement('div', 'wrapper_main');
  const usersContainer = createHtmlElement('div', 'users_container');
  const messageContainer = createHtmlElement('div', 'users_message');

  wrapperMain.append(usersContainer, messageContainer);
  main.append(wrapperMain);
  return main;
}
