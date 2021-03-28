import { messageAction, XMessage } from './messages';
import { setElementTheme } from './application/view';
import './frame.css';

interface ExtendedWindow extends Window {
  renderTemplate: (alias: string, data: object) => string;
}

declare let window: ExtendedWindow;

function ready() {
  window.postMessage('load', '*');
}

function sendMessage(msg: XMessage) {
  window.postMessage(msg, '*');
}

function receiveMessage({ data }: MessageEvent<XMessage>) {
  if (data.type === 'message@UPDATE') {
    document.body.innerHTML = window.renderTemplate(data.alias, data.data);
  } else if (data.type === 'message@SET_THEME') {
    setElementTheme(document.body, data.theme);
  }
}

function onDocumentClick(e: MouseEvent) {
  if (e.target instanceof HTMLElement) {
    let eventTarget: HTMLElement | null = e.target;
    while (eventTarget && !eventTarget.dataset.action) {
      eventTarget = eventTarget.parentElement;
    }

    // (&& eventTarget.dataset.action) - is added as type guard for TypeScript
    if (eventTarget && eventTarget.dataset.action) {
      const { action, params } = eventTarget.dataset;
      sendMessage(messageAction(action, params));
    }
  }
}

document.addEventListener('DOMContentLoaded', ready);
document.body.addEventListener('click', onDocumentClick);
window.addEventListener('message', receiveMessage);
