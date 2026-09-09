import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {contact,upper,lower,upperSlope,lowerSlope,area} from './build-fukuoka-2025-mathematics-figures.mjs';
test('Fukuoka curves have the same value and slope at the unique contact',()=>{
 assert.ok(Math.abs(upper(contact)-Math.SQRT2)<1e-12);
 assert.ok(Math.abs(lower(contact)-Math.SQRT2)<1e-12);
 assert.ok(Math.abs(upperSlope(contact)-lowerSlope(contact))<1e-12);
 for(let i=0;i<100;i++){const x=contact*i/100;assert.ok(upper(x)>lower(x));}
});
test('Fukuoka shaded area equals the integral over the stated interval',()=>{
 const n=10000,h=contact/n;let s=0;
 for(let i=0;i<n;i++){const x=(i+.5)*h;s+=(upper(x)-lower(x))*h;}
 assert.ok(Math.abs(s-area)<1e-8);
 assert.ok(area>0);
});
test('Fukuoka source figure ID is registered with a useful textual alternative',()=>{
 const m=JSON.parse(fs.readFileSync(new URL('../src/data/pastExamFigures/fukuoka-2025-general-keitobetsu-mathematics.json',import.meta.url)));
 assert.equal(m.items.length,1);assert.equal(m.items[0].id,'a7-area-shaded-region');
 assert.equal(m.restrictedSourceCopied,false);
 assert.match(m.items[0].alt,/π\/4,√2/);assert.match(m.items[0].alt,/上側.*下側/);
});
