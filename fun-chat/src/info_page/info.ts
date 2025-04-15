import './info_style.css';
import { createHtmlElement } from '../helper';
// import { createMain } from '../main/main';
// import { createHeader } from '../header/header';
// import { createFooter } from '../footer/footer';
// import { divHaed } from '../header/header';
import { router } from '../router';

export const wrapperInfo = createHtmlElement('div', 'wrapper_info');

// export function createInfo() {
//   const nameApp = createHtmlElement('h3', 'name_app', 'Веселый чат');
//   const divInfo = createHtmlElement('div', 'info');
//   const infoApp = createHtmlElement(
//     'label',
//     'info_app',
//     'Приложение разработано для демонстрации задания Fun Chat в рамках курса RSSchool JS/FE 2024Q4',
//   );
//   const infoApp1 = createHtmlElement(
//     'label',
//     'info_app',
//     'Удаление пользователей и сообщений происходит один раз в сутки',
//   );
//   const autor = createHtmlElement('a', 'autor_info', 'Автор swansii1') as HTMLLinkElement;
//   autor.href = 'https://github.com/swansii1';
//   autor.target = '_blank';
//   const btnBack = createHtmlElement('button', 'btn_back', 'Вернуться назад');

//   // btnBack.addEventListener('click', () => {
//   //   wrapperInfo.textContent = '';
//   //   divHaed.textContent = '';
//   //   wrapperInfo.classList.add('wrapper_hiden');
//   //   divHaed.classList.remove('header_none');
//   //   createHeader();
//   //   createMain();
//   //   createFooter();
//   // });
//   btnBack.addEventListener('click', () => {
//     router.navigate('/chat'); // Возврат в чат
//   });
//   divInfo.append(infoApp, infoApp1);
//   wrapperInfo.append(nameApp, divInfo, autor, btnBack);
//   document.body.append(wrapperInfo);
// }

export function createInfo(): HTMLElement {
  const wrapperInfo = createHtmlElement('div', 'wrapper_info');
  const nameApp = createHtmlElement('h3', 'name_app', 'Веселый чат');
  const divInfo = createHtmlElement('div', 'info');
  const infoApp = createHtmlElement(
    'label',
    'info_app',
    'Приложение разработано для демонстрации задания Fun Chat в рамках курса RSSchool JS/FE 2024Q4',
  );

  const infoApp1 = createHtmlElement(
    'label',
    'info_app',
    'Удаление пользователей и сообщений происходит один раз в сутки',
  );
  const autor = createHtmlElement('a', 'autor_info', 'Автор swansii1') as HTMLLinkElement;
  autor.href = 'https://github.com/swansii1';
  autor.target = '_blank';

  const btnBack = createHtmlElement('button', 'btn_back', 'Вернуться назад');
  btnBack.addEventListener('click', () => {
    router.navigate('/chat');
  });

  divInfo.append(infoApp, infoApp1);
  wrapperInfo.append(nameApp, divInfo, autor, btnBack);
  return wrapperInfo;
}
