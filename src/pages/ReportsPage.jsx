import React, { useState } from 'react';
import { REPORT_GROUPS, normalizeReport, ReportCategoryBar, ReportFilters, ReportResults, ReportPageHeading } from '../widgets';

export function ReportsPage({ groups = REPORT_GROUPS, selected, defaultSelected, onSelect, filtersProps = {}, labels = {}, status: controlledStatus, onGenerate, onStop, onSchedule, results }) {
  const firstReport = groups[0]?.items[0] && normalizeReport(groups[0].items[0]);
  const [localSelected, setLocalSelected] = useState(defaultSelected ?? firstReport?.id);
  const [localStatus, setLocalStatus] = useState('empty');
  const [showSchedule, setShowSchedule] = useState(false);
  const [localDomain, setLocalDomain] = useState(filtersProps.defaultDomain ?? (typeof filtersProps.domains?.[0] === 'string' ? filtersProps.domains[0] : filtersProps.domains?.[0]?.value) ?? 'ADSELFSERVICE');
  const [localOu, setLocalOu] = useState(filtersProps.defaultOu ?? (typeof filtersProps.ouOptions?.[0] === 'string' ? filtersProps.ouOptions[0] : filtersProps.ouOptions?.[0]?.value) ?? 'All OU');
  const currentSelected = selected ?? localSelected;
  const report = groups.flatMap(group => group.items.map(normalizeReport)).find(item => item.id === currentSelected);
  const title = report?.label || firstReport?.label || labels.untitled || '';
  const status = controlledStatus ?? localStatus;
  const domain = filtersProps.domain ?? localDomain;
  const ou = filtersProps.ou ?? localOu;
  const select = (id, item) => {
    if (selected === undefined) setLocalSelected(id);
    onSelect?.(id, item);
    if (controlledStatus === undefined) setLocalStatus('empty');
  };
  const generate = () => {
    if (onGenerate) onGenerate({ selected: currentSelected, report, domain, ou });
    else {
      setLocalStatus('loading');
      window.setTimeout(() => setLocalStatus('empty'), 650);
    }
  };
  const stop = () => {
    onStop?.();
    if (controlledStatus === undefined) setLocalStatus('empty');
  };
  return <div className="reports-page">
    <ReportCategoryBar groups={groups} selected={currentSelected} onSelect={select}/>
    <div className="report-page-body">
      <ReportPageHeading title={title} scheduleLabel={labels.schedule} helpText={labels.help} onSchedule={() => { onSchedule?.(report); setShowSchedule(!showSchedule); }}/>
      {showSchedule && <div className="report-schedule-note">{labels.scheduleNote || 'Schedule Reports lets you automate delivery of generated reports.'}</div>}
      <ReportFilters {...filtersProps} domain={domain} ou={ou} onDomainChange={(value, item) => { if (filtersProps.domain === undefined) setLocalDomain(value); filtersProps.onDomainChange?.(value, item); }} onOuChange={(value, item) => { if (filtersProps.ou === undefined) setLocalOu(value); filtersProps.onOuChange?.(value, item); }} generating={status === 'loading'} onGenerate={generate} onStop={stop}/>
      {results ?? <ReportResults status={status} emptyMessage={labels.empty} loadingMessage={labels.loading}/>}
    </div>
  </div>;
}
