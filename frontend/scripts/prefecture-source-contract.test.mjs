import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateUniversityAdmissions,renderUniversityAdmissions,createUniversityAdmissionsIndex} from '../src/lib/universityAdmissions.ts';
const fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/nagasaki-prefecture-recommendation.json',import.meta.url)));
const fresh=()=>structuredClone(fixture), source=(d,id='pref-nagasaki-guide')=>d.sources.find(s=>s.id===id), scheme=(d,id='recommendation-b')=>d.schemes.find(s=>s.id===id);
const negative=(name,alter,pattern=/University admissions data/)=>test(name,()=>{const d=fresh();alter(d);assert.throws(()=>validateUniversityAdmissions(d),pattern);});

test('two genuine prefecture documents coexist with university evidence and survive revalidation/rendering',()=>{
  const before=JSON.stringify(fixture),v=validateUniversityAdmissions(fixture);
  assert.deepEqual(v,fixture);assert.deepEqual(validateUniversityAdmissions(v),v);
  const html=renderUniversityAdmissions(v);assert(html.includes('長崎県・事前選考の申請'));assert(html.includes('宮崎県・事前選考の申請'));
  assert(html.includes('県での事前選考と大学への出願は別の手続'));assert.equal(JSON.stringify(fixture),before);
  assert.equal(createUniversityAdmissionsIndex({'../data/universityAdmissions/nagasaki.json':v}).size,1);
});
test('each prefecture document can be used independently in its own scheme with the university referral',()=>{
  for(const [id,sid] of [['pref-nagasaki-guide','recommendation-b'],['pref-miyazaki-guide','recommendation-c-miyazaki']]){const d=fresh();d.sources=d.sources.filter(s=>s.id==='recommendation-guide'||s.id===id);d.schemes=[scheme(d,sid)];for(const kind of ['scheduleRows','examRows','venueRows'])d.schemes[0][kind]=d.schemes[0][kind].filter(r=>r.sourceIds.every(i=>d.sources.some(s=>s.id===i)));d.schemes[0].notes=[];assert.doesNotThrow(()=>validateUniversityAdmissions(d));}
});
for(const id of ['pref-nagasaki-guide','pref-miyazaki-guide']){
  for(const [name,change] of [
    ['HTTP',u=>u.replace('https:','http:')],
    ['credentials',u=>u.replace('https://','https://user:secret@')],
    ['nonstandard port',u=>{const p=new URL(u);p.port='8443';return p.href;}],
    ['suffix spoof',u=>{const p=new URL(u);p.hostname+='.attacker.example';return p.href;}],
    ['unregistered subdomain',u=>{const p=new URL(u);p.hostname='files.'+p.hostname;return p.href;}],
    ['different PDF',u=>u.replace('.pdf','-other.pdf')],
    ['query',u=>u+'?alternate=1'],
    ['fragment',u=>u+'#other'],
  ])negative(`${id}: reject ${name}`,d=>{source(d,id).url=change(source(d,id).url);});
  negative(`${id}: reject altered body hash`,d=>{source(d,id).sha256='0'.repeat(64);},/binding is not exact/);
  negative(`${id}: reject missing ownership proof`,d=>{delete source(d,id).prefectureOwnership;},/not official/);
  negative(`${id}: reject wrong source title`,d=>{source(d,id).title='別年度の推薦募集要項';},/binding is not exact/);
  negative(`${id}: reject wrong page scope`,d=>{source(d,id).pages=[1];},/binding is not exact/);
  for(const [key,value] of Object.entries({publisher:'university-official',university:'宮崎大学',admissionYear:2026,schemeId:'general-early',ownerPageUrl:'https://www.pref.example.jp/other.html',ownerPageSha256:'0'.repeat(64)}))negative(`${id}: reject forged ownership ${key}`,d=>{source(d,id).prefectureOwnership[key]=value;},/binding is not exact/);
  negative(`${id}: reject extra self-declared approval`,d=>{source(d,id).prefectureOwnership.rootApproved=true;},/binding is not exact/);
}
negative('other admission year cannot reuse the contract',d=>{d.admissionYear=2026;},/admissionYear must be 2027/);
negative('a prefecture PDF does not become an official source for Miyazaki University',d=>{d.path='/information-miyazaki/';d.university='宮崎大学';d.sources=[source(d,'pref-miyazaki-guide')];},/binding is not exact/);
negative('arbitrary government PDF is not an allowed publisher',d=>{d.sources.push({id:'another-prefecture',url:'https://www.pref.kumamoto.jp/guide.pdf',title:'任意の県要項',retrievedAt:d.verifiedAt,sha256:'a'.repeat(64)});},/not official/);
negative('a known county URL under a new ID is not implicitly allowed',d=>{d.sources.push({...source(d),id:'another-id'});},/binding is not exact/);
negative('prefectures cannot satisfy the global university-primary requirement',d=>{d.sources=d.sources.filter(s=>s.id.startsWith('pref-'));},/at least one official source/);
negative('a county-only university subject claim is rejected',d=>{scheme(d).examRows[0]={label:'個別試験・数学',value:'数学200点。',sourceIds:['pref-nagasaki-guide'],status:'confirmed'};},/exact scheme and preselection claim/);
negative('adding a university citation cannot smuggle a county source into a subject claim',d=>{scheme(d).examRows[0]={label:'個別試験・数学',value:'数学200点。',sourceIds:['pref-nagasaki-guide','recommendation-guide'],status:'confirmed'};},/exact scheme and preselection claim/);
negative('the university recommendation requirement itself cannot cite only the county',d=>{scheme(d).examRows.find(r=>r.label==='県の推薦').sourceIds=['pref-nagasaki-guide'];},/pinned university recommendation guide/);
negative('even a county-owned schedule must retain its university referral citation',d=>{scheme(d).scheduleRows.find(r=>r.label==='長崎県・事前選考の申請').sourceIds=['pref-nagasaki-guide'];},/pinned university recommendation guide/);
negative('a different university document on the same host cannot replace the referral PDF',d=>{d.sources.find(s=>s.id==='recommendation-guide').url='https://www.nagasaki-u.ac.jp/other.pdf';},/pinned university recommendation guide/);
negative('altered university referral body hash fails',d=>{d.sources.find(s=>s.id==='recommendation-guide').sha256='b'.repeat(64);},/pinned university recommendation guide/);
negative('the university referral page must be present',d=>{d.sources.find(s=>s.id==='recommendation-guide').pages=[4,23];},/pinned university recommendation guide/);
negative('a different scheme cannot borrow an identical preselection claim',d=>{scheme(d).id='recommendation-c-other';},/exact scheme and preselection claim/);
negative('Miyazaki and Nagasaki county claims cannot be interchanged',d=>{scheme(d).scheduleRows.push(structuredClone(scheme(d,'recommendation-c-miyazaki').scheduleRows.find(r=>r.label==='宮崎県・事前選考の申請')));},/exact scheme and preselection claim/);
negative('county evidence cannot be moved into an unrelated note',d=>{scheme(d).notes.push({text:'長崎県・事前選考の申請',sourceIds:['pref-nagasaki-guide','recommendation-guide']});},/exact scheme and preselection claim/);
negative('changed county deadline needs new evidence and contract review',d=>{scheme(d).scheduleRows.find(r=>r.label==='長崎県・事前選考の申請').value+='郵送は必着です。';},/exact scheme and preselection claim/);
negative('county venue cannot be presented as the university exam venue',d=>{scheme(d).venueRows.find(r=>r.label==='長崎県の選考会場').label='大学の試験会場';},/exact scheme and preselection claim/);
const addDncFixture=d=>{d.sources.push({id:'dnc-test',url:'https://www.dnc.ac.jp/kyotsu/shiken_jouhou/r9/',title:'単体テスト用の共通テスト出典',retrievedAt:d.verifiedAt});};
negative('DNC still cannot substantiate a university score conversion',d=>{addDncFixture(d);const row=scheme(d).examRows[0];row.label='共通テスト・英語';row.value='英語100点に換算。';row.status='confirmed';row.sourceIds=['dnc-test'];},/university-specific conditions/);
test('DNC nationwide dates remain allowed while separate prefecture evidence is present',()=>{const d=fresh();addDncFixture(d);scheme(d).scheduleRows.push({label:'大学入学共通テスト（本試験）',value:'2027年1月16日（土）・17日（日）。',sourceIds:['dnc-test'],status:'confirmed'});assert.doesNotThrow(()=>validateUniversityAdmissions(d));});
