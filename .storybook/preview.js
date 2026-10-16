import '../src/index.css';
import '../src/components/admin-ui.css';

export const parameters = {
  layout: 'fullscreen',
  controls: { expanded: true },
  options: {
    storySort: {
      order: ['Widgets', ['Primitives', 'Dashboard', 'Reports', 'Configuration', 'Shell', 'Settings'], 'Pages'],
    },
  },
};
