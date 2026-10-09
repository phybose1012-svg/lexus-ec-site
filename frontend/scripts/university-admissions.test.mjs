import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';
import {
  universityAdmissionsOfficialProfiles,
  validateUniversityAdmissions,
  createUniversityAdmissionsIndex,
  renderUniversityAdmissions,
  universityAdmissionsMetadata,
  applyUniversityAdmissionsFromIndex,
  applyVerifiedUniversityAdmissions,
} from '../src/lib/universityAdmissions.ts';
// Staging intentionally has no main-only safety module. Test its shape using
// an explicit safe article fixture when that module is absent.
const safetyUrl=new URL('../src/lib/universityInfoSafety.ts',import.meta.url);
const transformUniversityInfoPost=fs.existsSync(safetyUrl)
  ? (await import(safetyUrl.href)).transformUniversityInfoPost
  : raw=>{
    if(!universityAdmissionsOfficialProfiles.some(p=>p.path===raw.path)||raw.template!=='admission-info')return raw;
    const overview=raw.contentHtml.split(/<h2\b[^>]*>(?:<strong>)?(?:一般選抜情報|一次選抜情報)/)[0];
    return {...raw,infoItems:raw.infoItems.map(i=>i.label==='年度'?{...i,value:'過年度参考（最新は大学公式要項）'}:i),contentHtml:`<p data-university-info-safety="overview">大学概要の過年度参考情報。</p>${overview}<h2 id="最新の入試情報">最新の入試情報を確認する</h2><p>大学公式の学生募集要項をご確認ください。</p>`};
  };

const admissionPosts=JSON.parse(fs.readFileSync(new URL('../src/data/generated/admissionInfoPosts.json',import.meta.url),'utf8'));
const fixture=()=>({
  path:'/information-yamanashi/',university:'山梨大学',admissionYear:2027,
  verifiedAt:'2026-10-09T15:00:00+09:00',
  sources:[{id:'guideline',url:'https://www.yamanashi.ac.jp/test-only-2027-guideline.pdf',title:'単体テスト用の公式ドメイン・架空資料',retrievedAt:'2026-10-09T14:00:00+09:00',sha256:'a'.repeat(64),pages:[2,3]}],
  schemes:[{id:'general-late',name:'一般選抜（後期）',
    scheduleRows:[{label:'出願期間・締切',value:'テスト用の日程 <必着> & 条件',sourceIds:['guideline'],status:'confirmed'}],
    examRows:[{label:'情報Ⅰ・配点',value:'未公表（最新の公式入試案内に配点の公表なし）',sourceIds:['guideline'],status:'unpublished'}],
    venueRows:[{label:'二次試験会場',value:'要確認（受験票の指定を確認）',sourceIds:['guideline'],status:'needs-confirmation'}],
    notes:[{text:'一次と二次を取り違えない。<script>alert("x")</script>',sourceIds:['guideline']}]}],
  coverageNotes:['このデータは単体テスト用。実在の日程や配点を表さない。'],
});
const load=doc=>createUniversityAdmissionsIndex({'../data/universityAdmissions/yamanashi.json':doc});
const tree=html=>parse(html);
const find=(node,fn,out=[])=>{if(fn(node))out.push(node);for(const child of node.childNodes??[])find(child,fn,out);return out;};
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');

test('only explicit 81 universities enter scope, and an empty index changes nothing on either branch',()=>{
  assert.equal(universityAdmissionsOfficialProfiles.length,81);
  assert.equal(new Set(universityAdmissionsOfficialProfiles.map(p=>p.path)).size,81);
  for(const raw of admissionPosts){
    assert.equal(applyUniversityAdmissionsFromIndex(raw,new Map()),raw);
    const main=transformUniversityInfoPost(raw);
    assert.equal(applyUniversityAdmissionsFromIndex(main,new Map()),main);
    // Node has no Vite env/glob loader, so pure imports have no production input.
    assert.equal(applyVerifiedUniversityAdmissions(raw),raw);
  }
});

