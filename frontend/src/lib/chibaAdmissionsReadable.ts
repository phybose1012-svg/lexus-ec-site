import type {UniversityAdmissions} from './universityAdmissions.ts';
import overview from '../data/chibaUniversityOverview.json' with {type:'json'};
import {escapeAdmissionText as esc,admissionFactAttributes} from './admissionsReaderPrimitives.ts';

const attrs=(origin:string,r:{sourceIds:string[];status?:string})=>admissionFactAttributes({label:'',value:'',origins:[origin],...r,status:r.status??'confirmed'});
const lines=(value:string)=>value.split('\n').map(v=>'<p>'+esc(v)+'</p>').join('');
const hint='<p class="admission-section-links"><a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a></p>';
function table(caption:string,kind:string,rows:{label:string;value:string;sourceIds:string[];status?:string}[],prefix:string){
 return '<table class="chiba-fact-table" data-admission-table="'+kind+'"><caption>'+esc(caption)+'</caption><thead><tr><th scope="col">項目</th><th scope="col">内容</th></tr></thead><tbody>'+rows.map((r,i)=>'<tr data-admission-row="'+i+'" '+attrs(prefix+'/'+i,r)+'><th scope="row" data-admission-label>'+esc(r.label)+'</th><td data-admission-value>'+lines(r.value)+'</td></tr>').join('')+'</tbody></table>';
}
export function chibaAdmissionsMetadata(data:UniversityAdmissions){
 return {title:'千葉大学医学部｜2027年度入試情報・大学概要',displayTitle:'千葉大学 医学部 2027年度入試情報・大学概要',displayTitleLines:['千葉大学 医学部','2027年度入試情報・大学概要'],description:'千葉大学医学科の2027年度入試を前期一般枠・地域枠、後期、推薦地域枠、外国人留学生選抜に分けて掲載。日程、科目・配点、条件と未公表事項、公式資料の相違を紹介。所在地・交通と2026年度入学者の男女比・新卒既卒比も掲載しています。',lead:'千葉大学医学部医学科の2027年度入試情報を方式別にまとめています。出願前に、その年度の正式募集要項と大学の変更告知を確認してください。',modified:data.verifiedAt.slice(0,10),keyPoints:['一般選抜の前期・後期、千葉県地域枠、学校推薦型、外国人留学生選抜を方式別に確認できます。','一般と推薦の共通テスト配点、地域枠の条件、手続きの公表待ちを整理しています。','大学基本情報には2026年度入学者の男女比・新卒既卒比を掲載しています。']};
}
export function renderChibaAdmissionsReadable(data:UniversityAdmissions):string{
 if(data.path!=='/information-chiba/'||data.schemes.map(s=>s.id).join(' ')!=='general-early regional-early general-late recommend-regional foreign')throw new Error('Chiba medical scheme scope changed');
 const sections=data.schemes.map(s=>'<section class="admission-readable-scheme" data-admission-scheme="'+s.id+'" aria-labelledby="admission-scheme-'+s.id+'"><h3 id="admission-scheme-'+s.id+'">'+esc(s.name)+'</h3>'+table(s.name+'の日程・出願手続','schedule',s.scheduleRows,s.id+'/schedule')+hint+table(s.name+'の募集条件・科目・配点','exam',s.examRows,s.id+'/exam')+hint+table(s.name+'の試験会場','venue',s.venueRows,s.id+'/venue')+(s.notes.length?'<ul class="admission-conditions">'+s.notes.map((r,i)=>'<li data-admission-note="'+i+'" '+attrs(s.id+'/note/'+i,r)+'><span data-admission-note-text>'+esc(r.text)+'</span></li>').join('')+'</ul>':'')+hint+'</section>').join('');
 const sources=[...new Map([...data.sources,...overview.sources].map(s=>[s.id,s])).values()];
 return '<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable chiba-readable" data-admissions-presentation="chiba-readable-v1" data-university-admissions-year="2027" aria-labelledby="最新の入試情報"><p class="admission-verified">大学公式資料確認日：<time data-university-admissions-verified-at datetime="'+esc(data.verifiedAt)+'">'+esc(data.verifiedAt.slice(0,10))+'</time></p><nav class="chiba-scheme-links" aria-label="入試方式">'+data.schemes.map(s=>'<a href="#admission-scheme-'+s.id+'">'+esc(s.name)+'</a>').join('')+'</nav>'+sections+'<h3 id="admission-coverage">正式募集要項の公開予定・掲載範囲</h3><ul class="admission-coverage">'+data.coverageNotes.map((value,i)=>'<li data-admission-coverage-note="'+i+'" '+attrs('coverage/'+i,{sourceIds:overview.coverageSourceIds[i],status:overview.coverageStatuses[i]})+'>'+esc(value)+'</li>').join('')+'</ul><details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><ul class="admission-source-list" data-admission-source-list>'+sources.map(s=>'<li data-admission-source-id="'+esc(s.id)+'"><a data-admission-source-id="'+esc(s.id)+'" href="'+esc(s.url)+'" target="_blank" rel="noopener noreferrer">'+esc(s.title)+'</a><small>確認日：'+esc(s.retrievedAt.slice(0,10))+(s.pages?'／'+esc(typeof s.pages==='string'?s.pages:s.pages.join('、')):'')+'</small></li>').join('')+'</ul></div></details></section>';
}
export function renderChibaUniversityOverview():string{
 return '<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable chiba-readable" data-chiba-university-overview>'+table('所在地・交通・医学部の入学者と在籍学生・学納金','overview',overview.rows,'overview')+hint+'</section>';
}
