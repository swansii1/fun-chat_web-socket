export function createHtmlElement(
  tag: keyof HTMLElementTagNameMap,
  className?: string,
  textContent?: string,
  id?: string,
): HTMLElement {
  const element = document.createElement(tag);

  if (textContent) {
    element.textContent = textContent;
  }

  if (className) {
    element.className = className;
  }

  if (id) {
    element.id = id;
  }

  return element;
}
