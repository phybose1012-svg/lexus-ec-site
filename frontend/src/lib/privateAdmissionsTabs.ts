import {parseFragment,serializeOuter,type DefaultTreeAdapterMap} from 'parse5';
import type {UniversityAdmissions,UniversityAdmissionRow,UniversityAdmissionScheme} from './universityAdmissions';
import type {PrivateAdmissionsLayout} from './privateAdmissionsLayoutProfiles';

type Element=DefaultTreeAdapterMap['element'];
type Node=DefaultTreeAdapterMap['node'];
type Fact={node:Element;origins:string[]};
const esc=(v:string)=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const attr=(n:Element,k:string)=>n.attrs.find(a=>a.name===k)?.value;
const element=(n:Node):n is Element=>'tagName' in n;
function factUnits(html:string){
 const result:Fact[]=[];
 function visit(n:Node){
  if(element(n)&&attr(n,'data-admission-origins')){result.push({node:n,origins:attr(n,'data-admission-origins')!.split(/\s+/)});return;}
  if('childNodes' in n)n.childNodes.forEach(visit);
 }
 visit(parseFragment(html));return result;
}
function renderUnits(units:Fact[]){
 const result:string[]=[];const tables=new Map<Element,Element[]>();
 for(const {node} of units){
  if(node.tagName==='tr'){
   let parent=node.parentNode;while(parent&&(!element(parent)||parent.tagName!=='table'))parent='parentNode' in parent?parent.parentNode:null;
   if(parent&&element(parent)){if(!tables.has(parent)){tables.set(parent,[]);result.push('@table:'+String(tables.size-1));}tables.get(parent)!.push(node);continue;}
  }
  const html=serializeOuter(node);result.push(node.tagName==='li'?'<ul>'+html+'</ul>':html);
 }
 const rendered=[...tables].map(([table,rows])=>'<table>'+table.childNodes.filter(n=>element(n)&&['caption','thead','colgroup'].includes(n.tagName)).map(n=>serializeOuter(n)).join('')+'<tbody>'+rows.map(n=>serializeOuter(n)).join('')+'</tbody></table>');
 return result.map(h=>h.startsWith('@table:')?rendered[Number(h.slice(7))]:h).join('').replace(/\sid="[^"]*"/g,'').replace(/href="#([^"]+)"/g,'href="#pat-full-$1"');
}
function short(value:string,max=105){
 const first=value.split(/(?<=。)/)[0];
 if(value.length<=max)return {value,cut:false};
 if(first.length<=max)return {value:first,cut:true};
 return {value:value.slice(0,max)+'…',cut:true};
}
export function renderPrivateAdmissionsTabs(data:UniversityAdmissions,layout:PrivateAdmissionsLayout,original:string){
 const slug=layout.slug,schemes=new Map(data.schemes.map(s=>[s.id,s]));
 const configured=layout.groups.flatMap(g=>g.schemes);
 if(configured.length!==schemes.size||new Set(configured).size!==schemes.size||configured.some(id=>!schemes.has(id)))throw Error('Incomplete admission layout: '+slug);
 const first=layout.groups[0].schemes[0],units=factUnits(original);
 const sources=new Map(data.sources.map((s,i)=>[s.id,{...s,index:i+1}]));
 const refs=(ids:string[])=>ids.map(id=>{const s=sources.get(id);if(!s)throw Error('Unknown source '+slug+'/'+id);return '<a href="'+esc(s.url)+'" data-admission-source-id="'+esc(id)+'" title="'+esc(s.title)+'">資料'+s.index+'</a>';}).join('・');
 const row=(s:UniversityAdmissionScheme,kind:string,r:UniversityAdmissionRow,i:number)=>'<tr data-admission-origins="'+esc(s.id+'/'+kind+'/'+i)+'"'+(r.status?' data-admission-status="'+r.status+'"':'')+'><th scope="row">'+esc(r.label)+'</th><td>'+esc(r.value)+' <span class="pat-refs">'+refs(r.sourceIds)+'</span></td></tr>';
 const table=(title:string,content:string)=>content?'<table><caption>'+esc(title)+'</caption><tbody>'+content+'</tbody></table>':'';
 const detail=(title:string,desc:string,html:string,id='')=>html?'<details class="pat-detail"'+(id?' id="'+esc(id)+'"':'')+'><summary><span>'+esc(title)+'<small>'+esc(desc)+'</small></span><span class="pat-plus" aria-hidden="true"></span></summary><div class="pat-detail-body">'+html+'</div></details>':'';
 const rich=(s:UniversityAdmissionScheme,kinds:string[],include:(r:UniversityAdmissionRow)=>boolean=()=>true)=>{
  const keys=new Set<string>();let fallback='';
  for(const kind of kinds){
   const key=kind==='schedule'?'scheduleRows':kind==='exam'?'examRows':'venueRows';
   s[key].forEach((r,i)=>{if(include(r))keys.add(s.id+'/'+kind+'/'+i);});
  }
  const selected=units.filter(u=>u.origins.some(id=>keys.has(id))),covered=new Set(selected.flatMap(u=>u.origins));
  for(const kind of kinds){
   const key=kind==='schedule'?'scheduleRows':kind==='exam'?'examRows':'venueRows';
   fallback+=s[key].map((r,i)=>keys.has(s.id+'/'+kind+'/'+i)&&!covered.has(s.id+'/'+kind+'/'+i)?row(s,kind,r,i):'').join('');
  }
  return renderUnits(selected)+table('項目と条件',fallback);
 };
 const qualifications=(r:UniversityAdmissionRow)=>/資格|推薦条件|評定|履修|卒業|出願条件|専願|併願|証明|提出書類|英語資格/.test(r.label);
 const quota=(s:UniversityAdmissionScheme)=>[...s.scheduleRows,...s.examRows].find(r=>/募集(?:人員|人数|枠)|^定員/.test(r.label));
 const summary=(s:UniversityAdmissionScheme)=>{
  const rows=s.scheduleRows;
  const application=rows.find(r=>/出願/.test(r.label)&&!/資格|書類|検定|支払|郵送|提出/.test(r.label));
  const exam=rows.find(r=>/試験日|一次試験|第1次試験|共通テスト実施|学力試験日|選考日|選抜日/.test(r.label)&&!/発表|手続|出願/.test(r.label));
  const next=rows.find(r=>/二次試験|第2次試験/.test(r.label))??rows.find(r=>/合格発表/.test(r.label));
  return [...new Set([application,exam,next].filter((r):r is UniversityAdmissionRow=>!!r))];
 };
 const smallValue=(r:UniversityAdmissionRow,max=105)=>{const v=short(r.value,max);return '<strong>'+esc(v.value)+'</strong>'+(v.cut?'<small>続き・条件は詳細へ</small>':'');};
 const route=(s:UniversityAdmissionScheme)=>{
  const q=quota(s),dates=summary(s),pointRows:UniversityAdmissionRow[]=[];
  const group=layout.groups.find(g=>g.schemes.includes(s.id))!.id;
  const second=group==='recommendation'?[/専願|併願|評定|英語資格/,/出願資格/]:group==='regional'?[/勤務|修学|貸与|返還|出身|居住/,/出願資格/]:[/小論文|面接/,/英語資格|出願資格/];
  for(const patterns of [[/科目|学力|配点|出題|選抜方法|試験内容/],second,[/勤務|修学|検定料|提出書類|注意/]]){
   for(const pattern of patterns){const r=s.examRows.find(r=>pattern.test(r.label)&&!pointRows.includes(r)&&!/^次のいずれか|^以下のいずれか/.test(r.value));if(r){pointRows.push(r);break;}}
  }
  const notes=units.filter(u=>u.origins.some(o=>o.startsWith(s.id+'/note/'))),coveredNotes=new Set(notes.flatMap(u=>u.origins));
  const noteHtml=renderUnits(notes)+'<ul>'+s.notes.map((n,i)=>coveredNotes.has(s.id+'/note/'+i)?'':'<li data-admission-origins="'+esc(s.id+'/note/'+i)+'">'+esc(n.text)+' '+refs(n.sourceIds)+'</li>').join('')+'</ul>';
  const warning=[...s.scheduleRows,...s.examRows,...s.venueRows].filter(r=>r.status&&r.status!=='confirmed');
  return '<section class="pat-route" id="'+slug+'-'+s.id+'" data-pat-route="'+s.id+'" aria-labelledby="pat-heading-'+s.id+'"'+(s.id!==first?' hidden':'')+'><header class="pat-route-head"><div><p class="pat-eyebrow">選択中の入試方式</p><h2 id="pat-heading-'+s.id+'" tabindex="-1">'+esc(s.name)+'</h2><p>'+data.admissionYear+'年度 医学科</p></div>'+(q?'<div class="pat-quota"><small>'+esc(q.label)+'</small>'+smallValue(q,65)+'</div>':'')+'</header>'+
   (warning.length?'<p class="pat-alert"><strong>出願前に確認</strong>未公表・確認が必要な項目があります。各詳細の注記と大学の最新案内を確認してください。</p>':'')+
   (dates.length?'<div class="pat-dates pat-dates">'+dates.map((r,i)=>'<div'+(i===0?' class="pat-deadline"':'')+'><span>'+esc(r.label)+'</span>'+smallValue(r)+'</div>').join('')+'</div>':'')+
   (pointRows.length?'<div class="pat-points"><h3>まず押さえるポイント</h3><ol>'+pointRows.map((r,i)=>{const v=short(r.value,120);return '<li><span aria-hidden="true">0'+(i+1)+'</span><div><b>'+esc(r.label)+'</b><p>'+esc(v.value)+(v.cut?' <span class="pat-more">詳しくは下の詳細へ</span>':'')+'</p></div></li>';}).join('')+'</ol></div>':'')+
   detail('日程をすべて確認','出願登録・書類・支払・試験・発表・入学手続',rich(s,['schedule']),slug+'-'+s.id+'-dates')+
   '<section class="pat-exams"><div class="pat-score-head"><h3>試験科目・出願条件</h3></div>'+detail('科目・配点・面接の詳細','出題範囲・評価方法もここで確認',rich(s,['exam'],r=>!qualifications(r)))+detail('出願資格・提出書類を確認','卒業時期・評定・英語資格・専願など',rich(s,['exam'],qualifications))+'</section>'+
   detail('試験会場を確認','方式・段階ごとの会場と当日の注意',rich(s,['venue']))+detail('この方式の注意事項','併願・地域枠・修学資金など',noteHtml)+
   '<div class="pat-next"><p>出願前に、方式共通の条件も確認</p><div><button type="button" data-pat-open="common">学費・出願ルール・掲載範囲 <span>↗</span></button><button type="button" data-pat-open="sources">公式資料と確認日 <span>↗</span></button></div></div></section>';
 };
 const sourceList='<ol class="pat-source-list">'+data.sources.map(s=>'<li id="admission-source-'+esc(s.id)+'"><a href="'+esc(s.url)+'" data-admission-source-id="'+esc(s.id)+'">'+esc(s.title)+'</a><small>確認日 '+esc(s.retrievedAt.slice(0,10))+(s.pages?' ／ '+esc(Array.isArray(s.pages)?'PDF p.'+s.pages.join('、'):s.pages):'')+'</small></li>').join('')+'</ol>';
 const coverage=units.filter(u=>u.origins.some(o=>/^(coverage|basic)\//.test(o)));
 const covered=new Set(coverage.flatMap(u=>u.origins));
 const common=renderUnits(coverage)+'<ul>'+data.coverageNotes.map((n,i)=>covered.has('coverage/'+i)?'':'<li data-admission-origins="coverage/'+i+'">'+esc(n)+'</li>').join('')+'</ul><p>大学概要や過年度の参考情報は、<button type="button" class="pat-text-button" data-pat-switch="full">一覧で読む</button>から確認できます。</p>';
 const dialog=(id:string,title:string,body:string)=>'<dialog class="pat-dialog" id="pat-dialog-'+id+'" aria-labelledby="pat-dialog-title-'+id+'"><header><div><small>'+esc(data.university)+' 医学科</small><h2 id="pat-dialog-title-'+id+'">'+esc(title)+'</h2></div><button type="button" data-pat-close aria-label="閉じる">×</button></header><div class="pat-dialog-body">'+body+'</div><footer><button type="button" data-pat-close>確認を終えて戻る</button></footer></dialog>';
 const overview='<div class="pat-overview">'+layout.groups.map(g=>'<section><h3>'+esc(g.label)+'</h3>'+g.schemes.map(id=>{const s=schemes.get(id)!,q=quota(s);return '<a href="#'+slug+'-'+id+'"><b>'+esc(s.name)+'</b><span>'+(q?esc(short(q.value,90).value):'日程・条件を見る')+'</span><i aria-hidden="true">→</i></a>';}).join('')+'</section>').join('')+'</div>';
 // The complete existing reader remains available, including supplementary prose and source links.
 const full=original.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<h2\b/g,'<h3').replace(/<\/h2>/g,'</h3>').replace(/\sid="([^"]+)"/g,' id="pat-full-$1"').replace(/href="#([^"]+)"/g,'href="#pat-full-$1"').replace(/aria-labelledby="([^"]+)"/g,(_,ids:string)=>'aria-labelledby="'+ids.split(/\s+/).map(id=>'pat-full-'+id).join(' ')+'"');
 return '<div class="pat-root" data-private-admissions-tabs data-university-slug="'+slug+'" data-university-admissions-year="2027"><div class="pat-intro"><div><p class="pat-eyebrow">2027 ADMISSIONS</p><h2>入試方式を選ぶ</h2><p>日程・試験科目・出願条件を、方式ごとに確認できます。</p></div><button type="button" class="pat-compare" data-pat-open="overview">全方式を比較 <span>↗</span></button></div><div class="pat-tabs-wrap"><div class="pat-tabs" data-tab-count="'+layout.groups.length+'" role="tablist" aria-label="入試形式">'+layout.groups.map((g,i)=>'<button type="button" role="tab" id="pat-tab-'+g.id+'" aria-controls="pat-group-'+g.id+'" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-pat-group-tab="'+g.id+'"><span>'+esc(g.label)+'</span><small>'+g.schemes.length+'区分</small></button>').join('')+'</div></div><p class="pat-sr" aria-live="polite" data-pat-live></p>'+
  layout.groups.map((g,i)=>'<div id="pat-group-'+g.id+'" class="pat-group" role="tabpanel" aria-labelledby="pat-tab-'+g.id+'" data-pat-group="'+g.id+'"'+(i?' hidden':'')+'>'+(g.schemes.length>4?'<div class="pat-route-select"><label for="pat-select-'+g.id+'">'+esc(g.label)+'の区分</label><select id="pat-select-'+g.id+'" data-pat-route-select>'+g.schemes.map(id=>'<option value="'+id+'">'+esc(schemes.get(id)!.name)+'</option>').join('')+'</select></div>':g.schemes.length>1?'<div class="pat-subtabs" role="group" aria-label="'+esc(g.label)+'の区分">'+g.schemes.map((id,j)=>'<button type="button" data-pat-route-tab="'+id+'" aria-pressed="'+(j===0)+'">'+esc(schemes.get(id)!.name)+'</button>').join('')+'</div>':'')+g.schemes.map(id=>route(schemes.get(id)!)).join('')+'</div>').join('')+
  '<section class="pat-university"><div><h2>大学情報・掲載資料</h2><p>入試の全項目や大学概要をまとめて確認できます。</p></div><button type="button" data-pat-open="full">一覧で読む <span>↗</span></button></section><p class="pat-notice">掲載資料の確認日：<time data-university-admissions-verified-at datetime="'+esc(data.verifiedAt)+'">'+esc(data.verifiedAt.slice(0,10))+'</time>。出願前には大学の最新の変更通知・募集要項・受験票も確認してください。</p>'+
  dialog('overview','全方式の募集人員・区分',overview)+dialog('common','学費・出願ルール・掲載範囲',common)+dialog('sources','公式資料・確認日',sourceList)+dialog('full','入試情報・大学概要を一覧で読む',full)+
  '<noscript><style>.article-page--private-admissions-tabs .pat-root [hidden]{display:block!important}.article-page--private-admissions-tabs .pat-tabs-wrap,.article-page--private-admissions-tabs .pat-subtabs,.article-page--private-admissions-tabs .pat-route-select,.article-page--private-admissions-tabs [data-pat-open],.article-page--private-admissions-tabs [data-pat-close]{display:none}.article-page--private-admissions-tabs .pat-dialog{display:block;position:static;width:100%;max-height:none;border:1px solid #dce5df;margin:25px 0;box-shadow:none}</style></noscript></div>';
}

