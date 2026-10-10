import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {applyUniversityAdmissionsFromIndex} from '../src/lib/universityAdmissions.ts';
import {verifyYamaguchiHtml} from './verify-yamaguchi-readable.mjs';
const d=JSON.parse(fs.readFileSync(new URL('../src/data/universityAdmissions/yamaguchi.json',import.meta.url))),posts=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url))),raw=posts.find(p=>p.path===d.path),index=new Map([[d.path,d]]);
test('Yamaguchi restores the whole reviewed article and metadata after production safety',()=>{const expected=applyUniversityAdmissionsFromIndex(raw,index),safe={...raw,contentHtml:'<h2 id="最新の入試情報">最新の公式要項をご確認ください</h2>',infoItems:raw.infoItems.map(i=>i.label==='種別'?{...i,value:'大学概要・公式入試情報'}:i.label==='地域'?{...i,value:'全国'}:i.label==='年度'?{...i,value:'過年度参考'}:i)};assert.deepEqual(applyUniversityAdmissionsFromIndex(safe,index),expected);assert.equal(expected.infoItems.find(i=>i.label==='種別').value,'入試情報');assert.equal(expected.infoItems.find(i=>i.label==='地域').value,'中国');});
test('Yamaguchi retains all conditions, provenance, score totals and statistics',()=>{assert.equal(verifyYamaguchiHtml(applyUniversityAdmissionsFromIndex(raw,index).contentHtml).canonicalOrigins,93);});
test('Yamaguchi leaves unrelated paths and unsupported templates unchanged',()=>{const unrelated={...raw,path:'/information-saga/'};assert.equal(applyUniversityAdmissionsFromIndex(unrelated,index),unrelated);const otherTemplate={...raw,template:'standard'};assert.equal(applyUniversityAdmissionsFromIndex(otherTemplate,index),otherTemplate);});
