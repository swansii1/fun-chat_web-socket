import { createHtmlElement } from '../helper';
import './footer_style.css';

export const footer = createHtmlElement('footer');
export const wrapperFooter = createHtmlElement('div', 'wrapper_footer');

export function createFooter(): HTMLElement {
  const footer = createHtmlElement('footer');
  const wrapperFooter = createHtmlElement('div', 'wrapper_footer');
  const schoolTitile = createHtmlElement('p', 'footer_info', 'RSSchool');
  const linkGitHub = createHtmlElement('a', 'footer_info', 'swansii1') as HTMLLinkElement;
  const yearCreation = createHtmlElement('p', 'footer_info', '2025');
  linkGitHub.href = 'https://github.com/swansii1';
  linkGitHub.target = '_blank';

  wrapperFooter.append(schoolTitile, linkGitHub, yearCreation);
  footer.append(wrapperFooter);
  return footer;
}
