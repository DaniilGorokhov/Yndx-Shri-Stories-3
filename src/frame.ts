import { messageAction, XMessage } from './messages';
import { setElementTheme } from './application/view';
import { Slide } from './application/types';
import './frame.css';

interface ExtendedWindow extends Window {
  renderTemplate: (alias: Slide['alias'], data: Slide['data']) => string;
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
  const path = e.composedPath();
  let index = 0;
  let target = path[index];
  while (index < path.length
    && (target instanceof HTMLElement || target instanceof SVGElement) && !target.dataset.action) {
    index += 1;
    target = path[index];
  }

  if (target && (target instanceof HTMLElement || target instanceof SVGElement) && target.dataset.action) {
    const { action, params } = target.dataset;
    sendMessage(messageAction(action, params));
  }
}

document.addEventListener('DOMContentLoaded', ready);
document.body.addEventListener('click', onDocumentClick);
window.addEventListener('message', receiveMessage);
