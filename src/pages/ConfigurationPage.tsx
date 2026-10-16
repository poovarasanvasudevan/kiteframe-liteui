import type * as React from 'react';
import { useState } from 'react';
import {
  Button, CheckRow, FormRow, Modal, Panel, TextField,
  CONFIG_GROUPS, DEMO_POLICIES, POLICY_FEATURES, POLICY_COLUMNS,
  ConfigurationHeader, PolicyFeatureStrip, PolicyTable, PolicyToolbar,
  type NavigationGroup, type NavigationItem, type PolicyRecord, type PolicyFeature, type PolicyColumn,
  type ConfigurationHeaderProps, type PolicyFeatureStripProps, type PolicyToolbarProps, type PolicyTableProps,
} from '../widgets';

export interface ConfigurationPageLabels {
  title?: string;
  copySuffix?: string;
  featuresTitle?: string;
  instruction?: React.ReactNode;
  policiesTitle?: string;
  add?: string;
  domain?: string;
  enable?: string;
  sectionDescription?: (title: string) => string;
  editTitle?: string;
  addTitle?: string;
  cancel?: string;
  save?: string;
  policyName?: string;
}
export interface ConfigurationPageProps {
  selected?: string;
  policyId?: string;
  groups?: NavigationGroup[];
  policies?: PolicyRecord[];
  initialPolicies?: PolicyRecord[];
  onPoliciesChange?: (policies: PolicyRecord[]) => void;
  features?: PolicyFeature[];
  columns?: PolicyColumn[];
  labels?: ConfigurationPageLabels;
  defaultDomain?: string;
  onSavePolicy?: (saved: PolicyRecord, previous: PolicyRecord) => void;
  onDeletePolicy?: (policy: PolicyRecord) => void;
  onCopyPolicy?: (copy: PolicyRecord, source: PolicyRecord) => void;
  onFeatureSelect?: (id: string, item: PolicyFeature) => void;
  createPolicy?: (name: string) => PolicyRecord;
  renderSection?: (selected: string, item?: NavigationItem) => React.ReactNode;
  renderPolicyForm?: (context: { policy: PolicyRecord | null; name: string; setName: React.Dispatch<React.SetStateAction<string>> }) => React.ReactNode;
  headerProps?: Partial<ConfigurationHeaderProps>;
  featureProps?: PolicyFeatureStripProps;
  toolbarProps?: PolicyToolbarProps;
  tableProps?: PolicyTableProps;
}
export function ConfigurationPage({ selected, policyId = 'policy', groups = CONFIG_GROUPS, policies, initialPolicies = DEMO_POLICIES, onPoliciesChange, features = POLICY_FEATURES, columns = POLICY_COLUMNS, labels = {}, defaultDomain = 'ADSELFSERVICE', onSavePolicy, onDeletePolicy, onCopyPolicy, onFeatureSelect, createPolicy, renderSection, renderPolicyForm, headerProps = {}, featureProps = {}, toolbarProps = {}, tableProps = {} }: ConfigurationPageProps) {
  const [localPolicies, setLocalPolicies] = useState(initialPolicies);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState<PolicyRecord | null>(null);
  const [name, setName] = useState('');
  const currentSelected = selected ?? policyId;
  const currentPolicies = policies ?? localPolicies;
  const update = (next: PolicyRecord[]) => { if (policies === undefined) setLocalPolicies(next); onPoliciesChange?.(next); };
  const item = groups.flatMap(group => group.items).find(entry => entry.id === currentSelected);
  const title = item?.label || labels.title || 'Policy Configuration';
  const filtered = currentPolicies.filter(policy => String(policy.name || '').toLowerCase().includes(query.toLowerCase()));
  const pageSize = Math.max(1, toolbarProps.pageSize ?? 25);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  const visiblePolicies = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const openEditor = (policy?: PolicyRecord) => { setEditor(policy || { name: '' }); setName(policy?.name || ''); };
  const savePolicy = () => {
    if (!editor || !name.trim()) return;
    const nextPolicy = editor.name ? { ...editor, name: name.trim() } : createPolicy ? createPolicy(name.trim()) : { name: name.trim(), permissions: '', domain: defaultDomain, modifiedBy: '', modified: '' };
    const next = editor.name ? currentPolicies.map(policy => policy === editor ? nextPolicy : policy) : [...currentPolicies, nextPolicy];
    update(next);
    onSavePolicy?.(nextPolicy, editor);
    setEditor(null);
  };
  const removePolicy = (policy: PolicyRecord) => { update(currentPolicies.filter(item => item !== policy)); onDeletePolicy?.(policy); };
  const copyPolicy = (policy: PolicyRecord) => { const copy = { ...policy, name: `${policy.name} ${labels.copySuffix || 'Copy'}` }; update([...currentPolicies, copy]); onCopyPolicy?.(copy, policy); };
  const otherSection = renderSection?.(currentSelected, item);
  return <div className="config-page">
    <ConfigurationHeader title={title} {...headerProps}/>
    {currentSelected === policyId ? <>
      <PolicyFeatureStrip {...featureProps} title={labels.featuresTitle ?? featureProps.title} instruction={labels.instruction ?? featureProps.instruction} features={features} onFeatureSelect={(id, feature) => { onFeatureSelect?.(id, feature); featureProps.onFeatureSelect?.(id, feature); }}/>
      <PolicyToolbar {...toolbarProps} title={labels.policiesTitle || toolbarProps.title} addLabel={labels.add || toolbarProps.addLabel} count={filtered.length} page={currentPage} onPageChange={next => { setPage(next); toolbarProps.onPageChange?.(next); }} query={query} onQueryChange={value => { setQuery(value); setPage(1); toolbarProps.onQueryChange?.(value); }} onAdd={() => { openEditor(); toolbarProps.onAdd?.(); }}/>
      <PolicyTable {...tableProps} policies={visiblePolicies} columns={columns} defaultDomain={defaultDomain} onEdit={policy => { openEditor(policy); tableProps.onEdit?.(policy); }} onDelete={policy => { removePolicy(policy); tableProps.onDelete?.(policy); }} onCopy={policy => { copyPolicy(policy); tableProps.onCopy?.(policy); }}/>
    </> : otherSection !== undefined ? otherSection : <Panel className="config-detail-panel">
      <h2>{title}</h2>
      <FormRow label={labels.domain || 'Select Domain'}><select className="ad-select" defaultValue={defaultDomain}><option>{defaultDomain}</option></select></FormRow>
      <CheckRow>{labels.enable || 'Enable'} {title}</CheckRow>
      <p>{labels.sectionDescription?.(title) || `Configure ${title.toLowerCase()} for the selected domain.`}</p>
    </Panel>}
    <Modal title={editor?.name ? (labels.editTitle || 'Edit Policy') : (labels.addTitle || 'Add New Policy')} open={!!editor} onClose={() => setEditor(null)} footer={<><Button onClick={() => setEditor(null)}>{labels.cancel || 'Cancel'}</Button><Button variant="primary" onClick={savePolicy}>{labels.save || 'Save'}</Button></>}>
      {renderPolicyForm ? renderPolicyForm({ policy: editor, name, setName }) : <TextField label={labels.policyName || 'Policy Name'} value={name} onChange={event => setName(event.target.value)}/>}
    </Modal>
  </div>;
}
