import './main_style.css';
import { createHtmlElement } from '../helper';
import { currentUser, ws, generateId } from '../authorization_page/authorization';
import { Message } from '../intergace';

export const main = createHtmlElement('main');

export function createMain(): HTMLElement {
  const main = createHtmlElement('main');
  const wrapperMain = createHtmlElement('div', 'wrapper_main');
  const usersContainer = createHtmlElement('div', 'users_container');
  const messageContainer = createHtmlElement('div', 'users_message');
  const formMsg = createHtmlElement('form', 'send_form');
  const msgInput = createHtmlElement('input', 'msg_input') as HTMLInputElement;
  const btnSend = createHtmlElement('button', 'send_btn', 'Отправить');
  const recipientInput = createHtmlElement('input', 'recipient_input') as HTMLInputElement;
  const messageList = createHtmlElement('div', 'messages_list');

  messageContainer.prepend(messageList);

  msgInput.placeholder = 'Введите сообщение...';

  function sendMessae() {
    if (!ws || !currentUser) {
      return;
    }
    const text = msgInput.value.trim();
    const to = recipientInput.value.trim();

    if (!text || !to) {
      return;
    }

    const message: Message = {
      id: generateId(),
      type: 'MSG_SEND',
      payload: {
        message: {
          to,
          text,
        },
      },
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      msgInput.value = '';
    }
  }

  msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessae();
    }
  });

  btnSend.addEventListener('click', (e) => {
    e.preventDefault();
    sendMessae();
  });

  function handleMessageIncoming(event: MessageEvent) {
    const data = JSON.parse(event.data);

    if (data.type === 'MSG_SEND') {
      const { from, text } = data.payload.message;
      console.log(data.payload.message);

      const messageElem = createHtmlElement('h4', 'message', `${from}: ${text}`);
      messageList.append(messageElem);
    }
  }

  ws?.addEventListener('message', handleMessageIncoming);

  formMsg.append(recipientInput, msgInput, btnSend);
  messageContainer.append(messageList, formMsg);
  wrapperMain.append(usersContainer, messageContainer);
  main.append(wrapperMain);
  return main;
}
