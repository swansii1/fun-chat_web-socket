import { createHtmlElement } from '../helper';
import './header_style.css';
import { currentUser,setCurrentUser, generateId, user } from '../authorization_page/authorization';
import { router } from '../router';
import { ws } from '../authorization_page/authorization';

export function createHeader(): HTMLElement {
  const header = document.createElement('header');
  const divHead = createHtmlElement('div', 'header_container');
  const buttonContainer = createHtmlElement('div', 'btn_container');
  const buttonHeader = ['Инфо', 'Выход'];

  const userName = createHtmlElement('p', 'user_name', `Пользователь: ${user || 'Гость'}`);
  const titleApp = createHtmlElement('p', 'user_name', 'Веселый чат');

  buttonHeader.forEach((elem, ind) => {
    const btn = createHtmlElement('button', `btn_header`, elem);
    if (ind === 0) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        router.navigate('/info');
      });
    } else if (ind === 1) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (ws && currentUser) {
          const logoutMessage = {
            id: generateId(),
            type: 'USER_LOGOUT',
            payload: {
              user: {
                login: currentUser.login,
              },
            },
          };
          ws.send(JSON.stringify(logoutMessage));
        }
        ws?.close();
        setCurrentUser(null);
        router.navigate('/login');
      });
    }
    buttonContainer.append(btn);
  });

  divHead.append(userName, titleApp, buttonContainer);
  header.append(divHead);
  return header;
}
