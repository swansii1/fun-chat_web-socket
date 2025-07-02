# Fun Chat — клиентская часть

Проект — клиентская часть веб-чата **Fun Chat**.

Удалённый сервер для работы чата находится здесь:  
[https://github.com/rolling-scopes-school/fun-chat-server/tree/main](https://github.com/rolling-scopes-school/fun-chat-server/tree/main)

---

## Описание

Это SPA приложение на TypeScript, позволяющее общаться в реальном времени через WebSocket.  
Проект использует сервер из репозитория выше, чтобы обрабатывать сообщения, аутентификацию и состояние пользователей.

---

## Как запустить

1. Клонируйте репозиторий:

   ```bash
   git clone https://github.com/ТВОЙ_НИК/fun-chat_web-socket.git
   cd fun-chat_web-socket

   ```

2. Установите зависимости:

   ```bash
   npm install

   ```

3. Запустите проект локально:

   ```bash
   npm start

   ```

4. Убедитесь, что сервер Fun Chat Server запущен и доступен (по умолчанию на ws://localhost:PORT), чтобы клиент мог подключиться.

---

# Функционал

- Регистрация и авторизация пользователей

- Поддержка реального времени через WebSocket

- Отображение списка онлайн-пользователей и истории сообщений

- Отправка, получение сообщений

---

# Технологии


- TypeScript

- WebSocket API

- HTML/CSS
