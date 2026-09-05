export const suggestedCompanies = [
  {symbol:'AAPL',name:'Apple Inc.',exchange:'NASDAQ'},
  {symbol:'MSFT',name:'Microsoft Corporation',exchange:'NASDAQ'},
  {symbol:'GOOGL',name:'Alphabet Inc. (Google)',exchange:'NASDAQ'},
  {symbol:'NVDA',name:'NVIDIA Corporation',exchange:'NASDAQ'},
  {symbol:'AMZN',name:'Amazon.com, Inc.',exchange:'NASDAQ'},
  {symbol:'TSLA',name:'Tesla, Inc.',exchange:'NASDAQ'},
  {symbol:'META',name:'Meta Platforms, Inc. (Facebook)',exchange:'NASDAQ'},
];
export function suggestions(query, remote=[]) {
  const q=query.trim().toLowerCase();
  const matches=r=>r.symbol.toLowerCase().includes(q)||r.name?.toLowerCase().includes(q);
  const local=suggestedCompanies.filter(matches);
  const unique=[...new Map([...remote.filter(matches),...local].map(r=>[r.symbol,r])).values()];
  const score=r=>(r.symbol.toLowerCase()===q?100:0)+(r.name.toLowerCase().startsWith(q)?30:0)+(local.some(l=>l.symbol===r.symbol)?20:0)+(r.symbol.toLowerCase().startsWith(q)?10:0);
  return unique.sort((a,b)=>score(b)-score(a)||a.symbol.localeCompare(b.symbol)).slice(0,8);
}
