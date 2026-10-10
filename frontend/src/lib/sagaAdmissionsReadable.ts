import type { UniversityAdmissions, UniversityAdmissionRow } from './universityAdmissions.ts';
import copy from '../data/sagaReaderCopy.json' with { type: 'json' };
import overview from '../data/sagaUniversityOverview.json' with { type: 'json' };

const escape = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const value = (s: string) => s.split('\n').map((line,i)=>`<p class="${i ? 'admission-value-detail' : 'admission-value-main'}">${escape(line)}</p>`).join('');
const attrs = (origin: string, row: UniversityAdmissionRow) => `data-admission-origin="general-early/${origin}" data-admission-source-ids="${escape(JSON.stringify(row.sourceIds))}"${row.status ? ` data-admission-status="${row.status}"` : ''}`;
const sourceHint = '<p class="admission-section-links"><a class="admission-source-hint" href="#admission-sources">情報ソースはこちら</a></p>';

export function sagaAdmissionsMetadata(data: UniversityAdmissions) {
  return {
    title: '佐賀大学医学部｜2027年度入試情報',
    displayTitle: '佐賀大学 医学部2027年度入試情報',
    displayTitleLines: ['佐賀大学 医学部','2027年度入試情報'],
    description: '佐賀大学医学科の2027年度一般選抜。前期51人、共通テスト640点・個別試験300点。日程、科目・配点、出題範囲、英語外部検定の条件と未公表事項を掲載。医学部所在地・アクセス、2026年度医学科入学者統計も紹介します。',
    lead: '佐賀大学医学部医学科の2027年度一般選抜について、日程、科目・配点、出題範囲、英語外部検定の条件を大学公式資料に基づきまとめています。試験時間・会場などは募集要項の公開後に更新します。出願前には、該当年度の募集要項と大学の変更通知をご確認ください。',
    modified: data.verifiedAt.slice(0,10),
    keyPoints: [
      '一般選抜は前期51人。個別試験は2027年2月25日・26日で、医学科の後期日程はありません。',
      '配点は共通テスト640点＋個別試験300点＝940点。個別理科は物理と化学の両方が必要で、面接は60点です。',
      '英語外部検定は共通テスト英語の70〜90％へ換算可能。換算点が共通テスト英語の得点より高い場合に採用します。',
    ],
  };
}

