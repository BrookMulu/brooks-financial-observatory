export const columns = [['date','Period ending'],['revenue','Revenue'],['netIncome','Net income'],['grossProfit','Gross profit'],['eps','EPS'],['operatingIncome','Operating income']];
export const emptyFilters = { startYear:'', endYear:'', minRevenue:'', maxRevenue:'', minNetIncome:'', maxNetIncome:'' };
export const numeric = value => typeof value === 'number' && Number.isFinite(value);
export const margin = row => numeric(row?.netIncome) && numeric(row?.revenue) && row.revenue !== 0 ? row.netIncome / row.revenue * 100 : null;
export const growth = (current, previous) => numeric(current) && numeric(previous) && previous > 0 ? (current - previous) / previous * 100 : null;
export function filterError(f) {
  for (const [a,b,label] of [['startYear','endYear','Year'],['minRevenue','maxRevenue','Revenue'],['minNetIncome','maxNetIncome','Net income']]) {
    if (f[a] !== '' && f[b] !== '' && Number(f[a]) > Number(f[b])) return `${label}: the minimum must not exceed the maximum.`;
  }
  return '';
}
export function selectRows(rows, f, sort) {
  if (filterError(f)) return [];
  return rows.filter(row => {
    const year = Number(row.date.slice(0,4));
    return (!f.startYear || year >= Number(f.startYear)) && (!f.endYear || year <= Number(f.endYear)) &&
      [['minRevenue','revenue',1],['maxRevenue','revenue',-1],['minNetIncome','netIncome',1],['maxNetIncome','netIncome',-1]].every(([filter,key,sign]) =>
        f[filter] === '' || (numeric(row[key]) && (sign === 1 ? row[key] >= Number(f[filter]) : row[key] <= Number(f[filter]))));
  }).sort((a,b) => {
    const av=a[sort.key], bv=b[sort.key];
    if (av == null) return bv == null ? 0 : 1;
    if (bv == null) return -1;
    return (sort.key === 'date' ? av.localeCompare(bv) : av-bv) * (sort.direction === 'asc' ? 1 : -1);
  });
}
export function money(value, currency='USD', compact=false) {
  if (!numeric(value)) return '—';
  return new Intl.NumberFormat('en-US',{style:'currency',currency,notation:compact?'compact':'standard',maximumFractionDigits:compact?1:2}).format(value);
}
export function csv(rows) {
  const escape = value => '"'+String(value ?? '').replace(/^[=+@\t\r]/,"'").replaceAll('"','""')+'"';
  return [columns.map(([,label])=>label).concat('Currency'), ...rows.map(r=>columns.map(([key])=>r[key]).concat(r.reportedCurrency))].map(r=>r.map(escape).join(',')).join('\r\n');
}
