import type {UniversityAdmissions} from './universityAdmissions.ts';
import overview from '../data/hiroshimaUniversityOverview.json' with {type:'json'};
import {escapeAdmissionText as esc,admissionFactAttributes} from './admissionsReaderPrimitives.ts';

const value=(s:string)=>s.split('\n').map(line=>'<p>'+esc(line)+'</p>').join('');
const attrs=(origin:string,r:{sourceIds:string[];status?:string})=>admissionFactAttributes({label:'',value:'',origins:[origin],...r,status:r.status??'confirmed'});
function table(caption:string,kind:string,rows:{label:string;value:string;sourceIds:string[];status?:string}[],prefix:string) {
 return '<table class="hiroshima-fact-table" data-admission-table="'+kind+'"><caption>'+esc(caption)+'</caption><thead><tr><th scope="col">項目</th><th scope="col">内容</th></tr></thead><tbody>'+rows.map((r,i)=>'<tr data-admission-row="'+i+'" '+attrs(prefix+'/'+i,r)+'><th scope="row" data-admission-label>'+esc(r.label)+'</th><td data-admission-value>'+value(r.value)+'</td></tr>').join('')+'</tbody></table>';
}
const hint='<p class="admission-section-links"><a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a></p>';
export function hiroshimaAdmissionsMetadata(data:UniversityAdmissions) {
 return {title:'広島大学医学部｜2027年度入試情報・大学概要',displayTitle:'広島大学 医学部 2027年度入試情報・大学概要',displayTitleLines:['広島大学 医学部','2027年度入試情報・大学概要'],description:'広島大学医学科の2027年度入試を5方式別に掲載。前期の3配点、総合型Ⅱ型・IB型・ふるさと枠・外国人留学生型の出願条件、日程、会場と未公表事項を整理。2026年度の入学者・在籍学生数、所在地とアクセスも紹介します。',lead:'広島大学医学部医学科の2027年度入試情報を、方式ごとにまとめています。出願前に、正式な募集要項と大学の変更通知をご確認ください。',modified:data.verifiedAt.slice(0,10),keyPoints:[data.schemes[0].examRows[0].value,data.schemes[0].examRows[14].value,data.coverageNotes[1]]};
}
export function renderHiroshimaAdmissionsReadable(data:UniversityAdmissions):string {
 if(data.path!=='/information-hiroshima/' || data.schemes.map(s=>s.id).join(' ')!=='general-early comprehensive-2 ib regional-furusato foreign-feb')throw new Error('Hiroshima medical scheme scope changed');
 const sections=data.schemes.map(s=>'<section class="admission-readable-scheme" data-admission-scheme="'+s.id+'"><h3 id="admission-scheme-'+s.id+'">'+esc(s.name)+'</h3>'+table(s.name+'の日程と出願手続','schedule',s.scheduleRows,s.id+'/schedule')+hint+table(s.name+'の募集条件・科目・配点','exam',s.examRows,s.id+'/exam')+hint+table(s.name+'の試験会場','venue',s.venueRows,s.id+'/venue')+(s.notes.length?'<ul class="admission-conditions">'+s.notes.map((n,i)=>'<li data-admission-note="'+i+'" '+attrs(s.id+'/note/'+i,n)+'><span data-admission-note-text>'+esc(n.text)+'</span></li>').join('')+'</ul>':'')+hint+'</section>').join('');
 const sources=[...new Map([...data.sources,...overview.sources].map(s=>[s.id,s])).values()];
 return '<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable hiroshima-readable" data-admissions-presentation="hiroshima-readable-v1" data-university-admissions-year="2027"><p class="admission-verified">大学公式資料確認日：<time data-university-admissions-verified-at datetime="'+esc(data.verifiedAt)+'">'+esc(data.verifiedAt.slice(0,10))+'</time></p><nav class="hiroshima-scheme-links" aria-label="入試方式">'+data.schemes.map(s=>'<a href="#admission-scheme-'+s.id+'">'+esc(s.name)+'</a>').join('')+'</nav>'+sections+'<h3 id="admission-coverage">正式募集要項の公開予定・掲載範囲</h3><ul class="admission-coverage">'+data.coverageNotes.map((s,i)=>'<li data-admission-coverage-note="'+i+'" '+attrs('coverage/'+i,{sourceIds:overview.coverageSourceIds[i],status:overview.coverageStatuses[i]})+'>'+esc(s)+'</li>').join('')+'</ul><details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><ul class="admission-source-list" data-admission-source-list>'+sources.map(s=>'<li data-admission-source-id="'+esc(s.id)+'"><a data-admission-source-id="'+esc(s.id)+'" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a><small>確認日：'+esc(s.retrievedAt.slice(0,10))+'</small></li>').join('')+'</ul></div></details></section>';
}
export function renderHiroshimaUniversityOverview():string {
 return '<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable hiroshima-readable" data-hiroshima-university-overview>'+table('所在地・交通・医学科の入学者と在籍学生','overview',overview.rows,'overview')+hint+'</section>';
}
