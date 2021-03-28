import { XMessage } from '../messages';
import { SlideTheme, possibleThemes } from './types';

const darkIcon = require('../assets/favicon-dark.png');
const lightIcon = require('../assets/favicon-light.png');

export const setScale = (el: HTMLDivElement, value: number): void => {
  el.style.transform = `scaleX(${value.toFixed(5)})`;
};

export const sendMessage = (iframe: HTMLIFrameElement, msg: XMessage): void => {
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(msg, '*');
  }
};

export const initIframe = (parent: HTMLDivElement, onLoad: (iframe: HTMLIFrameElement) => void): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');

  iframe.classList.add('frame');
  iframe.src = 'frame.html';
  iframe.sandbox.add('allow-scripts');
  iframe.sandbox.add('allow-same-origin');

  iframe.addEventListener('load', () => onLoad(iframe));
  parent.appendChild(iframe);

  return iframe;
};

export const initProgress = (parent: HTMLDivElement): HTMLDivElement => {
  const container = document.createElement('div');
  container.classList.add('slide-progress');
  const progress = document.createElement('div');
  progress.classList.add('slide-progress-value');
  container.appendChild(progress);

  parent.appendChild(container);

  return progress;
};

export const setElementTheme = (elem: HTMLElement, theme: SlideTheme): void => {
  for (let themeIx = 0; themeIx < possibleThemes.length; themeIx += 1) {
    const currentTheme = `theme_${possibleThemes[themeIx]}`;

    if (elem.classList.contains(currentTheme)) {
      elem.classList.remove(currentTheme);
    }
  }

  elem.classList.add(`theme_${theme}`);
};

export const setThemeIcon = (theme: SlideTheme): void => {
  const currentLink = document.querySelector('link[rel=\'icon\']');

  if (currentLink instanceof HTMLLinkElement) {
    if (theme === 'dark') {
      currentLink.href = darkIcon;
    } else if (theme === 'light') {
      currentLink.href = lightIcon;
    }
  }
};
