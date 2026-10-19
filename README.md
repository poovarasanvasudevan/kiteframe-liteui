# @kiteapps/lite-ui

Compact React components modeled on the [ADSelfService Plus administrator demo](https://demo.adselfserviceplus.com/). The package contains individual controls, larger administrator widgets, and example pages. The demo content is illustrative; the components accept your own data and callbacks.

## Develop

```bash
npm ci
npm run storybook       # component catalog at http://localhost:6006
npm run typecheck
npm test -- --watch=false
npm run build           # distributable package in dist/
npm run build-storybook # static Storybook in storybook-static/
```

Storybook is organized as **Components** (individual controls), **Widgets** (one editable story for each Dashboard, Reports, Configuration, Settings, and Shell widget), **Examples** (compositions), and **Pages** (reference screens). Open a story's **Controls** panel to change its props. Open **Docs → Show code** for a usage example. To change the example itself, edit its `*.stories.jsx` file; Storybook reloads it during development.

## Use in another React app

Install `@kiteapps/lite-ui`, React, React DOM, and Lucide React. Import the stylesheet once:

```jsx
import '@kiteapps/lite-ui/styles.css';
import { Button, TextField, CheckRow, Tabs, DataTable, Modal } from '@kiteapps/lite-ui';

const columns = [
  { key: 'name', label: 'Policy' },
  { key: 'domain', label: 'Directory' },
];

function PolicyList({ policies, onOpen }) {
  return <>
    <TextField label="Find a policy" placeholder="Search policies" />
    <DataTable columns={columns} rows={policies} onRowClick={onOpen} empty="No policies found" />
    <Button variant="primary" onClick={() => onOpen(null)}>Add policy</Button>
  </>;
}
```

The public root entry exports every control and widget by name. Controls are maintained in `src/components/ui/`, one module per component family. `src/widgets/Primitives.tsx` re-exports them so existing source imports continue to work. `src/widgets/` contains composed widgets, while `src/pages/` contains reference pages. The demo uses these same exports.

Controls support normal React props. For example, `TextField` forwards native input attributes and accepts `label`, `hint`, and `error`; `CheckRow` and `Tabs` can be controlled or manage local state. `DataTable` takes object rows and column definitions, including an optional `render(row, index)` for a cell. `Modal` takes `open`, `onClose`, `title`, and optional `footer`. The Storybook Docs tab has a working usage snippet for each core control.

`TextArea` is the multiline companion to `TextField`. It forwards native textarea props such as `rows`, `value`, `defaultValue`, `onChange`, `name`, and `disabled`, and uses the same `label`, `hint`, and `error` props. It also works inside `FormField` for schema validation.

`TextField`, `TextArea`, and `SelectField` accept `helpText`. When provided, a question-mark button appears beside the label and reveals the help text on click or keyboard activation. `hint` stays visible below the input; `helpText` stays hidden until requested.

`TagInput` accepts `value` and `onChange` for controlled tags, or `defaultValue` for local state. Press Enter or comma to add a tag; Backspace removes the last tag when the input is empty. It also supports `maxTags`, `allowDuplicates`, `addOnBlur`, `hint`, and `error`.

`PasswordInput` works like `TextField` and adds an eye button to show or hide the password. Visibility can be controlled with `visible` and `onVisibilityChange`, or managed locally with `defaultVisible`.

`Switch` is a native checkbox with switch semantics and optional `label` and `description`. Use `checked` and a boolean `onChange` callback for controlled state, or `defaultChecked` for native local state. It supports `sm` and `md` sizes plus standard input props such as `name`, `value`, and `disabled`.

`ButtonGroup` presents a single choice as connected buttons backed by native radio inputs. Pass string options or `{ value, label, disabled }` objects, plus `ariaLabel` to name the group. Use `value` and `onChange` for controlled selection, or `defaultValue` for local selection. `name` and `required` support HTML forms, and `disabled` disables the full group.

## Validated forms

`Form` and `FormField` connect the library's controls to [React Hook Form](https://react-hook-form.com/) and schema validation. Install the peer dependency and the compatible Zod resolver used by the examples:

```sh
npm install react-hook-form@^7.90.0 @hookform/resolvers@4.1.3 zod@3.24.4
```

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form, FormField, TextField } from '@kiteapps/lite-ui';

const schema = z.object({ server: z.string().trim().min(1, 'Enter a server name') });

function ServerSettings({ onSave }) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { server: '' },
    mode: 'onBlur',
  });

  return <Form form={methods} onSubmit={onSave}>
    <FormField control={methods.control} name="server" label="Server name" required render={({ field, inputProps }) =>
      <TextField {...field} {...inputProps} placeholder="server.example.com" />
    } />
    <Button type="submit" variant="primary">Save settings</Button>
  </Form>;
}
```

`FormField` supplies a linked label, hint, error message, and accessibility props through `inputProps`. Pass `control` for TypeScript field-name inference; inside `Form`, it can also read the control from context. The same render prop works with `PasswordInput` and `SelectField`. For `Switch` and `TagInput`, pass `field.value` to `checked` or `value` and `field.onChange` to `onChange`; the Components/Form playground in Storybook shows each control. `FormRow` also accepts `htmlFor`, `hint`, and `error` without a form provider. Its `required` marker is visual; put the validation rule in the schema.

`ShellFooter` items accept an `icon` name (`book`, `lightbulb`, `send`, `messages`, or `phone`) or a Lucide icon component. Set `iconColor` and `iconSize` on each item; the ShellFooter story exposes these fields in Controls. For example: `<ShellFooter items={[{ id: 'guide', label: 'Admin Guide', icon: 'book', iconColor: '#3188b5', iconSize: 14 }]} />`.

## Design tokens and styling

Import `@kiteapps/lite-ui/styles.css` once. The reference palette and scale live in `src/components/admin-ui.css` using `--ad-*` CSS variables. Components use the `ad-` class prefix so they can be composed outside the demo app. Pass `className` to the controls that expose it for local layout changes.

## Reference coverage

The current example app covers the administrator shell, Dashboard, Reports, Configuration, and several Admin settings screens. It reproduces reusable interaction patterns from the public demo rather than connecting to ADSelfService Plus. Values and save confirmations are local example data. Additional reference screens can be built from the exported components and added as independent Storybook stories.
