import { createHtmlElement } from '../helper';
import './footer_style.css';

const footer = createHtmlElement('footer');
const wrapperFooter = createHtmlElement('div', 'wrapper_footer');

export function createFooter() {
  const schoolTitile = createHtmlElement('p', 'footer_info', 'RSSchool');
  const linkGitHub = createHtmlElement('a', 'footer_info', 'swansii1') as HTMLLinkElement;
  const yearCreation = createHtmlElement('p', 'footer_info', '2025');
  linkGitHub.href = 'https://github.com/swansii1';

  footer.append(wrapperFooter);
  wrapperFooter.append(schoolTitile, linkGitHub, yearCreation);
  document.body.append(footer);
}