test('malformed, previous-year, wrong university, unofficial source and broken citations fail closed',()=>{
  const cases=[
    d=>{d.admissionYear=2026;},
    d=>{d.path='/information-unknown/';},
    d=>{d.university='徳島大学';},
    d=>{d.sources[0].url='https://www.tokushima-u.ac.jp/guide.pdf';},
    d=>{d.sources[0].url='https://www.yamanashi.ac.jp.attacker.example/guide.pdf';},
    d=>{d.sources[0].url='http://www.yamanashi.ac.jp/guide.pdf';},
    d=>{d.sources[0].url='https://user:password@www.yamanashi.ac.jp/guide.pdf';},
    d=>{d.sources[0].retrievedAt='2026-10-10';},
    d=>{d.verifiedAt='2026-02-31';},
    d=>{d.sources[0].sha256='abc';},
    d=>{d.schemes[0].examRows[0].sourceIds=['not-found'];},
    d=>{d.schemes[0].venueRows=[];},
    d=>{d.schemes[0].scheduleRows[0].value=' ';},
    d=>{d.schemes[0].examRows[0].value='100点';},
    d=>{d.schemes[0].venueRows[0].value='本学';},
    d=>{d.sources.push({...d.sources[0]});},
    d=>{d.schemes.push({...d.schemes[0]});},
    d=>{d.coverageNotes=[];},
  ];
  for(const alter of cases){const d=fixture();alter(d);assert.throws(()=>load(d),/University admissions data/);}
  assert.throws(()=>createUniversityAdmissionsIndex({'../data/universityAdmissions/tokushima.json':fixture()}),/filename/);
  assert.throws(()=>createUniversityAdmissionsIndex({'a/yamanashi.json':fixture(),'b/yamanashi.json':fixture()}),/duplicate university path/);
});

test('rows and notes are escaped, semantic tables keep each scheme/value/source and unknown status explicit',()=>{
  const data=validateUniversityAdmissions(fixture());
  const html=renderUniversityAdmissions(data);
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  const doc=tree(html);
  const wrapper=find(doc,n=>attr(n,'data-university-admissions-year')==='2027');
  assert.equal(wrapper.length,1);
  const schemes=find(doc,n=>attr(n,'data-admission-scheme')==='general-late');
  assert.equal(schemes.length,1);
  const tables=find(schemes[0],n=>n.tagName==='table');
  assert.deepEqual(tables.map(n=>attr(n,'data-admission-table')),['schedule','exam','venue']);
  for(const [i,table] of tables.entries()){
    assert.equal(find(table,n=>n.tagName==='caption').length,1);
    assert.deepEqual(find(table,n=>n.tagName==='th'&&attr(n,'scope')==='col').map(text),['項目','内容','公式出典']);
    assert.equal(find(table,n=>n.tagName==='th'&&attr(n,'scope')==='row').length,1);
    assert.equal(attr(find(table,n=>n.tagName==='tr'&&attr(n,'data-admission-row')==='0')[0],'data-admission-status'),['confirmed','unpublished','needs-confirmation'][i]);
  }
  assert.equal(text(find(tables[0],n=>attr(n,'data-admission-value')!==undefined)[0]),data.schemes[0].scheduleRows[0].value);
  assert.equal(text(find(schemes[0],n=>attr(n,'data-admission-note-text')!==undefined)[0]),data.schemes[0].notes[0].text);
  assert.equal(text(find(doc,n=>attr(n,'data-admission-coverage-note')==='0')[0]),data.coverageNotes[0]);
});

test('staging old blocks and main safety blocks are replaced; metadata, TOC, overview and repeat application stay consistent',()=>{
  const raw=admissionPosts.find(p=>p.path==='/information-yamanashi/');
  const index=load(fixture());
  for(const before of [raw,transformUniversityInfoPost(raw)]){
    const original=JSON.stringify(before);
    const after=applyUniversityAdmissionsFromIndex(before,index);
    assert.equal(JSON.stringify(before),original,'input must not be mutated');
    assert.ok(after.contentHtml.includes('大学基本情報'));
    assert.ok(after.contentHtml.includes('男性87名'));
    assert.ok(!after.contentHtml.includes('data-university-info-safety'));
    assert.equal(find(tree(after.contentHtml),n=>attr(n,'data-university-admissions-overview')!==undefined).length,1);
    assert.ok(!after.contentHtml.includes('2025/3/12'));
    assert.ok(!after.contentHtml.includes('<h2 id="一般選抜情報">'));
    assert.equal(after.infoItems.find(i=>i.label==='年度')?.value,'2027年度（入試情報）');
    const meta=universityAdmissionsMetadata(index.get(raw.path));
    for(const key of ['title','displayTitle','description','lead','modified'])assert.equal(after[key],meta[key]);
    const headings=find(tree(after.contentHtml),n=>/^h[23]$/.test(n.tagName??'')).map(n=>({id:attr(n,'id'),text:text(n).trim(),level:Number(n.tagName[1])}));
    assert.deepEqual(after.toc,headings);
    assert.equal(new Set(after.toc.map(i=>i.id)).size,after.toc.length);
    assert.deepEqual(applyUniversityAdmissionsFromIndex(after,index),after);
  }
  const unrelated=admissionPosts.find(p=>p.path==='/information-tokushima/');
  assert.equal(applyUniversityAdmissionsFromIndex(unrelated,index),unrelated);
  const otherTemplate={...raw,template:'university-entrance-strategy'};
  assert.equal(applyUniversityAdmissionsFromIndex(otherTemplate,index),otherTemplate);
});

