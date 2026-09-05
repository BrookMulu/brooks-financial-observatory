import { fmp, apiError } from '../../lib/fmp';
export async function GET(request) {
  const {searchParams}=new URL(request.url);
  const symbol=(searchParams.get('symbol')||'AAPL').toUpperCase();
  const period=searchParams.get('period')||'annual';
  if (!/^[A-Z0-9.^-]{1,20}$/.test(symbol) || !['annual','quarter'].includes(period)) return Response.json({error:'Choose a valid ticker and reporting period.'},{status:400});
  try {
    const raw=await fmp('income-statement',{symbol,period});
    const rows=raw.filter(r=>/^\d{4}-\d{2}-\d{2}$/.test(r.date)).map(r=>{
      const row={date:r.date,period:r.period,fiscalYear:r.fiscalYear,reportedCurrency:/^[A-Z]{3}$/.test(r.reportedCurrency)?r.reportedCurrency:'USD'};
      for (const key of ['revenue','netIncome','grossProfit','eps','operatingIncome']) row[key]=typeof r[key]==='number' && Number.isFinite(r[key])?r[key]:null;
      return row;
    }).sort((a,b)=>b.date.localeCompare(a.date));
    return Response.json({symbol,period,rows,fetchedAt:new Date().toISOString()});
  } catch(error) {return apiError(error);}
}
