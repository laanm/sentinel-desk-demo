import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type Alert = {
  id: string;
  title: string;
  detail: string;
  asset: string;
  severity: Severity;
  time: string;
  source: string;
  recommendation: string;
  acknowledged: boolean;
};
type Asset = { name: string; category: string; owner: string; risk: Severity; lastSeen: string; status: string };

const initialAlerts: Alert[] = [
  { id: 'ALT-2841', title: 'Suspicious sign-in from new location', detail: 'A privileged account signed in from an unfamiliar location after multiple failed attempts.', asset: 'Identity Gateway', severity: 'Critical', time: '2 min ago', source: 'Identity', recommendation: 'Verify the sign-in with the account owner and review recent sessions.', acknowledged: false },
  { id: 'ALT-2839', title: 'Unusual outbound traffic detected', detail: 'The application server sent an unusually large volume of data to an unrecognized endpoint.', asset: 'app-prod-03', severity: 'High', time: '11 min ago', source: 'Network', recommendation: 'Inspect destination traffic and validate the application workload.', acknowledged: false },
  { id: 'ALT-2837', title: 'Endpoint protection disabled', detail: 'Endpoint protection stopped reporting from a workstation in the Finance group.', asset: 'fin-ws-018', severity: 'High', time: '24 min ago', source: 'Endpoint', recommendation: 'Contact the device owner and restore endpoint protection coverage.', acknowledged: false },
  { id: 'ALT-2835', title: 'New public storage policy', detail: 'A storage bucket policy changed from private to public access.', asset: 'media-archive', severity: 'Medium', time: '46 min ago', source: 'Cloud', recommendation: 'Review the policy change and restrict access if it was not intended.', acknowledged: false },
  { id: 'ALT-2832', title: 'Patch window approaching', detail: 'A database instance has a scheduled security update within the next 48 hours.', asset: 'db-customer-01', severity: 'Low', time: '1 hr ago', source: 'Infrastructure', recommendation: 'Confirm the maintenance window with the service owner.', acknowledged: true },
];