test('an allowed university-operated external admissions domain is accepted only for its university',()=>{
  const iwate={...fixture(),path:'/information-iwate/',university:'岩手医科大学'};
  iwate.sources[0].url='https://www.imu-admission.jp/guidelines/';
  assert.equal(validateUniversityAdmissions(iwate).university,'岩手医科大学');
  iwate.path='/information-yamanashi/';iwate.university='山梨大学';
  assert.throws(()=>validateUniversityAdmissions(iwate),/not official/);
});

const withCommonTestSource=()=>{
  const data=fixture();
  data.sources.push({id:'dnc',url:'https://www.dnc.ac.jp/kyotsu/shiken_jouhou/r9/',title:'大学入試センター 令和9年度共通テスト',retrievedAt:'2026-10-09T14:00:00+09:00'});
  data.schemes[0].scheduleRows.push({label:'大学入学共通テスト（本試験）',value:'2027年1月16日（土）・17日（日）。',sourceIds:['dnc'],status:'confirmed'});
  return data;
};

test('DNC nationwide dates coexist with university evidence; adopted subjects still cite the university',()=>{
  const data=withCommonTestSource(),before=JSON.stringify(data);
  const validated=validateUniversityAdmissions(data);
  assert.equal(validated.sources.at(-1).url,'https://www.dnc.ac.jp/kyotsu/shiken_jouhou/r9/');
  assert.deepEqual(validated.schemes[0].scheduleRows.at(-1).sourceIds,['dnc']);
  data.schemes[0].scheduleRows.at(-1).value+='本学では指定6教科8科目を受験。';
  data.schemes[0].scheduleRows.at(-1).sourceIds.push('guideline');
  assert.deepEqual(validateUniversityAdmissions(data).schemes[0].scheduleRows.at(-1).sourceIds,['dnc','guideline']);
  assert.equal(JSON.stringify(validated),before,'validation preserves every original claim and source');
});

test('DNC look-alike hosts, unrelated universities and prep-school sources are rejected',()=>{
  for(const url of ['https://dnc.ac.jp.evil/guide.pdf','https://www.dnc.ac.jp.attacker.example/guide.pdf','https://not-dnc.ac.jp/guide.pdf','https://www.tokushima-u.ac.jp/guide.pdf','https://prep-school.example/guide.pdf']){
    const data=withCommonTestSource();data.sources.at(-1).url=url;
    assert.throws(()=>validateUniversityAdmissions(data),/not official/,url);
  }
});

test('DNC cannot replace university sources or supply university-specific claims under a Common Test label',()=>{
  const onlyDnc=fixture();onlyDnc.sources[0].url='https://www.dnc.ac.jp/kyotsu/shiken_jouhou/r9/';
  assert.throws(()=>validateUniversityAdmissions(onlyDnc),/at least one official source/);
  const wrongScope=withCommonTestSource();wrongScope.schemes[0].scheduleRows[0].sourceIds=['guideline','dnc'];
  assert.throws(()=>validateUniversityAdmissions(wrongScope),/explicitly named Common Test/);
  const universityScore=withCommonTestSource();universityScore.schemes[0].examRows[0]={label:'共通テスト・情報Ⅰの配点',value:'100点に換算。',sourceIds:['dnc'],status:'confirmed'};
  assert.throws(()=>validateUniversityAdmissions(universityScore),/university-specific conditions/);
  const hiddenRequirement=withCommonTestSource();hiddenRequirement.schemes[0].scheduleRows.at(-1).value+='指定6教科8科目を受験。';
  assert.throws(()=>validateUniversityAdmissions(hiddenRequirement),/university-specific conditions/);
  const falseDate=withCommonTestSource();falseDate.schemes[0].scheduleRows.at(-1).value='100点';
  assert.throws(()=>validateUniversityAdmissions(falseDate),/university-specific conditions/);
});

test('partly confirmed rows may name the remaining unpublished detail without inventing a value',()=>{
  const data=fixture();data.schemes[0].scheduleRows[0]={label:'出願期間',value:'テスト用の確認済み期間。締切時刻は未公表。',sourceIds:['guideline'],status:'needs-confirmation'};
  assert.equal(validateUniversityAdmissions(data).schemes[0].scheduleRows[0].value,data.schemes[0].scheduleRows[0].value);
  data.schemes[0].scheduleRows[0].value='確認済み期間と締切時刻。';
  assert.throws(()=>validateUniversityAdmissions(data),/needs-confirmation status/);
});
