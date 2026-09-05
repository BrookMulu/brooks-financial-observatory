import test from 'node:test';
import assert from 'node:assert/strict';
import {suggestions} from '../src/app/lib/search.mjs';
test('company names and aliases resolve to familiar tickers',()=>{for(const [query,symbol] of [['apple','AAPL'],['microsoft','MSFT'],['google','GOOGL'],['facebook','META'],['aapl','AAPL']])assert.equal(suggestions(query)[0].symbol,symbol);});
test('Apple primary listing ranks before foreign listing and duplicates merge',()=>{const rows=suggestions('apple',[{symbol:'AAPL.DE',name:'Apple Inc.'},{symbol:'AAPL',name:'Apple Inc.'}]);assert.equal(rows[0].symbol,'AAPL');assert.equal(rows.filter(r=>r.symbol==='AAPL').length,1);});
test('empty query suggests companies; unknown query has no fabricated match',()=>{assert.ok(suggestions('').length);assert.deepEqual(suggestions('zzzzzz'),[]);});
