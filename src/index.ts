import {
  messageSetTheme,
  messageUpdate,
  XMessage,
} from './messages';
import {
  actionMessage,
  actionPrev,
  actionNext,
  actionRestart,
  actionSetTheme,
} from './application/actions';
import { createState } from './application/state';
import {
  createCurrentDataSelector,
  createCurrentIndexSelector,
  createProgressSelector,
  createThemeSelector,
} from './application/selectors';
import {
  initIframe,
  initProgress,
  sendMessage,
  setElementTheme,
  setThemeIcon,
  setScale,
} from './application/view';

import './index.css';

import { stories } from './data';

const [dispatch, state$] = createState(stories);

function onMessage({ data }: MessageEvent<XMessage>) {
  if (data.type === 'message@ACTION') {
    dispatch(actionMessage(data.action, data.params));
  }
}

const player = document.querySelector<HTMLDivElement>('.player');
const frames = stories.map(
  ({ alias, data }) => {
    if (player) {
      return initIframe(player, (iframe) => {
        if (iframe.contentWindow) {
          sendMessage(iframe, messageUpdate(alias, data));
          iframe.contentWindow.addEventListener('message', onMessage);
        } else {
          throw new Error('Error: iframe did not load');
        }
      });
    }
    throw new Error('Error: .player did not find');
  },
);

const progress = document.querySelector<HTMLDivElement>('.progress-container');
const bars = stories.map(() => {
  if (progress) {
    return initProgress(progress);
  }
  throw new Error('Error: .progress-container did not find');
});

createProgressSelector(state$)
  .subscribe(({ index, value }) => setScale(bars[index], value));

createCurrentIndexSelector(state$)
  .subscribe((index) => {
    if (player) {
      player.style.transform = `translateX(-${index * 100}%)`;
    } else {
      throw new Error('Error: .player did not find');
    }

    bars.forEach((el, i) => setScale(el, i < index ? 1 : 0));
  });

createCurrentDataSelector(state$)
  .subscribe(({ index, value: { alias, data } }) => {
    sendMessage(frames[index], messageUpdate(alias, data));
  });

createThemeSelector(state$)
  .subscribe((theme) => {
    setElementTheme(document.body, theme);
    setThemeIcon(theme);
    frames.forEach((iframe) => sendMessage(iframe, messageSetTheme(theme)));
  });

const setLightElement = document.querySelector<HTMLDivElement>('.set-light');
if (setLightElement) {
  setLightElement.addEventListener('click', () => dispatch(actionSetTheme('light')));
} else {
  throw new Error('Error: .set-light did not find');
}

const setDarkElement = document.querySelector<HTMLDivElement>('.set-dark');
if (setDarkElement) {
  setDarkElement.addEventListener('click', () => dispatch(actionSetTheme('dark')));
} else {
  throw new Error('Error: .set-dark did not find');
}

const prevElement = document.querySelector<HTMLDivElement>('.prev');
if (prevElement) {
  prevElement.addEventListener('click', () => dispatch(actionPrev()));
} else {
  throw new Error('Error: .prev did not find');
}

const nextElement = document.querySelector<HTMLDivElement>('.next');
if (nextElement) {
  nextElement.addEventListener('click', () => dispatch(actionNext()));
} else {
  throw new Error('Error: .next did not find');
}

const restartElement = document.querySelector<HTMLDivElement>('.restart');
if (restartElement) {
  restartElement.addEventListener('click', () => dispatch(actionRestart()));
} else {
  throw new Error('Error: .restart did not find');
}