/** Explicit Saga copy preserves each canonical row and its internal source IDs. */
export function renderSagaAdmissionsReadable(data: UniversityAdmissions): string {
  if (data.path !== '/information-saga/' || data.schemes.length !== 1 || data.schemes[0].id !== 'general-early') throw new Error('Saga presentation requires the reviewed general selection');
  const scheme=data.schemes[0];
  for (const [kind,rows] of [['schedule',scheme.scheduleRows],['exam',scheme.examRows],['venue',scheme.venueRows]] as const) {
    if (rows.length !== copy[kind].length) throw new Error(`Saga ${kind} copy must be reviewed when rows change`);
  }
  const fact = (kind: 'exam'|'venue',i: number) => {
    const rows=kind==='exam'?scheme.examRows:scheme.venueRows;
    const [label,text]=copy[kind][i];
    return `<div class="admission-fact" ${attrs(`${kind}/${i}`,rows[i])}><dt data-admission-label>${escape(label)}</dt><dd data-admission-value>${value(text)}</dd></div>`;
  };
  const facts = (indices: number[]) => `<dl class="admission-facts">${indices.map(i=>fact('exam',i)).join('')}</dl>`;
  const note = (i: number) => `<div data-admission-note="${i}" data-admission-source-ids="${escape(JSON.stringify(scheme.notes[i].sourceIds))}"><div data-admission-note-text>${value(copy.notes[i].text ?? '')}</div></div>`;
  const heading=(s:string)=>`<h4 class="admission-group-title">${s}</h4>`;
  const summaryCell=(label:string,text:string)=>`<td><span class="admission-mobile-label" aria-hidden="true">${label}</span>${text}</td>`;
  const quotaSupplement=`<p class="admission-value-detail" data-admission-supplement-for="general-early/exam/0">${escape(copy.presentation['exam/0'].supplement)}</p>`;
  const overviewHtml=`<h3 id="admission-overview">入試方式・募集人数・主要日程</h3><table class="admission-overview-table" data-saga-table="overview"><caption class="admission-sr-only">佐賀大学医学科 2027年度一般選抜</caption><thead><tr><th scope="col">入試方式</th><th scope="col">募集人数</th><th scope="col">出願書類提出</th><th scope="col">個別試験</th></tr></thead><tbody><tr ${attrs('exam/0',scheme.examRows[0])}><th scope="row"><a href="#admission-scheme-general-early">一般選抜・前期</a></th>${summaryCell('募集人数','51人')}${summaryCell('出願書類提出','2027年1月25日〜2月3日')}${summaryCell('個別試験','2027年2月25日・26日')}</tr></tbody></table>${quotaSupplement}${note(3)}${sourceHint}`;
  const dates=`<table class="admission-dates-table" data-saga-table="dates"><caption class="admission-sr-only">一般選抜・前期の日程と締切条件</caption><thead><tr><th scope="col">項目</th><th scope="col">日程・条件</th></tr></thead><tbody>${copy.schedule.map(([label,text],i)=>`<tr ${attrs(`schedule/${i}`,scheme.scheduleRows[i])}><th scope="row" data-admission-label>${escape(label)}</th><td data-admission-value>${value(text)}</td></tr>`).join('')}</tbody></table><p class="admission-value-detail">Web登録・検定料支払は、書類提出期間に間に合うように済ませてください。</p>`;
  const scores=[['国語',140,null],['地歴・公民',70,null],['数学',140,80],['理科',140,80],['英語',140,80],['情報Ⅰ',10,null],['面接',null,60]] as const;
  const common=scores.reduce((s,r)=>s+(r[1]??0),0),individual=scores.reduce((s,r)=>s+(r[2]??0),0);
  if(common!==640 || individual!==300)throw new Error('Saga score totals changed');
  const point=(n:number|null)=>n===null?'課さない':`${n}点`;
  const scoreTable=`<table class="admission-score-table" data-saga-table="scores" ${attrs('exam/14',scheme.examRows[14])}><caption>教科・試験別の配点</caption><thead><tr><th scope="col">教科・試験</th><th scope="col">共通テスト</th><th scope="col">個別試験</th></tr></thead><tbody>${scores.map(([label,c,i])=>`<tr${label==='国語'?` ${attrs('exam/4',scheme.examRows[4])}`:''}><th scope="row">${label}</th><td>${point(c)}</td><td>${point(i)}</td></tr>`).join('')}<tr class="admission-score-total"><th scope="row">合計</th><td>640点</td><td>300点</td></tr><tr class="admission-score-total"><th scope="row">総合計</th><td colspan="2">940点</td></tr></tbody></table>`;
  const bands=[['90％（126点）','英検2250以上\nTEAP270以上\nGTEC1100以上\nTOEFL61以上'],['80％（112点）','英検2150〜2249\nTEAP235〜269\nGTEC1000〜1099\nTOEFL52〜60'],['70％（98点）','英検2050〜2149\nTEAP220〜234\nGTEC900〜999\nTOEFL45〜51']];
  const conversion=`<table class="admission-dates-table" data-saga-table="conversion"><caption>共通テスト英語140点への換算</caption><thead><tr><th scope="col">換算率・得点</th><th scope="col">いずれかのスコア</th></tr></thead><tbody>${bands.map(([rate,scores])=>`<tr><th scope="row">${rate}</th><td>${value(scores)}</td></tr>`).join('')}</tbody></table>`;
  const coverage=copy.coverage.map((entry,i)=>entry.text?`<li data-admission-coverage-note="${i}">${escape(entry.text)}</li>`:'').join('');
  const sources=`<details class="admission-source-footer"><summary>情報ソースはこちら</summary><div id="admission-sources"><p>佐賀大学の公式資料（確認日：<time data-university-admissions-verified-at datetime="${escape(data.verifiedAt)}">${data.verifiedAt.slice(0,10)}</time>）</p><ul class="admission-source-list" data-admission-source-list>${data.sources.map(s=>`<li data-admission-source-id="${s.id}"><a href="${escape(s.url)}">${escape(s.title)}</a>${s.pages?`<small>${escape(Array.isArray(s.pages)?`PDF p.${s.pages.join('、')}`:s.pages)}</small>`:''}</li>`).join('')}</ul></div></details>`;
  return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section class="admission-readable saga-readable" data-admissions-presentation="saga-readable-v2" data-university-admissions-year="2027">${overviewHtml}<section class="admission-readable-scheme" data-admission-scheme="general-early"><h3 id="admission-scheme-general-early">医学科 一般選抜（前期日程）</h3>${heading('出願・試験・手続の日程')}${dates}${sourceHint}${heading('出願資格')}${facts([1])}${sourceHint}${heading('試験科目・配点')}${scoreTable}${facts([2,3,5,6,7,8,9,10,11,12,13,15,16])}${sourceHint}${heading('英語外部検定の利用')}${facts([17])}${conversion}${facts([18])}${note(1)}${sourceHint}${heading('試験会場・受験票')}<dl class="admission-facts">${fact('venue',0)}${fact('venue',1)}</dl>${sourceHint}<div class="admission-important admission-scheme-notes"><h4>出願時の注意</h4>${note(0)}</div></section><h3 id="admission-coverage">募集要項の公開予定・掲載範囲</h3><ul class="admission-coverage">${coverage}</ul>${note(4)}${sources}</section>`;
}

export function renderSagaUniversityOverview(): string {
  const {address,entrants}=overview;
  if(entrants.male+entrants.female!==entrants.total || entrants.ages.reduce((s,r)=>s+Number(r[1]),0)!==entrants.total)throw new Error('Saga entrant totals changed');
  const table=(id:string,title:string,rows: [string,number][])=>`<h3 id="${id}">${title}</h3><table class="admission-score-table" data-saga-table="${id}"><caption>2026年度 医学部医学科入学者・104人<br><small>一般選抜と特別選抜の合計</small></caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label,n])=>`<tr><th scope="row">${label}</th><td>${n}人</td><td>${(n/entrants.total*100).toFixed(1)}％</td></tr>`).join('')}</tbody></table>`;
  return `<h2 id="大学基本情報">大学基本情報</h2><section class="admission-readable saga-readable" data-saga-university-overview><h3 id="所在地">所在地</h3><p>${address.campus}<br>〒${address.postalCode} ${address.street}</p><h3 id="アクセス">アクセス</h3><p>${overview.access}</p>${table('男女比','男女別の入学者',[['男性',entrants.male],['女性',entrants.female]])}${table('年齢別','年齢別の入学者',entrants.ages as [string,number][])}<p class="admission-value-detail">年齢別の区分です。現役・既卒別の人数は、この統計からは分かりません。</p><details class="admission-source-footer"><summary>情報ソースはこちら</summary><ul class="admission-source-list">${overview.sources.map(s=>`<li><a href="${escape(s.url)}">${escape(s.title)}</a></li>`).join('')}</ul><p>確認日：${overview.verifiedAt}</p></details></section>`;
}
