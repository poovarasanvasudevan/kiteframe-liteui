/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    '../src/components/ui/*.stories.jsx',
    '../src/dashboard/dashboard.stories.jsx',
    '../src/reports/reports.stories.jsx',
    '../src/widgets/*.stories.jsx',
    '../src/pages/pages.stories.jsx',
  ],
  addons: ['@storybook/preset-create-react-app', '@storybook/addon-docs'],
  framework: { name: '@storybook/react-webpack5', options: {} },
  docs: { autodocs: 'tag' },
};
export default config;
