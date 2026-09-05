export const fetchIncomeStatement = async (symbol, period = 'annual') => {
  const response = await fetch(`/api/financials?symbol=${encodeURIComponent(symbol)}&period=${encodeURIComponent(period)}`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load income statements.');
  return data.rows;
};
