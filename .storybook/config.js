import { configure, addParameters } from '@storybook/svelte';
import { themes } from '@storybook/theming';
import { INITIAL_VIEWPORTS, DEFAULT_VIEWPORT } from '@storybook/addon-viewport';
import moment from 'moment';

moment.locale('ru');
// from local path
import '../static/css/global.css';

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// Option defaults.
addParameters({
  options: {
    theme: themes.light,
  },
});

const newViewports = {
  thing: {
    name: 'Thing card',
    styles: {
      width: '456px',
      height: '1000px',
      maxHeight: '1000px',
      overflow: 'auto',
      position: 'relative'
    },
  },
};

addParameters({
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...newViewports,
    },
    defaultViewport: DEFAULT_VIEWPORT
  },
});

configure(loadStories, module);