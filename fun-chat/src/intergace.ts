export interface User {
  id: string;
  type: 'USER_LOGIN';
  payload: object;
}
export interface Message {
  id: string;
  type: 'MSG_SEND';
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}