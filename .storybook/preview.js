import '../src/index.css';
import '../src/components/admin-ui.css';

export const parameters = {
  layout: 'fullscreen',
  controls: { expanded: true },
  options: {
    storySort: {
      order: ['Components', ['Button', 'ButtonGroup', 'TextField', 'TextArea', 'SelectField', 'PasswordInput', 'TagInput', 'CheckRow', 'RadioRow', 'Switch', 'FormRow', 'Form', 'Tabs', 'DataTable', 'Modal', 'Content'], 'Widgets', 'Examples', 'Pages'],
    },
  },
};
