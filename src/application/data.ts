import produce, { Draft } from 'immer';

import { Action } from './actions';
import {
  DELAY,
  INTERVAL,
  State,
} from './types';

export const data = produce((draft: Draft<State>, action: Action) => {
  switch (action.type) {
    case 'timer': {
      if (!draft.pause) {
        draft.progress += INTERVAL;
      }

      break;
    }
    case 'prev': {
      draft.pause = false;
      draft.progress = 0;
      draft.index = Math.max(draft.index - 1, 0);

      break;
    }
    case 'next': {
      if (draft.index + 1 < draft.stories.length) {
        draft.index += 1;
        draft.progress = 0;
      } else {
        draft.progress = DELAY;
        draft.pause = true;
      }

      break;
    }
    case 'restart': {
      draft.pause = false;
      draft.progress = 0;
      draft.index = 0;

      break;
    }
    case 'update': {
      const { alias } = action.data;
      const slideData = action.data.data;

      if (alias) {
        draft.stories[draft.index].alias = alias;
      }

      if (slideData) {
        Object.assign(draft.stories[draft.index].data, slideData);
      }

      break;
    }
    case 'theme': {
      draft.theme = action.theme;

      break;
    }
  }
});
