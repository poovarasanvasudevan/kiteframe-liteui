import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('navigates from login settings to the mail and SMS controls', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Login Settings/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Product Settings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Mail / SMS Settings' }));
  expect(screen.getByRole('heading', { level: 1, name: /Mail \/ SMS Server Settings/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('tab', { name: 'SMS Settings' }));
  expect(screen.getByText('SMS Provider')).toBeInTheDocument();
});

test('opens dashboard widgets and navigates from a metric to its report', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Dashboard', exact: true }));
  expect(screen.getByRole('button', { name: /Password Expiration 0 \/ 62/ })).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'MFA Reports' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Password Expiration 0 \/ 62/ }));
  expect(screen.getByRole('heading', { name: /Password Expired Users Report/ })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: 'Search Report' }), { target: { value: 'FIDO2' } });
  expect(screen.getByRole('button', { name: 'FIDO2 Passkeys Report' })).toBeInTheDocument();
});

test('opens Configuration, edits a policy, and expands another sidebar group', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Configuration', exact: true }));
  expect(screen.getByRole('heading', { level: 1, name: /Policy Configuration/ })).toBeInTheDocument();
  expect(screen.getByRole('table').querySelectorAll('tbody tr')).toHaveLength(7);
  fireEvent.click(screen.getByRole('button', { name: 'Edit Selfservice Users' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Policy Name' }), { target: { value: 'Updated Users' } });
  fireEvent.click(screen.getByRole('dialog').querySelector('.ad-button--primary'));
  expect(screen.getByText('Updated Users')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Administrative Tools' }));
  expect(screen.getByRole('button', { name: 'Quick Enrollment' })).toBeInTheDocument();
});
