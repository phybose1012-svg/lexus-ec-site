import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {parse} from 'parse5';
const load=n=>JSON.parse(fs.readFileSync(new URL('../src/data/'+n,import.meta.url),'utf8'));
const admission=load('universityAdmissions/shimane.json'),copy=load('shimaneReaderCopy.json'),overview=load('shimaneUniversityOverview.json');
export const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,p))];
export const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
export const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=v=>v.replace(/\s/gu,'');
export function verifyShimaneHtml(html){
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='shimane-readable-v1'),basics=all(tree,n=>attr(n,'data-shimane-university-overview')!==undefined);
 assert.equal(wrappers.length,1);assert.equal(basics.length,1);const wrapper=wrappers[0],basic=basics[0];
 assert.ok(html.indexOf('id="最新の入試情報"')<html.indexOf('id="大学基本情報"'));
 const h1=all(tree,n=>n.tagName==='h1');if(h1.length)assert.equal(clean(text(h1[0])),clean('島根大学 医学部2027年度入試情報'));
 const kp=all(tree,n=>(attr(n,'class')??'').split(' ').includes('article-keypoints'));
 if(kp.length){const items=all(kp[0],n=>n.tagName==='li');assert.equal(items.length,3);for(const [i,v] of copy.keyPoints.entries())assert.equal(clean(text(items[i])),clean(v));}
 const rendered=all(wrapper,n=>attr(n,'data-shimane-origins')!==undefined);
 for(const group of ['quotaNotes','dates','qualification','facts','venue','notes','preApplication','retention','retentionCourse','publication'])for(const r of copy[group]){
  const found=rendered.filter(n=>attr(n,'data-shimane-origins')===JSON.stringify(r.origins)&&clean(text(n)).includes(clean(r.text)));assert.equal(found.length,1,group+' '+r.label);
 }
 for(const r of [copy.selection,copy.retentionNotice])assert.equal(rendered.filter(n=>attr(n,'data-shimane-origins')===JSON.stringify(r.origins)&&clean(text(n)).includes(clean(r.text))).length,1);
 const mapping=[];
 for(const s of admission.schemes)for(const [kind,rows] of [['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes]])for(const [i,r] of rows.entries()){
  const origin=s.id+'/'+kind+'/'+i,matches=rendered.filter(n=>JSON.parse(attr(n,'data-shimane-origins')).includes(origin));assert.ok(matches.length,'Lost fact '+origin);
  for(const node of matches){for(const id of r.sourceIds)assert.ok(JSON.parse(attr(node,'data-admission-source-ids')).includes(id),origin+' source '+id);if(r.status)assert.ok(JSON.parse(attr(node,'data-admission-statuses')).includes(r.status));let p=node;while(p&&p!==wrapper){assert.notEqual(p.tagName,'details','Required condition hidden in source disclosure');p=p.parentNode;}}
  mapping.push({origin,original:r.value??r.text,sourceIds:r.sourceIds,status:r.status,display:matches.map(text)});
 }
 for(const [i,v] of admission.coverageNotes.entries()){const origin='coverage/'+i,matches=rendered.filter(n=>JSON.parse(attr(n,'data-shimane-origins')).includes(origin));assert.equal(matches.length,1);mapping.push({origin,original:v,display:matches.map(text)});}
 assert.equal(mapping.length,71);
 const score=all(wrapper,n=>attr(n,'data-shimane-table')==='scores')[0];assert.ok(score);
 const point=v=>v===null?'課さない':v.toLocaleString('ja-JP')+'点';
 for(const r of copy.scores){const row=all(score,n=>n.tagName==='tr').find(n=>text(all(n,c=>c.tagName==='th')[0]??{})===r.label);assert.ok(row);assert.deepEqual(all(row,n=>n.tagName==='td').map(text),[point(r.common),point(r.individual)]);}
 assert.ok(text(score).includes('合計930点720点'));assert.ok(text(score).includes('総合計1,650点'));
 const quotas=all(wrapper,n=>attr(n,'data-shimane-table')==='overview')[0];assert.ok(text(quotas).includes('前期全体58人'));assert.ok(text(quotas).includes('県内定着枠を含む'));assert.ok(text(quotas).includes('3人前期全体の内数'));
 const quotaNotes=all(wrapper,n=>attr(n,'data-shimane-quota-notes')!==undefined);assert.equal(quotaNotes.length,1);assert.equal(quotaNotes[0].parentNode,wrapper);assert.equal(quotaNotes[0].tagName,'p');
 const admissionText=clean(text(wrapper));
 for(const v of ['6つの要件をすべて','2024年3月以降','2027年3月卒業見込み','島根県の奨学金を受給','初期研修と専門研修','医師国家試験に合格した日の属する月の翌月の初日','12年を経過する日まで','研修期間を含めて9年間','そのうち4年以上','特定地域医療機関','約8倍を超えた場合','主として共通テスト','第1解答科目','重度難聴者等','リーディング100点の得点をそのまま','数学Ⅰ・Ⅱ・Ⅲ・A：全範囲','論理・表現Ⅰ・Ⅱ・Ⅲ','6教科8科目','出願無資格','前期のみ','締切時刻、必着・消印有効','面接形式、評価基準、得点と別の不合格条件は未公表','発表時刻・方法の詳細は未公表','未公表','11月下旬','不足人数を一般選抜前期','欠員補充第2次募集'])assert.ok(admissionText.includes(clean(v)),v);
 assert.doesNotMatch(admissionText,/前期全体61人|一般枠55人|2025\/|2026年2月25日|面接は集団/u);
 const basicText=clean(text(basic));for(const v of [...overview.access,overview.address.street,overview.address.phone,'2026年度／医学科入学者／102人','男性42人41.2%','女性60人58.8%','現役33人32.4%','既卒68人66.7%','大検等1人1.0%'])assert.ok(basicText.includes(clean(v)),v);
 assert.doesNotMatch(basicText,/松江市西川津|入学者163人|2024年度|男女各51人/u);
 for(const section of [wrapper,basic]){
  const footer=all(section,n=>n.tagName==='details');assert.equal(footer.length,1);assert.equal(text(all(footer[0],n=>n.tagName==='summary')[0]),'情報ソースはこちら');
  for(const t of all(section,n=>n.tagName==='table')){assert.equal(all(t,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);assert.doesNotMatch(text(t),/資料\d|出典|PDF|選抜要項/u);}
  const body=(section.childNodes??[]).filter(n=>n!==footer[0]).map(text).join('');assert.doesNotMatch(body,/今回の表|本表|対象外|転用しない|原典|調査完了|確認した内容|参考情報|資料\d/u);
  for(const a of all(section,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??''))){let p=a;while(p&&p!==footer[0])p=p.parentNode;assert.equal(p,footer[0]);}
 }
 for(const s of [...admission.sources,...overview.sources]){const entries=all(tree,n=>n.tagName==='li'&&attr(n,'data-admission-source-id')===s.id);assert.equal(entries.length,1,s.id);assert.equal(attr(all(entries[0],n=>n.tagName==='a')[0],'href'),s.url);}
 const ids=all(tree,n=>attr(n,'id')).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length);for(const a of all(tree,n=>n.tagName==='a'&&(attr(n,'href')??'').startsWith('#')))assert.ok(ids.includes(attr(a,'href').slice(1)),'Broken anchor');
 return {mappedItems:mapping.length,originalFacts:58,addedFacts:11,coverageNotes:2,mapping,tables:all(tree,n=>attr(n,'data-shimane-table')).map(n=>attr(n,'data-shimane-table')),sources:8};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const [target,output]=process.argv.slice(2);let html;if(/^https?:/u.test(target)){const r=await fetch(target,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);html=await r.text();}else html=fs.readFileSync(target,'utf8');const result={passed:true,checkedAt:new Date().toISOString(),target,htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),...verifyShimaneHtml(html)};if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,mapping:undefined},null,2));}
