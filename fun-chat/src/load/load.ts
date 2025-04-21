import './load_style.css';
import { createHtmlElement } from '../helper';

export function load() {
  const containerload = createHtmlElement('div', 'load', 'сервер запускается...');
  const count = document.querySelectorAll('.load').length;
  if (count > 0){
    return
  }
  document.body.append(containerload);
}
