import { fmp, apiError } from '../../lib/fmp';
import { suggestions } from '../../lib/search.mjs';
export async function GET(request) {
  const query=new URL(request.url).searchParams.get('q')?.trim();
  if (!query || query.length>80) return Response.json({error:'Enter a company name or ticker (up to 80 characters).'},{status:400});
  const responses=await Promise.allSettled(['search-symbol','search-name'].map(endpoint=>fmp(endpoint,{query,limit:'8'})));
  const remote=responses.filter(r=>r.status==='fulfilled').flatMap(r=>r.value).filter(r=>/^[A-Z0-9.^-]{1,20}$/.test(r.symbol)&&typeof r.name==='string').map(r=>({symbol:r.symbol,name:r.name,exchange:r.exchangeShortName||r.exchange}));
  const results=suggestions(query,remote);
  if (!results.length&&responses.every(r=>r.status==='rejected')) return apiError(responses[0].reason);
  return Response.json({results});
}
