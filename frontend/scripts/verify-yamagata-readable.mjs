import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {parse} from 'parse5';
const load=n=>JSON.parse(fs.readFileSync(new URL('../src/data/'+n,import.meta.url),'utf8'));
const admission=load('universityAdmissions/yamagata.json'),copy=load('yamagataReaderCopy.json'),overview=load('yamagataUniversityOverview.json');
export const all=(n,p)=>[...(p(n)?[n]:[]),...(n.childNodes??[]).flatMap(c=>all(c,p))];
export const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
export const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const clean=v=>v.replace(/\s/gu,'');
export function verifyYamagataHtml(html){
 const tree=parse(html),wrappers=all(tree,n=>attr(n,'data-admissions-presentation')==='yamagata-readable-v1'),basics=all(tree,n=>attr(n,'data-yamagata-university-overview')!==undefined);
 assert.equal(wrappers.length,1);assert.equal(basics.length,1);const wrapper=wrappers[0],basic=basics[0];
 assert.ok(html.indexOf('id="最新の入試情報"')<html.indexOf('id="大学基本情報"'));
 const h1=all(tree,n=>n.tagName==='h1');if(h1.length)assert.equal(clean(text(h1[0])),clean('山形大学 医学部2027年度入試情報'));
 const kp=all(tree,n=>(attr(n,'class')??'').split(' ').includes('article-keypoints'));
 if(kp.length){const items=all(kp[0],n=>n.tagName==='li');assert.equal(items.length,3);for(const [i,v] of copy.keyPoints.entries())assert.equal(clean(text(items[i])),clean(v));}
 const rendered=all(wrapper,n=>attr(n,'data-yamagata-origins')!==undefined);
 for(const group of ['quotaNotes','dates','postal','qualification','facts','venue','notes','preApplication','consultation','feeExemption','publication'])for(const r of copy[group]){
  const expected=[r.label??'',r.intro??'',...(r.items??[]),r.text??''].join('');
  const found=rendered.filter(n=>attr(n,'data-yamagata-origins')===JSON.stringify(r.origins)&&clean(text(n)).includes(clean(expected)));assert.equal(found.length,1,group+' '+r.label);
  if(r.items)assert.deepEqual(all(found[0],n=>n.tagName==='li').map(text),r.items);
 }
 assert.equal(rendered.filter(n=>attr(n,'data-yamagata-origins')===JSON.stringify(copy.selection.origins)&&clean(text(n)).includes(clean(copy.selection.text))).length,1);
 const mapping=[];
 for(const s of admission.schemes)for(const [kind,rows] of [['schedule',s.scheduleRows],['exam',s.examRows],['venue',s.venueRows],['note',s.notes]])for(const [i,r] of rows.entries()){
  const origin=s.id+'/'+kind+'/'+i,matches=rendered.filter(n=>JSON.parse(attr(n,'data-yamagata-origins')).includes(origin));assert.ok(matches.length,'Lost fact '+origin);
  for(const node of matches){for(const id of r.sourceIds)assert.ok(JSON.parse(attr(node,'data-admission-source-ids')).includes(id),origin+' source '+id);if(r.status)assert.ok(JSON.parse(attr(node,'data-admission-statuses')).includes(r.status));let p=node;while(p&&p!==wrapper){assert.notEqual(p.tagName,'details','Required condition hidden in source disclosure');p=p.parentNode;}}
  mapping.push({origin,original:r.value??r.text,sourceIds:r.sourceIds,status:r.status,display:matches.map(text)});
 }
 for(const [i,v] of admission.coverageNotes.entries()){const origin='coverage/'+i,matches=rendered.filter(n=>JSON.parse(attr(n,'data-yamagata-origins')).includes(origin));assert.equal(matches.length,1);mapping.push({origin,original:v,display:matches.map(text)});}
 assert.equal(mapping.length,51);
 const score=all(wrapper,n=>attr(n,'data-yamagata-table')==='scores')[0];assert.ok(score);
 const point=v=>v===null?'課さない':v.toLocaleString('ja-JP')+'点';
 for(const r of copy.scores){const row=all(score,n=>n.tagName==='tr').find(n=>text(all(n,c=>c.tagName==='th')[0]??{})===r.label);assert.ok(row);assert.deepEqual(all(row,n=>n.tagName==='td').map(text),[point(r.common),point(r.individual)]);}
 assert.ok(text(score).includes('合計950点700点'));assert.ok(text(score).includes('総合計1,650点'));
 const quotas=all(wrapper,n=>attr(n,'data-yamagata-table')==='overview')[0];assert.ok(text(quotas).includes('65人変更の可能性あり'));
 const quotaNotes=all(wrapper,n=>attr(n,'data-yamagata-quota-notes')!==undefined);assert.equal(quotaNotes.length,1);assert.equal(quotaNotes[0].parentNode,wrapper);
 const conditions=['2027年1月25日（月）9:00～2月3日（水）16:30必着','2月1日（月）までの消印がある書留速達に限り','2月4日（木）以降の到着','平日（土・日曜日を除く）、9:00～16:30','2027年3月7日（日）11:00','登録期間・締切時刻は未公表','支払期間・締切時刻は未公表','判定方法、合格者発表日・時刻は未公表','手続期間、書類の必着期限・締切時刻は未公表','次のいずれかに該当し','第150条（第6号を除く）','2027年3月31日まで','事前の審査で入学資格を認められた場合に限られます','学習歴が3年以上','学習指導要領に準ずることと','2027年3月31日までに18歳','2027年1月8日（金）','簡易書留による郵送のみ','既に終了しています','760円分の切手','日本語訳を添付','必要に応じて面接','補正がない場合は審査を行いません','2027年1月15日（金）まで','証明書の写しを添付','小白川町一丁目4-12','補聴器・松葉杖・車椅子','相談書と医師の診断書の両方','申請内容と同じ場合','障害者手帳を所持している場合','通知書が手元にない場合','準備ができ次第、写しを追加提出','郵送または持参','必要な場合は','学校関係者または父母等','2027年度一般選抜の期限は未公表','期限後に発生したやむを得ない事情','事前に入試課へ電話','申請を断る場合もあります','試験までに通知が届かない場合','6教科8科目','欠くと失格','第1解答科目が指定科目でなければ出願資格がありません','ドイツ語','フランス語','換算配点は未公表','リスニング免除が認められた場合','リーディングだけ','100点満点を50点満点','数学Bは数列','平面上の曲線と複素数平面','論理・表現Ⅰ。','総合点にかかわらず不合格','5倍を超え、かつ','適切に実施できない場合に','行うことがあります','飯田西二丁目2-2','前期同士・後期同士の併願は認められません','臨時定員増は申請を検討中','欠員を一般選抜前期','2026年11月公表予定','2026年4月以降','次のいずれかの条件','所有する家屋（持家）','全壊または大規模半壊','死亡または行方不明','出願時まで引き続き無職','申請時点で指定されている帰還困難区域','2027年1月13日（水）必着','出願期間より前に申請','失職を証明する書類、雇用保険受給証明書の写し、直近の所得・非課税証明書のすべて','110円切手','023-628-4144','許可日に遡って取り消され'];
 const admissionText=clean(text(wrapper));for(const v of conditions)assert.ok(admissionText.includes(clean(v)),v);
 assert.doesNotMatch(admissionText,/論理・表現Ⅰ・Ⅱ|島根|県内定着枠|950点720点|前期全体58人|5倍を超えたら必ず/u);
 const routes=all(wrapper,n=>n.tagName==='dt'&&text(n)==='基本となる資格')[0].parentNode;assert.equal(all(routes,n=>n.tagName==='li').length,3);
 for(const title of ['出願資格','第1段階選抜'])assert.equal(all(wrapper,n=>['h4','dt'].includes(n.tagName)&&text(n)===title).length,1,'Repeated heading '+title);
 const exemptions=all(wrapper,n=>n.tagName==='dt'&&text(n)==='被災者向け検定料免除')[0].parentNode;assert.equal(all(exemptions,n=>n.tagName==='li').length,4);
 const basicText=clean(text(basic));for(const v of [...overview.access,overview.address.street,overview.address.phone,'2026年度／医学科入学者（全選抜）／113人','男性65人57.5%','女性48人42.5%',overview.graduateStatus])assert.ok(basicText.includes(clean(v)),v);
 assert.doesNotMatch(basicText,/小白川町|医学科入学者688人|117人|176人|2024年度/u);
 for(const section of [wrapper,basic]){
  const footer=all(section,n=>n.tagName==='details');assert.equal(footer.length,1);assert.equal(text(all(footer[0],n=>n.tagName==='summary')[0]),'情報ソースはこちら');
  for(const t of all(section,n=>n.tagName==='table')){assert.equal(all(t,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??'')).length,0);assert.doesNotMatch(text(t),/資料\d|出典|PDF|選抜要項/u);}
  const body=(section.childNodes??[]).filter(n=>n!==footer[0]).map(text).join('');assert.doesNotMatch(body,/今回の表|本表|対象外|転用しない|原典|調査完了|確認した内容|参考情報|資料\d/u);
  for(const a of all(section,n=>n.tagName==='a'&&/^https?:/u.test(attr(n,'href')??''))){let p=a;while(p&&p!==footer[0])p=p.parentNode;assert.equal(p,footer[0]);}
 }
 for(const s of [...admission.sources,...overview.sources]){const entries=all(tree,n=>n.tagName==='li'&&attr(n,'data-admission-source-id')===s.id);assert.equal(entries.length,1,s.id);assert.equal(attr(all(entries[0],n=>n.tagName==='a')[0],'href'),s.url);}
 const ids=all(tree,n=>attr(n,'id')).map(n=>attr(n,'id'));assert.equal(new Set(ids).size,ids.length);for(const a of all(tree,n=>n.tagName==='a'&&(attr(n,'href')??'').startsWith('#')))assert.ok(ids.includes(attr(a,'href').slice(1)),'Broken anchor');
 return {mappedItems:mapping.length,originalFacts:33,addedFacts:16,coverageNotes:2,mapping,tables:all(tree,n=>attr(n,'data-yamagata-table')).map(n=>attr(n,'data-yamagata-table')),sources:11};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const [target,output]=process.argv.slice(2);let html;if(/^https?:/u.test(target)){const r=await fetch(target,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);html=await r.text();}else html=fs.readFileSync(target,'utf8');const result={passed:true,checkedAt:new Date().toISOString(),target,htmlSha256:crypto.createHash('sha256').update(html).digest('hex'),...verifyYamagataHtml(html)};if(output)fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,mapping:undefined},null,2));}
