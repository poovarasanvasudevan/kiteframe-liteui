import React, { useEffect, useState } from 'react';

export function StoryPreview({ children, width, minHeight = 180 }) {
  return <div style={{ padding: 24, minHeight, background: '#f7f8f8' }}><div style={{ width: '100%', maxWidth: width }}>{children}</div></div>;
}

export function ActionStatus({ children }) {
  return <p role="status" style={{ marginTop: 16, padding: '8px 10px', background: '#fff', border: '1px solid #dce3e5', width: 'fit-content', minWidth: 190 }}>
    {children || 'Try a control'}
  </p>;
}

export const source = code => ({ docs: { source: { code } } });

// Preview interactions remain responsive while edits in Storybook Controls still win.
export function usePreviewValue(value) {
  const [current, setCurrent] = useState(value);
  useEffect(() => setCurrent(value), [value]);
  return [current, setCurrent];
}
