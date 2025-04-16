import './main_style.css';
import { createHtmlElement } from '../helper';
export const ws = new WebSocket(`ws://localhost:4000`);

export const main = createHtmlElement('main');

export function createMain(): HTMLElement {
  const main = createHtmlElement('main');
  const wrapperMain = createHtmlElement('div', 'wrapper_main');
  const usersContainer = createHtmlElement('div', 'users_container');
  const messageContainer = createHtmlElement('div', 'users_message');
  const formMsg = createHtmlElement('form', 'send_form');
  const msgInput = createHtmlElement('input', 'msg_input') as HTMLInputElement;
  const btnSend = createHtmlElement('button', 'send_btn', 'Отправить');

  msgInput.placeholder = 'Введите сообщение...';

  msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  });

  btnSend.addEventListener('click', (e) => {
    e.preventDefault();
  });

  formMsg.append(msgInput, btnSend);
  messageContainer.append(formMsg);
  wrapperMain.append(usersContainer, messageContainer);
  main.append(wrapperMain);
  return main;
}