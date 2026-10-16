import '../src/index.css';
import '../src/components/admin-ui.css';

export const parameters = {
  layout: 'fullscreen',
  controls: { expanded: true },
  options: {
    storySort: {
      order: ['Widgets', ['Reusable Components', 'Primitives', 'Dashboard', 'Reports', 'Shell', 'Configuration', 'Settings'], 'Pages', 'Administrator'],
    },
  },
};
