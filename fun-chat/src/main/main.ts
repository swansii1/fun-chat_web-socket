import './main_style.css';
import { createHtmlElement } from '../helper';
import { currentUser, ws, generateId } from '../authorization_page/authorization';
import { Message } from '../intergace';

export const main = createHtmlElement('main');

const chatMaps = new Map<string, { from: string; text: string }[]>();
let currentRecipent: string | null = null;

export function createMain(): HTMLElement {
  const main = createHtmlElement('main');
  const wrapperMain = createHtmlElement('div', 'wrapper_main');
  const usersContainer = createHtmlElement('div', 'users_container');
  const messageContainer = createHtmlElement('div', 'users_message');
  const formMsg = createHtmlElement('form', 'send_form');
  const msgInput = createHtmlElement('input', 'msg_input') as HTMLInputElement;
  const btnSend = createHtmlElement('button', 'send_btn', 'Отправить');
  const infoMessageContainer = createHtmlElement(
    'h5',
    'info_message',
    'Выберите пользователя для отправки сообщений...',
  );
  const infoUser = createHtmlElement('div', 'info_user_container');
  const nikName = createHtmlElement('p', 'nik_name_user');
  const statusUser = createHtmlElement('p', 'status_user');
  const messageList = createHtmlElement('div', 'messages_list');

  messageContainer.prepend(messageList);

  msgInput.placeholder = 'Введите сообщение...';

  ws?.addEventListener(
    'open',
    () => {
      ws?.send(
        JSON.stringify({
          id: generateId(),
          type: 'USER_ACTIVE',
          payload: null,
        }),
      );

      ws?.send(
        JSON.stringify({
          id: generateId(),
          type: 'USER_INACTIVE',
          payload: null,
        }),
      );
    },
    { once: true },
  );

  function sendMessae() {
    if (!ws || !currentUser || !currentRecipent) {
      return;
    }

    const text = msgInput.value.trim();

    const message: Message = {
      id: generateId(),
      type: 'MSG_SEND',
      payload: {
        message: {
          to: currentRecipent,
          text,
        },
      },
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      const messageElem = createHtmlElement('h4', 'message', `Вы:${text}`);
      messageList.append(messageElem);
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
    const active = JSON.parse(event.data);

    if (active.type === 'MSG_SEND') {
      const { from, text, to } = active.payload.message;
      const outherUser = from === currentUser?.login ? to : from;

      const chat = chatMaps.get(outherUser) || [];
      chat.push({ from, text });
      chatMaps.set(outherUser, chat);

      if (currentRecipent === from) {
        const messageElem = createHtmlElement('h4', 'message', `${from}: ${text}`);
        messageList.append(messageElem);
      }
    }

    if (active.type === 'USER_ACTIVE') {
      const users = active.payload?.users;

      if (!Array.isArray(users)) {
        return;
      }

      users.forEach((user: { login: string; isLogined: boolean }) => {
        const contElem = createHtmlElement('div', 'user_container');
        const userElem = createHtmlElement('p', 'user_item', user.login);
        const online = createHtmlElement('div', 'indentifiers_online');

        contElem.addEventListener('click', () => {
          if (user.isLogined) {
            statusUser.classList.remove('offline');
            statusUser.textContent = 'В сети';
          } else {
            statusUser.classList.add('offline');
            statusUser.textContent = 'Не в сети';
          }
          currentRecipent = user.login;
          nikName.textContent = currentRecipent;

          // messageList.textContent = '';
          const history = chatMaps.get(currentRecipent) || [];
          infoMessageContainer.textContent = 'Напишите ваше первое сообщение...';

          history.forEach(({ from, text }) => {
            const messageElem = createHtmlElement('h4', 'message', `${from}:${text}`);
            messageList.append(messageElem);
          });

          console.log('Клик по пользователю:', user.login);
        });

        userElem.classList.add('online');
        contElem.append(online, userElem);
        usersContainer.prepend(contElem);
      });
    }

    if (active.type === 'USER_INACTIVE') {
      const users = active.payload?.users;

      if (!Array.isArray(users)) {
        return;
      }

      users.forEach((user: { login: string; isLogined: boolean }) => {
        const contElem = createHtmlElement('div', 'user_container');
        const userElem = createHtmlElement('p', 'user_item', user.login);
        const offline = createHtmlElement('div', 'indentifiers_offline');
        contElem.addEventListener('click', () => {
          if (user.isLogined) {
            statusUser.textContent = 'В сети';
          } else {
            statusUser.classList.add('offline');
            statusUser.textContent = 'Не в сети';
          }
          currentRecipent = user.login;
          nikName.textContent = currentRecipent;
          // messageList.innerHTML = '';
          const history = chatMaps.get(currentRecipent) || [];
          infoMessageContainer.textContent = 'Напишите ваше первое сообщение...';

          history.forEach(({ from, text }) => {
            const messageElem = createHtmlElement('h4', 'message', `${from}:${text}`);
            messageList.append(messageElem);
          });

          console.log('Клик по пользователю:', user.login);
        });

        contElem.append(offline, userElem);
        usersContainer.append(contElem);
      });
    }
  }

  ws?.addEventListener('message', handleMessageIncoming);

  infoUser.append(nikName, statusUser);
  messageList.append(infoMessageContainer);
  formMsg.append(msgInput, btnSend);
  messageContainer.append(infoUser, messageList, formMsg);
  wrapperMain.append(usersContainer, messageContainer);
  main.append(wrapperMain);
  return main;
}
