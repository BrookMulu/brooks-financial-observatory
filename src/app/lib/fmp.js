const endpoints = new Set(['income-statement','search-symbol','search-name']);
export async function fmp(endpoint, params) {
  if (!endpoints.has(endpoint)) throw new Error('Unsupported request.');
  const key = process.env.FMP_API_KEY;
  if (!key) throw new Error('Financial data is not configured. Add FMP_API_KEY on the server.');
  const url = new URL(`https://financialmodelingprep.com/stable/${endpoint}`);
  for (const [name,value] of Object.entries({...params,apikey:key})) url.searchParams.set(name,value);
  let response;
  try { response = await fetch(url,{next:{revalidate:3600},signal:AbortSignal.timeout(15000)}); }
  catch { throw new Error('The data provider is unavailable. Please try again shortly.'); }
  if (!response.ok) {
    const messages={402:'Your data plan does not include this request. Try another company or reporting period.',401:'The data provider rejected the configured API key.',403:'Your data plan does not include this company or reporting period.',429:'The data provider’s request limit has been reached. Please try again later.'};
    throw new Error(messages[response.status] || 'The data provider could not complete this request.');
  }
  const data=await response.json();
  if (!Array.isArray(data)) throw new Error('The data provider returned an unexpected response.');
  return data;
}
export function apiError(error) { return Response.json({error:error.message || 'Unable to load financial data.'},{status:502}); }
