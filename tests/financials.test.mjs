import test from 'node:test';
import assert from 'node:assert/strict';
import {growth,margin,selectRows,emptyFilters,csv,filterError} from '../src/app/lib/financials.mjs';
const rows=[{date:'2023-12-31',revenue:30,netIncome:3,reportedCurrency:'USD'},{date:'2022-12-31',revenue:10,netIncome:-2,reportedCurrency:'USD'},{date:'2021-12-31',revenue:null,netIncome:0,reportedCurrency:'USD'}];
test('growth and margins handle zero, losses and missing values',()=>{assert.equal(growth(120,100),20);assert.equal(growth(5,0),null);assert.equal(growth(5,-10),null);assert.equal(margin(rows[0]),10);assert.equal(margin(rows[1]),-20);assert.equal(margin(rows[2]),null);});
test('sorting keeps missing values last in both directions without mutation',()=>{assert.deepEqual(selectRows(rows,emptyFilters,{key:'revenue',direction:'asc'}).map(r=>r.revenue),[10,30,null]);assert.deepEqual(selectRows(rows,emptyFilters,{key:'revenue',direction:'desc'}).map(r=>r.revenue),[30,10,null]);assert.equal(rows[0].revenue,30);});
test('combined year and numeric filters include zero and exclude missing values',()=>{const f={...emptyFilters,startYear:'2022',maxNetIncome:'0'};assert.deepEqual(selectRows(rows,f,{key:'date',direction:'asc'}).map(r=>r.date),['2022-12-31']);assert.equal(selectRows(rows,{...emptyFilters,minRevenue:'0'},{key:'date',direction:'desc'}).length,2);});
test('invalid ranges explain the problem',()=>{assert.match(filterError({...emptyFilters,startYear:'2025',endYear:'2020'}),/minimum/);});
test('CSV exports full precision, missing values and reporting currency',()=>{const output=csv(rows);assert.match(output,/"Currency"/);assert.match(output,/"30","3"/);assert.match(output,/"USD"/);assert.match(output,/"2021-12-31","","0"/);});