const assets: Asset[] = [
  { name: 'Identity Gateway', category: 'Identity service', owner: 'Platform Security', risk: 'Critical', lastSeen: 'Just now', status: 'Needs review' },
  { name: 'app-prod-03', category: 'Application server', owner: 'Core Platform', risk: 'High', lastSeen: '2 min ago', status: 'Investigating' },
  { name: 'fin-ws-018', category: 'Workstation', owner: 'Finance IT', risk: 'High', lastSeen: '7 min ago', status: 'Needs review' },
  { name: 'media-archive', category: 'Cloud storage', owner: 'Media Operations', risk: 'Medium', lastSeen: '11 min ago', status: 'Monitoring' },
  { name: 'db-customer-01', category: 'Database', owner: 'Data Platform', risk: 'Low', lastSeen: '14 min ago', status: 'Healthy' },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    shield: <><path d="M12 2 3.5 5.5v5.7c0 5.4 3.6 8.8 8.5 10.8 4.9-2 8.5-5.4 8.5-10.8V5.5L12 2Z"/><path d="m9 12 2 2 4-4"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    alert: <><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5m0 3h.01"/></>,
    box: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18m-13 5h3"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="M5 5 19 19M19 5 5 19"/>,
    pulse: <path d="M2 12h5l2.5-6 4 12 2.5-6H22"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function App() {
  const [section, setSection] = useState<'overview' | 'alerts' | 'assets'>('overview');
  const [alerts, setAlerts] = useState(initialAlerts);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<'All' | Severity>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = alerts.find((alert) => alert.id === selectedId);
  const openCount = alerts.filter((alert) => !alert.acknowledged).length;
  const filteredAlerts = useMemo(() => alerts.filter((alert) => {
    const matchesSeverity = severity === 'All' || alert.severity === severity;
    const matchesQuery = `${alert.title} ${alert.asset} ${alert.id}`.toLowerCase().includes(query.toLowerCase());
    return matchesSeverity && matchesQuery;
  }), [alerts, query, severity]);
  const filteredAssets = useMemo(() => assets.filter((asset) => {
    const matchesSeverity = severity === 'All' || asset.risk === severity;
    const matchesQuery = `${asset.name} ${asset.category} ${asset.owner}`.toLowerCase().includes(query.toLowerCase());
    return matchesSeverity && matchesQuery;
  }), [query, severity]);

  function navigate(next: 'overview' | 'alerts' | 'assets') {
    setSection(next);
    setQuery('');
    setSeverity('All');
  }
  function acknowledge(id: string) {
    setAlerts((previous) => previous.map((alert) => alert.id === id ? { ...alert, acknowledged: true } : alert));
  }

  return <div className="app-shell">
    <aside className="sidebar" aria-label="Navegación principal">
      <div className="brand"><span className="brand-mark"><Icon name="shield" size={21}/></span><span><strong>sentinel<span className="brand-dot">.</span></strong><small>SECURITY DESK</small></span></div>
      <p className="nav-label">WORKSPACE</p>
      <nav className="nav-list">
        <button className={section === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('overview')} aria-current={section === 'overview' ? 'page' : undefined}><Icon name="grid"/>Overview</button>
        <button className={section === 'alerts' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('alerts')} aria-current={section === 'alerts' ? 'page' : undefined}><Icon name="alert"/>Alerts<span className="nav-count">{openCount}</span></button>
        <button className={section === 'assets' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('assets')} aria-current={section === 'assets' ? 'page' : undefined}><Icon name="box"/>Assets</button>
      </nav>
      <div className="sidebar-bottom"><span className="online-indicator"/> Demo workspace <small>Synthetic data · Local interactions</small></div>
    </aside>

    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">Workspace <Icon name="arrow" size={13}/> <strong>{section === 'overview' ? 'Overview' : section === 'alerts' ? 'Alerts' : 'Assets'}</strong></div><div className="top-right"><span className="live-pill"><span className="online-indicator"/> Demo environment</span><div className="avatar" aria-label="Demo user">AD</div></div></header>
      <div className="content-wrap">
        <div className="page-heading"><div><p className="eyebrow">SECURITY OPERATIONS</p><h1>{section === 'overview' ? 'Security overview' : section === 'alerts' ? 'Alert center' : 'Asset inventory'}</h1><p className="subtitle">{section === 'overview' ? 'A clear view of what needs attention right now.' : section === 'alerts' ? 'Review and triage signals across your environment.' : 'Understand ownership and risk at a glance.'}</p></div><span className="date-chip">● &nbsp; Sample environment</span></div>

        {section === 'overview' && <>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-top"><span>Open alerts</span><span className="metric-icon amber"><Icon name="alert"/></span></div><strong>{openCount.toString().padStart(2, '0')}</strong><small>Requiring review</small></div>
            <div className="metric-card"><div className="metric-top"><span>Critical risks</span><span className="metric-icon red"><Icon name="pulse"/></span></div><strong>01</strong><small>Across monitored assets</small></div>
            <div className="metric-card"><div className="metric-top"><span>Assets tracked</span><span className="metric-icon blue"><Icon name="box"/></span></div><strong>{assets.length.toString().padStart(2, '0')}</strong><small>In this demo workspace</small></div>
          </div>
          <div className="section-heading"><div><h2>Priority alerts</h2><p>Recent activity that may need an analyst.</p></div><button className="text-button" onClick={() => navigate('alerts')}>View all alerts <Icon name="arrow" size={15}/></button></div>
          <div className="panel alert-list">{alerts.filter((alert) => !alert.acknowledged).slice(0, 4).map((alert) => <AlertRow key={alert.id} alert={alert} onSelect={() => setSelectedId(alert.id)}/>)}</div>
          <div className="section-heading asset-heading"><div><h2>Assets at a glance</h2><p>Risk level and ownership in one place.</p></div><button className="text-button" onClick={() => navigate('assets')}>View inventory <Icon name="arrow" size={15}/></button></div>
          <div className="panel asset-table-wrap"><AssetTable rows={assets.slice(0, 3)}/></div>
        </>}

        {section !== 'overview' && <>
          <div className="toolbar"><label className="search-field"><Icon name="search" size={18}/><span className="sr-only">Buscar {section === 'alerts' ? 'alertas' : 'activos'}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={section === 'alerts' ? 'Search alerts or assets...' : 'Search assets or owners...'}/></label><label className="severity-field"><span>Severity</span><select value={severity} onChange={(event) => setSeverity(event.target.value as 'All' | Severity)}><option>All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label></div>
          {section === 'alerts' ? <div className="panel alert-list"><div className="list-caption">{filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'} shown</div>{filteredAlerts.length ? filteredAlerts.map((alert) => <AlertRow key={alert.id} alert={alert} onSelect={() => setSelectedId(alert.id)}/>) : <div className="empty-state">No alerts match your filters.</div>}</div> : <div className="panel asset-table-wrap"><div className="list-caption">{filteredAssets.length} {filteredAssets.length === 1 ? 'asset' : 'assets'} shown</div>{filteredAssets.length ? <AssetTable rows={filteredAssets}/> : <div className="empty-state">No assets match your filters.</div>}</div>}
        </>}
        <footer>Portfolio demo · All names, alerts and metrics are fictional.</footer>
      </div>
    </main>

    {selected && <div className="drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}><section className="detail-drawer" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="drawer-header"><span>ALERT DETAILS</span><button className="icon-button" aria-label="Close alert details" onClick={() => setSelectedId(null)}><Icon name="close"/></button></div><div className="drawer-content"><SeverityBadge severity={selected.severity}/><h2 id="detail-title">{selected.title}</h2><p className="drawer-id">{selected.id} · {selected.time}</p><div className="drawer-divider"/><p className="drawer-section-label">WHAT HAPPENED</p><p className="drawer-text">{selected.detail}</p><div className="detail-grid"><div><span>Asset</span><strong>{selected.asset}</strong></div><div><span>Source</span><strong>{selected.source}</strong></div><div><span>Status</span><strong>{selected.acknowledged ? 'Acknowledged' : 'Needs review'}</strong></div></div><p className="drawer-section-label">SUGGESTED NEXT STEP</p><p className="drawer-text">{selected.recommendation}</p></div><div className="drawer-footer"><button className="primary-button" onClick={() => acknowledge(selected.id)} disabled={selected.acknowledged}><Icon name="check" size={17}/>{selected.acknowledged ? 'Acknowledged' : 'Acknowledge alert'}</button></div></section></div>}
  </div>;
}

function SeverityBadge({ severity }: { severity: Severity }) { return <span className={`severity severity-${severity.toLowerCase()}`}><span className="severity-dot"/>{severity}</span>; }
function AlertRow({ alert, onSelect }: { alert: Alert; onSelect: () => void }) { return <button className="alert-row" onClick={onSelect} aria-label={`View ${alert.severity.toLowerCase()} alert: ${alert.title}`}><span className={`alert-symbol severity-${alert.severity.toLowerCase()}`}><Icon name="alert" size={17}/></span><span className="alert-main"><strong>{alert.title}</strong><small>{alert.asset} <span>·</span> {alert.id}</small></span><span className="row-right"><SeverityBadge severity={alert.severity}/><small>{alert.acknowledged ? 'Acknowledged' : alert.time}</small></span><Icon name="arrow" size={16}/></button>; }
function AssetTable({ rows }: { rows: Asset[] }) { return <div className="table-scroll"><table><thead><tr><th scope="col">ASSET</th><th scope="col">OWNER</th><th scope="col">RISK</th><th scope="col">STATUS</th><th scope="col">LAST SEEN</th></tr></thead><tbody>{rows.map((asset) => <tr key={asset.name}><td><strong>{asset.name}</strong><small>{asset.category}</small></td><td>{asset.owner}</td><td><SeverityBadge severity={asset.risk}/></td><td><span className="status-dot"/>{asset.status}</td><td>{asset.lastSeen}</td></tr>)}</tbody></table></div>; }

createRoot(document.getElementById('root')!).render(<App/>);
