import './main_style.css';
import { createHtmlElement } from '../helper';
import { currentUser, ws, generateId } from '../authorization_page/authorization';
import { Message } from '../intergace';

export const main = createHtmlElement('main');

const chatMaps = new Map<string, { from: string; text: string }[]>();
let currentRecipent: string;

export function createMain(): HTMLElement {
  const main = createHtmlElement('main');
  const wrapperMain = createHtmlElement('div', 'wrapper_main');
  const usersContainer = createHtmlElement('div', 'users_container');
  const messageContainer = createHtmlElement('div', 'users_message');
  const formMsg = createHtmlElement('form', 'send_form');
  const msgInput = createHtmlElement('input', 'msg_input') as HTMLInputElement;
  const btnSend = createHtmlElement('button', 'send_btn', 'Отправить') as HTMLButtonElement;
  const infoMessageContainer = createHtmlElement(
    'h5',
    'info_message',
    'Выберите пользователя для отправки сообщений...',
  );
  const infoUser = createHtmlElement('div', 'info_user_container');
  const nikName = createHtmlElement('p', 'nik_name_user');
  const statusUser = createHtmlElement('p', 'status_user');
  const messageList = createHtmlElement('div', 'messages_list');

  msgInput.disabled = true;
  btnSend.disabled = true;

  msgInput.addEventListener('input', () => {
    btnSend.disabled = msgInput.value.trim() === '';
  });

  messageContainer.prepend(messageList);

  msgInput.placeholder = 'Введите сообщение...';

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        id: generateId(),
        type: 'USER_ACTIVE',
        payload: null,
      }),
    );

    ws.send(
      JSON.stringify({
        id: generateId(),
        type: 'USER_INACTIVE',
        payload: null,
      }),
    );
  }

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

    if (!text) {
      btnSend.disabled = true;
      return;
    }
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

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      const messageContainer = createHtmlElement('div', 'msg_container_you');
      const textContent = createHtmlElement('h4', 'text_user', `${text}`);
      const nameUser = createHtmlElement('p', 'message_from', `Вы`);
      messageContainer.append(nameUser, textContent);
      messageList.append(messageContainer);
      msgInput.value = '';
    }
  }

  msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      infoMessageContainer.textContent = '';
      e.preventDefault();
      sendMessae();
      messageList.scrollTop = messageList.scrollHeight;
    }
  });

  btnSend.addEventListener('click', (e) => {
    infoMessageContainer.textContent = '';
    e.preventDefault();
    sendMessae();
    messageList.scrollTop = messageList.scrollHeight;
  });

  function handleMessageIncoming(event: MessageEvent) {
    const active = JSON.parse(event.data);

    if (active.type === 'USER_EXTERNAL_LOGOUT') {
      const { login, isLogined } = active.payload.user;
      const users = document.querySelectorAll('.user_item');

      users.forEach((elem) => {
        if (elem.textContent === login) {
          const contElem = elem.closest('div');
          const statusOffline = document.querySelector('.status_user');
          if (statusOffline) {
            statusOffline.classList.add('offline');
            statusOffline.textContent = 'Не в сети';
          }
          const indentifie = contElem?.querySelector('.indentifiers_online');
          indentifie?.classList.remove('indentifiers_online');
          indentifie?.classList.add('indentifiers_offline');
          console.log(contElem);
        }
      });
      console.log(login, isLogined);
    }

    if (active.type === 'USER_EXTERNAL_LOGIN') {
      const { login, isLogined } = active.payload.user;
      const users = document.querySelectorAll('.user_item');

      users.forEach((elem) => {
        if (elem.textContent === login) {
          const contElem = elem.closest('div');
          const statusOffline = document.querySelector('.status_user');
          if (statusOffline) {
            statusOffline.textContent = 'В сети';
            statusOffline.classList.remove('offline');
          }
          const indentifie = contElem?.querySelector('.indentifiers_offline');
          indentifie?.classList.remove('indentifiers_offline');
          indentifie?.classList.add('indentifiers_online');
          console.log(contElem);
        }
      });
      console.log(login, isLogined);
    }

    if (active.type === 'MSG_SEND') {
      const { from, text, to } = active.payload.message;
      const outherUser = from === currentUser?.login ? to : from;

      const chat = chatMaps.get(outherUser) || [];
      chat.push({ from, text });
      chatMaps.set(outherUser, chat);

      if (currentRecipent === from) {
        const messageContainer = createHtmlElement(
          'div',
          from === currentUser?.login ? 'msg_container_you' : 'msg_container',
        );
        const textContent = createHtmlElement('h4', 'text_user', text);
        const nameUser = createHtmlElement(
          'p',
          'message_from',
          from === currentUser?.login ? 'Вы' : from,
        );
        messageContainer.append(nameUser, textContent);
        messageList.append(messageContainer);
      }
    }

    if (active.type === 'USER_ACTIVE') {
      usersContainer.innerHTML = '';
      const users = active.payload?.users;

      if (!Array.isArray(users)) {
        return;
      }

      users
        .filter((user: { login: string }) => user.login !== currentUser?.login)
        .forEach((user: { login: string; isLogined: boolean }) => {
          const contElem = createHtmlElement('div', 'user_container');
          const userElem = createHtmlElement('p', 'user_item', user.login);
          const online = createHtmlElement('div', 'indentifiers_online');

          contElem.addEventListener('click', () => {
            infoUser.style.display = 'flex';
            msgInput.disabled = false;
            btnSend.disabled = msgInput.value.trim() === '';
            ws?.send(
              JSON.stringify({
                id: generateId(),
                type: 'MSG_FROM_USER',
                payload: {
                  user: {
                    login: user.login,
                  },
                },
              }),
            );

            if (user.isLogined) {
              statusUser.classList.remove('offline');
              statusUser.textContent = 'В сети';
            }
            currentRecipent = user.login;
            nikName.textContent = currentRecipent;

            messageList.textContent = '';
            const history = chatMaps.get(currentRecipent) || [];
            infoMessageContainer.textContent = 'Напишите ваше первое сообщение...';

            history.forEach(({ from, text }) => {
              const messageContainer = createHtmlElement(
                'div',
                from === currentUser?.login ? 'msg_container_you' : 'msg_container',
              );
              const textContent = createHtmlElement('h4', 'text_user', text);
              const nameUser = createHtmlElement(
                'p',
                'message_from',
                from === currentUser?.login ? 'Вы' : from,
              );
              messageContainer.append(nameUser, textContent);
              messageList.append(messageContainer);
            });

            setTimeout(() => {
              messageList.scrollTop = messageList.scrollHeight;
            }, 10);
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
          infoUser.style.display = 'flex';
          msgInput.disabled = false;
          btnSend.disabled = msgInput.value.trim() === '';
          ws?.send(
            JSON.stringify({
              id: generateId(),
              type: 'MSG_FROM_USER',
              payload: {
                user: {
                  login: user.login,
                },
              },
            }),
          );
          if (user.isLogined) {
            statusUser.textContent = 'В сети';
          } else {
            statusUser.classList.add('offline');
            statusUser.textContent = 'Не в сети';
          }
          currentRecipent = user.login;
          nikName.textContent = currentRecipent;
          messageList.innerHTML = '';
          const history = chatMaps.get(currentRecipent) || [];
          infoMessageContainer.textContent = 'Напишите ваше первое сообщение...';

          history.forEach(({ from, text }) => {
            const messageContainer = createHtmlElement(
              'div',
              from === currentUser?.login ? 'msg_container_you' : 'msg_container',
            );
            const textContent = createHtmlElement('h4', 'text_user', text);
            const nameUser = createHtmlElement(
              'p',
              'message_from',
              from === currentUser?.login ? 'Вы' : from,
            );
            messageContainer.append(nameUser, textContent);
            messageList.append(messageContainer);
          });
          setTimeout(() => {
            messageList.scrollTop = messageList.scrollHeight;
          }, 10);
        });

        contElem.append(offline, userElem);
        usersContainer.append(contElem);
      });
    }

    if (active.type === 'MSG_FROM_USER') {
      const messages = active.payload?.messages;

      if (!Array.isArray(messages)) return;

      messageList.innerHTML = '';
      infoMessageContainer.textContent = 'Напишите ваше первое сообщение...';

      messages.forEach(({ from, text }: { from: string; text: string }) => {
        const messageContainer = createHtmlElement(
          'div',
          from === currentUser?.login ? 'msg_container_you' : 'msg_container',
        );
        const textContent = createHtmlElement('h4', 'text_user', text);
        const nameUser = createHtmlElement(
          'p',
          'message_from',
          from === currentUser?.login ? 'Вы' : from,
        );
        messageContainer.append(nameUser, textContent);
        messageList.append(messageContainer);

        const outherUser = from === currentUser?.login ? currentRecipent : from;
        const history = chatMaps.get(outherUser) || [];
        history.push({ from, text });
        chatMaps.set(outherUser, history);
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
