import { renderTsukubaAdmissionsReadable } from './tsukubaAdmissionsReadable.ts';
import { renderTsukubaUniversityOverview, tsukubaOverviewVerifiedAt } from './tsukubaUniversityOverview.ts';
import { renderTsukubaComprehensiveSelection, tsukubaComprehensiveTitle } from './tsukubaComprehensiveSelection.ts';

/** Official, university-specific admission data; independent of legacy safety layers. */
export type AdmissionRowStatus = "confirmed" | "unpublished" | "needs-confirmation";
export type UniversityAdmissionSource = {
  id: string;
  url: string;
  title: string;
  publishedAt?: string;
  retrievedAt: string;
  sha256?: string;
  pages?: string | number[];
};
export type UniversityAdmissionRow = {
  label: string;
  value: string;
  sourceIds: string[];
  status?: AdmissionRowStatus;
};
export type UniversityAdmissionScheme = {
  id: string;
  name: string;
  scheduleRows: UniversityAdmissionRow[];
  examRows: UniversityAdmissionRow[];
  venueRows: UniversityAdmissionRow[];
  notes: { text: string; sourceIds: string[] }[];
};
export type UniversityAdmissions = {
  path: string;
  university: string;
  admissionYear: 2027;
  verifiedAt: string;
  sources: UniversityAdmissionSource[];
  schemes: UniversityAdmissionScheme[];
  coverageNotes: string[];
};

export const universityAdmissionsOfficialProfiles = [
  ["yamanashi", "山梨大学", "https://www.yamanashi.ac.jp/"],
  ["tokushima", "徳島大学", "https://www.tokushima-u.ac.jp/"],
  ["saga", "佐賀大学", "https://www.saga-u.ac.jp/"],
  ["hirosaki", "弘前大学", "https://www.hirosaki-u.ac.jp/"],
  ["asahikawaika", "旭川医科大学", "https://www.asahikawa-med.ac.jp/"],
  ["shimane", "島根大学", "https://www.shimane-u.ac.jp/"],
  ["yamaguchi", "山口大学", "https://www.yamaguchi-u.ac.jp/"],
  ["miyazaki", "宮崎大学", "https://www.miyazaki-u.ac.jp/"],
  ["akita", "秋田大学", "https://www.akita-u.ac.jp/"],
  ["yamagata", "山形大学", "https://www.yamagata-u.ac.jp/jp/"],
  ["tottori", "鳥取大学", "https://www.tottori-u.ac.jp/"],
  ["fukui", "福井大学", "https://www.u-fukui.ac.jp/"],
  ["toyama", "富山大学", "https://www.u-toyama.ac.jp/"],
  ["ryukyu", "琉球大学", "https://www.u-ryukyu.ac.jp/"],
  ["nara", "奈良県立医科大学", "https://www.naramed-u.ac.jp/"],
  ["shigaika", "滋賀医科大学", "https://www.shiga-med.ac.jp/"],
  ["kagawa", "香川大学", "https://www.kagawa-u.ac.jp/"],
  ["sapporoika", "札幌医科大学", "https://web.sapmed.ac.jp/"],
  ["gunma", "群馬大学", "https://www.gunma-u.ac.jp/"],
  ["fukushima", "福島県立医科大学", "https://www.fmu.ac.jp/"],
  ["kagoshima", "鹿児島大学", "https://www.kagoshima-u.ac.jp/"],
  ["kochi", "高知大学", "https://www.kochi-u.ac.jp/"],
  ["wakayama", "和歌山県立医科大学", "https://www.wakayama-med.ac.jp/"],
  ["mie", "三重大学", "https://www.mie-u.ac.jp/"],
  ["oita", "大分大学", "https://www.oita-u.ac.jp/"],
  ["osakakouritsu", "大阪公立大学", "https://www.omu.ac.jp/"],
  ["kobe", "神戸大学", "https://www.kobe-u.ac.jp/"],
  ["kyotofuritsu", "京都府立医科大学", "https://www.kpu-m.ac.jp/"],
  ["gifu", "岐阜大学", "https://www.gifu-u.ac.jp/"],
  ["shinsyu", "信州大学", "https://www.shinshu-u.ac.jp/"],
  ["yokohama", "横浜市立大学", "https://www.yokohama-cu.ac.jp/"],
  ["kyusyu", "九州大学", "https://www.kyushu-u.ac.jp/ja/"],
  ["tsukuba", "筑波大学", "https://www.tsukuba.ac.jp/"],
  ["ehime", "愛媛大学", "https://www.ehime-u.ac.jp/"],
  ["hamamatsu", "浜松医科大学", "https://www.hama-med.ac.jp/"],
  ["nigata", "新潟大学", "https://www.niigata-u.ac.jp/"],
  ["hokkaido", "北海道大学", "https://www.hokudai.ac.jp/"],
  ["nagasaki", "長崎大学", "https://www.nagasaki-u.ac.jp/"],
  ["nagoya", "名古屋大学", "https://www.nagoya-u.ac.jp/"],
  ["tokyokagaku", "東京科学大学", "https://www.isct.ac.jp/ja"],
  ["hiroshima", "広島大学", "https://www.hiroshima-u.ac.jp/"],
  ["kumamoto", "熊本大学", "https://www.kumamoto-u.ac.jp/"],
  ["nagoyaishiritu", "名古屋市立大学", "https://www.nagoya-cu.ac.jp/"],
  ["okayama", "岡山大学", "https://www.okayama-u.ac.jp/"],
  ["chiba", "千葉大学", "https://www.m.chiba-u.ac.jp/"],
  ["kanazawa", "金沢大学", "https://www.kanazawa-u.ac.jp/"],
  ["osaka", "大阪大学", "https://www.osaka-u.ac.jp/ja"],
  ["kyoto", "京都大学", "https://www.kyoto-u.ac.jp/ja"],
  ["tohoku", "東北大学", "https://www.tohoku.ac.jp/"],
  ["tokyo", "東京大学", "https://www.u-tokyo.ac.jp/ja/admissions/"],
  ["fujita", "藤田医科大学", "https://www.fujita-hu.ac.jp/"],
  ["fukuoka", "福岡大学", "https://www.fukuoka-u.ac.jp/"],
  ["hyogo", "兵庫医科大学", "https://www.hyo-med.ac.jp/"],
  ["nichidai", "日本大学", "https://www.med.nihon-u.ac.jp/"],
  ["nihonika", "日本医科大学", "https://www.nms.ac.jp/"],
  ["dokkyo", "獨協医科大学", "https://www.dokkyomed.ac.jp/dmu/"],
  ["tohokuika", "東北医科薬科大学", "https://www.tohoku-mpu.ac.jp/"],
  ["toho", "東邦大学", "https://www.toho-u.ac.jp/"],
  ["jyoshiika", "東京女子医科大学", "https://www.twmu.ac.jp/univ/"],
  ["jikei", "東京慈恵会医科大学", "https://www.jikei.ac.jp/"],
  ["tokyoika", "東京医科大学", "https://www.tokyo-med.ac.jp/"],
  ["tokai", "東海大学", "https://www.u-tokai.ac.jp/"],
  ["teikyo", "帝京大学", "https://www.teikyo-u.ac.jp/"],
  ["saint", "聖マリアンナ医科大学", "https://www.marianna-u.ac.jp/"],
  ["showa", "昭和医科大学", "https://www.showa-u.ac.jp/"],
  ["jyunten", "順天堂大学", "https://www.juntendo.ac.jp/"],
  ["jichi", "自治医科大学", "https://www.jichi.ac.jp/"],
  ["sangyoika", "産業医科大学", "https://www.uoeh-u.ac.jp/"],
  ["saitama", "埼玉医科大学", "https://www.saitama-med.ac.jp/"],
  ["kokusai", "国際医療福祉大学", "https://www.iuhw.ac.jp/"],
  ["keio", "慶應義塾大学", "https://www.keio.ac.jp/ja/"],
  ["kurume", "久留米大学", "https://www.kurume-u.ac.jp/"],
  ["kinki", "近畿大学", "https://www.kindai.ac.jp/medicine/admissions/exam/"],
  ["kyorin", "杏林大学", "https://www.kyorin-u.ac.jp/"],
  ["kitasato", "北里大学", "https://www.kitasato-u.ac.jp/jp/index.html"],
  ["kansai", "関西医科大学", "https://www.kmu.ac.jp/"],
  ["kawasaki", "川崎医科大学", "https://m.kawasaki-m.ac.jp/"],
  ["osakaika", "大阪医科薬科大学", "https://www.ompu.ac.jp/"],
  ["iwate", "岩手医科大学", "https://www.iwate-med.ac.jp/"],
  ["aichi", "愛知医科大学", "https://www.aichi-med-u.ac.jp/"],
  ["kanazawaika", "金沢医科大学", "https://www.kanazawa-med.ac.jp/medicine_exam/"],
].map(([slug, university, officialUrl]) => ({
  path: `/information-${slug}/`, university, officialUrl,
}));


const officialByPath = new Map(universityAdmissionsOfficialProfiles.map(profile => [profile.path, profile]));
// University-operated admission sites on domains separate from their main site.
// Shared vendors, aggregators and a source's self-declared "official" flag do not qualify.
const additionalOfficialDomains: Record<string, string[]> = {
  "/information-iwate/": ["imu-admission.jp"],
  "/information-tokyoika/": ["admissions-tokyo-med.jp"],
  "/information-jyoshiika/": ["twmu-u.jp"],
};
const sourceDomain = (url: string) => new URL(url).hostname.split(".").slice(-3).join(".");
const hostBelongsTo = (hostname: string, domain: string) => hostname === domain || hostname.endsWith(`.${domain}`);
// DNC publishes the nationwide Common Test. It does not set a university's
// admission requirements, adopted subjects, score conversions or own venues.
const commonTestOfficialDomain = "dnc.ac.jp";
const commonTestReference = /(?:大学入学)?共通テスト/;
const commonTestDateLabel = /^(?:大学入学)?共通テスト(?:[（(](?:本試験|追[・･]?再試験|追試験|再試験)[）)]|[・\s]*(?:本試験|追[・･]?再試験|追試験|再試験))?(?:[・\s]*(?:実施期日|実施日|試験日|日程))?$/;
const commonTestDateValue = /^(?:令和|西暦)?[0-9０-９年月日月火水木金土・･、。，,.\/／～〜\-－（()）\s]+$/;
const universitySpecificCondition = /募集|合否|選抜|前期|後期|地域枠|採用|利用|指定|必須|換算|満点|配点|学部|医学科|医学部/;
const failure = (message: string): never => { throw new Error(`University admissions data: ${message}`); };
const record = (value: unknown, label: string): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : failure(`${label} must be an object`);
const nonempty = (value: unknown, label: string): string =>
  typeof value === "string" && value.trim() ? value : failure(`${label} must be a nonempty string`);
const array = (value: unknown, label: string, minimum = 0): unknown[] =>
  Array.isArray(value) && value.length >= minimum ? value : failure(`${label} must be an array of at least ${minimum} items`);
const identifier = (value: unknown, label: string): string => {
  const result = nonempty(value, label);
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result) ? result : failure(`${label} must use a lowercase ASCII slug`);
};
const date = (value: unknown, label: string): string => {
  const result = nonempty(value, label);
  if (!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(result) || Number.isNaN(Date.parse(result))) failure(`${label} must be an ISO date or timestamp with timezone`);
  const [year, month, day] = result.slice(0,10).split("-").map(Number);
  const calendar = new Date(Date.UTC(year,month-1,day));
  if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month-1 || calendar.getUTCDate() !== day) failure(`${label} has an invalid calendar date`);
  return result;
};
const unique = (items: string[], label: string) => {
  if (new Set(items).size !== items.length) failure(`${label} must be unique`);
};

/** Validate shape, scope, university/source ownership and references; never silently skip bad data. */
export function validateUniversityAdmissions(input: unknown, filename?: string): UniversityAdmissions {
  const data = record(input, filename ?? "document");
  const path = nonempty(data.path, "path");
  const profile = officialByPath.get(path) ?? failure(`unknown university path ${path}`);
  if (nonempty(data.university, "university") !== profile.university) failure(`university does not match ${path}`);
  if (data.admissionYear !== 2027) failure(`${path}: admissionYear must be 2027; previous-year data cannot be promoted automatically`);
  const verifiedAt = date(data.verifiedAt, `${path}.verifiedAt`);
  if (filename) {
    const slug = filename.replace(/\\/g,"/").match(/\/([^/]+)\.json$/)?.[1];
    if (slug !== path.replace(/^\/information-|\/$/g,"")) failure(`${filename}: filename does not match ${path}`);
  }
  const allowed = [sourceDomain(profile.officialUrl), ...(additionalOfficialDomains[path] ?? [])];
  const universitySourceIds = new Set<string>();
  const commonTestSourceIds = new Set<string>();
  const sources = array(data.sources, `${path}.sources`, 1).map((entry,index) => {
    const source = record(entry, `${path}.sources[${index}]`);
    const id = identifier(source.id, "source.id");
    const url = nonempty(source.url, `${id}.url`);
    let parsed: URL;
    try { parsed = new URL(url); } catch { return failure(`${id}: source URL is invalid`); }
    if (parsed.protocol !== "https:" || parsed.username || parsed.password || (parsed.port && parsed.port !== "443")) failure(`${id}: source URL must be public HTTPS without credentials`);
    const universityOwned = allowed.some(domain => hostBelongsTo(parsed.hostname,domain));
    const commonTestOwned = hostBelongsTo(parsed.hostname,commonTestOfficialDomain);
    if (!universityOwned && !commonTestOwned) failure(`${id}: source host ${parsed.hostname} is not official for ${profile.university} or the Common Test publisher`);
    if (universityOwned) universitySourceIds.add(id);
    else commonTestSourceIds.add(id);
    const title = nonempty(source.title, `${id}.title`);
    const retrievedAt = date(source.retrievedAt, `${id}.retrievedAt`);
    if (Date.parse(retrievedAt) > Date.parse(verifiedAt)) failure(`${id}: retrieval cannot be later than verifiedAt`);
    if (source.publishedAt !== undefined) date(source.publishedAt, `${id}.publishedAt`);
    if (source.sha256 !== undefined && (typeof source.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(source.sha256))) failure(`${id}: sha256 must have 64 hexadecimal characters`);
    if (source.pages !== undefined && !(typeof source.pages === "string" && source.pages.trim()) && !(Array.isArray(source.pages) && source.pages.length && source.pages.every(p=>Number.isInteger(p) && p>0))) failure(`${id}: pages must be a nonempty page label or positive page numbers`);
    return {id,url,title,retrievedAt,...(source.publishedAt !== undefined ? {publishedAt:source.publishedAt as string}:{}),...(source.sha256 !== undefined?{sha256:source.sha256 as string}:{}),...(source.pages !== undefined?{pages:source.pages as string|number[]}: {})};
  });
  unique(sources.map(source=>source.id), "source ids");
  if (!universitySourceIds.size) failure(`${path}: at least one official source from ${profile.university} is required; DNC cannot replace university admission evidence`);
  const knownSourceIds = new Set(sources.map(source=>source.id));
  const sourceIds = (value: unknown, label: string) => {
    const ids = array(value,label,1).map(id=>identifier(id,label));
    unique(ids,label);
    for (const id of ids) if (!knownSourceIds.has(id)) failure(`${label}: unknown source id ${id}`);
    return ids;
  };
  const scopedSourceIds = (value: unknown,label: string,claimLabel: string,claimValue: string,kind: "schedule"|"exam"|"venue"|"note") => {
    const ids=sourceIds(value,label);
    if (!ids.some(id=>commonTestSourceIds.has(id))) return ids;
    if (!commonTestReference.test(claimLabel)) failure(`${label}: DNC citations are limited to explicitly named Common Test rows or notes`);
    const hasUniversity=ids.some(id=>universitySourceIds.has(id));
    const nationalDateOnly=kind === "schedule" && commonTestDateLabel.test(claimLabel.trim()) && commonTestDateValue.test(claimValue.trim()) && /(?:\d{4}|令和\s*\d+)年\s*\d{1,2}月\s*\d{1,2}日|\d{4}[\/.-]\d{1,2}[\/.-]\d{1,2}/.test(claimValue) && !universitySpecificCondition.test(claimValue) && !claimValue.includes(profile.university);
    if (!hasUniversity && !nationalDateOnly) failure(`${label}: university-specific conditions require this university's official source; DNC alone supports only a nationwide Common Test date row`);
    return ids;
  };
  const rows = (value: unknown, label: string,kind: "schedule"|"exam"|"venue"): UniversityAdmissionRow[] => array(value,label,1).map((entry,index)=>{
    const row = record(entry,`${label}[${index}]`);
    const rowLabel = nonempty(row.label,`${label}[${index}].label`);
    const rowValue = nonempty(row.value,`${label}[${index}].value`);
    if (row.status !== undefined && !["confirmed","unpublished","needs-confirmation"].includes(String(row.status))) failure(`${label}[${index}]: invalid status`);
    if (row.status === "unpublished" && !/未公表|未公開|公表されてい|公表してい|確認できない/.test(rowValue)) failure(`${label}[${index}]: unpublished status must be stated in the visible value`);
    if (row.status === "needs-confirmation" && !/要確認|確認が必要|確認中|未公表|未公開|公表されてい|公表してい|確認できない/.test(rowValue)) failure(`${label}[${index}]: needs-confirmation status must be stated in the visible value`);
    return {label:rowLabel,value:rowValue,sourceIds:scopedSourceIds(row.sourceIds,`${label}[${index}].sourceIds`,rowLabel,rowValue,kind),...(row.status !== undefined?{status:row.status as AdmissionRowStatus}: {})};
  });
  const schemes = array(data.schemes,`${path}.schemes`,1).map((entry,index)=>{
    const scheme = record(entry,`${path}.schemes[${index}]`);
    const id = identifier(scheme.id,"scheme.id");
    return {id,name:nonempty(scheme.name,`${id}.name`),scheduleRows:rows(scheme.scheduleRows,`${id}.scheduleRows`,"schedule"),examRows:rows(scheme.examRows,`${id}.examRows`,"exam"),venueRows:rows(scheme.venueRows,`${id}.venueRows`,"venue"),notes:array(scheme.notes,`${id}.notes`).map((entry,index)=>{
      const note=record(entry,`${id}.notes[${index}]`);
      const noteText=nonempty(note.text,`${id}.notes[${index}].text`);
      return {text:noteText,sourceIds:scopedSourceIds(note.sourceIds,`${id}.notes[${index}].sourceIds`,noteText,noteText,"note")};
    })};
  });
  unique(schemes.map(scheme=>scheme.id),"scheme ids");
  const coverageNotes = array(data.coverageNotes,`${path}.coverageNotes`,1).map(note=>nonempty(note,`${path}.coverageNotes`));
  return {path,university:profile.university,admissionYear:2027,verifiedAt,sources,schemes,coverageNotes};
}

/** Pure index builder accepts Vite JSON modules or explicit fixtures for tests. */
export function createUniversityAdmissionsIndex(inputs: Record<string, unknown>): Map<string, UniversityAdmissions> {
  const index = new Map<string,UniversityAdmissions>();
  for (const [filename,input] of Object.entries(inputs)) {
    const data = validateUniversityAdmissions(input,filename);
    if (index.has(data.path)) failure(`duplicate university path ${data.path}`);
    index.set(data.path,data);
  }
  return index;
}

export const escapeUniversityAdmissionHtml = (value: string) => value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const htmlText = (value: string) => escapeUniversityAdmissionHtml(value).replace(/\r?\n/g,"<br>");
const plainText = (value: string) => value.replace(/<[^>]*>/g,"").replace(/&nbsp;/g," ").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;|&#039;/g,"'").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();

export function universityAdmissionsMetadata(data: UniversityAdmissions) {
  const university = data.university;
  const isTsukuba = data.path === '/information-tsukuba/';
  const admissionTitle = isTsukuba ? '2027年度入試情報' : '2027年度入試情報・大学概要';
  return {
    title: `${university}医学部｜${admissionTitle}`,
    displayTitle: isTsukuba ? `${university} 医学部${admissionTitle}` : `${university} 医学部 ${admissionTitle}`,
    displayTitleLines: [`${university} 医学部`, admissionTitle],
    description: isTsukuba ? `${university}医学部の2027年度入試情報。試験日程、会場、科目、時間、配点、出題範囲を選抜方式別に掲載。所在地・アクセスと2026年度医学類入学者の男女比・現浪比も紹介しています。` : `${university}医学部の2027年度入試情報。大学公式資料で確認した選抜方式別の日程、試験科目・配点、試験会場を掲載しています。未公表・要確認の項目と掲載範囲を明記。大学概要の統計・学納金は過年度の参考情報です。`,
    lead: `${university}医学部の2027年度入試情報${isTsukuba ? '（試験日程、会場、科目、時間、配点、出題範囲 等）' : ''}を、大学公式資料に基づき選抜方式別にまとめています。出願前には、該当年度の学生募集要項と大学の変更通知をご確認ください。`,
    modified: isTsukuba && tsukubaOverviewVerifiedAt > data.verifiedAt.slice(0,10) ? tsukubaOverviewVerifiedAt : data.verifiedAt.slice(0,10),
    keyPoints: isTsukuba ? [
      "一般選抜（一般枠）は前期44人。個別試験は2027年2月25日・26日で、後期日程はありません。",
      "一般枠の配点は共通テスト950点＋個別試験1,400点＝計2,350点。個別試験には筆記の適性試験と面接を含みます。",
      "推薦入試（一般）は44人募集、試験日は2026年11月26日・27日。共通テストは課しません。",
    ] : ["掲載した選抜方式の日程、試験科目・配点、試験会場を2027年度の公式資料で確認しています。",`公式資料の確認日：${data.verifiedAt.slice(0,10)}。`,"未公表・要確認の項目と掲載範囲を確認し、出願前に大学の変更通知と受験票をご確認ください。"],
  };
}

/** Render only canonical validated data; values remain text, never raw HTML. */
export function renderUniversityAdmissions(input: UniversityAdmissions): string {
  const data = validateUniversityAdmissions(input);
  if (data.path === '/information-tsukuba/') return renderTsukubaAdmissionsReadable(data);
  const sources = new Map(data.sources.map((source,index)=>[source.id,{source,index}]));
  const refs = (ids: string[]) => ids.map(id=>{
    const item=sources.get(id) ?? failure(`unknown render source ${id}`);
    return `<a data-admission-source-id="${escapeUniversityAdmissionHtml(id)}" href="${escapeUniversityAdmissionHtml(item.source.url)}" title="${escapeUniversityAdmissionHtml(item.source.title)}">資料${item.index+1}</a>`;
  }).join("、");
  const table = (scheme: UniversityAdmissionScheme,kind: "schedule"|"exam"|"venue",label: string,rows: UniversityAdmissionRow[]) => `<table data-admission-table="${kind}"><caption>${htmlText(data.university)} 医学部 2027年度 ${htmlText(scheme.name)} ${label}</caption><thead><tr><th scope="col">項目</th><th scope="col">内容</th><th scope="col">公式出典</th></tr></thead><tbody>${rows.map((row,index)=>`<tr data-admission-row="${index}"${row.status?` data-admission-status="${row.status}"`:""}><th scope="row" data-admission-label>${htmlText(row.label)}</th><td data-admission-value>${htmlText(row.value)}</td><td data-admission-sources>${refs(row.sourceIds)}</td></tr>`).join("")}</tbody></table>`;
  return `<h2 id="最新の入試情報">2027年度の入試情報</h2><section data-university-admissions-year="2027" aria-labelledby="最新の入試情報"><p>公式資料確認日：<time data-university-admissions-verified-at datetime="${escapeUniversityAdmissionHtml(data.verifiedAt)}">${htmlText(data.verifiedAt.slice(0,10))}</time>。掲載した選抜方式と項目の情報です。出願前には大学の変更通知と受験票の指定もご確認ください。</p>${data.schemes.map(scheme=>`<section data-admission-scheme="${scheme.id}" aria-labelledby="admission-scheme-${scheme.id}"><h3 id="admission-scheme-${scheme.id}">${htmlText(scheme.name)}</h3>${table(scheme,"schedule","日程",scheme.scheduleRows)}${table(scheme,"exam","試験科目・配点",scheme.examRows)}${table(scheme,"venue","試験会場",scheme.venueRows)}${scheme.notes.length?`<ul>${scheme.notes.map((note,index)=>`<li data-admission-note="${index}"><span data-admission-note-text>${htmlText(note.text)}</span> ${refs(note.sourceIds)}</li>`).join("")}</ul>`:""}</section>`).join("")}<h3 id="admission-coverage">掲載範囲・確認が必要な項目</h3><ul>${data.coverageNotes.map((note,index)=>`<li><span data-admission-coverage-note="${index}">${htmlText(note)}</span></li>`).join("")}</ul><h3 id="admission-sources">公式出典</h3><ol data-admission-source-list>${data.sources.map(source=>`<li data-admission-source-id="${source.id}" id="admission-source-${source.id}"><a href="${escapeUniversityAdmissionHtml(source.url)}">${htmlText(source.title)}</a>${source.pages?`（${htmlText(Array.isArray(source.pages)?`PDF p.${source.pages.join("、")}`:source.pages)}）`:""} — 確認日 <time datetime="${escapeUniversityAdmissionHtml(source.retrievedAt)}">${htmlText(source.retrievedAt.slice(0,10))}</time>${source.publishedAt?`、公表日 <time datetime="${escapeUniversityAdmissionHtml(source.publishedAt)}">${htmlText(source.publishedAt.slice(0,10))}</time>`:""}</li>`).join("")}</ol></section>`;
}

type AdmissionPost = {
  path: string;
  template?: string;
  contentHtml: string;
  infoItems: {label:string;value:string}[];
  toc: {id:string;text:string;level?:number}[];
};

/** Pure transformer supports the original staging article and main's safety article. */
export function applyUniversityAdmissionsFromIndex<T extends AdmissionPost>(post: T,index: ReadonlyMap<string,UniversityAdmissions>): T {
  const data=index.get(post.path);
  if (!data || post.template !== "admission-info") return post;
  const admissionHtml=renderUniversityAdmissions(data);
  let replaced=false;
  let overviewReplaced=false;
  let contentHtml=post.contentHtml.replace(/<h2\b[^>]*>[\s\S]*?<\/h2>[\s\S]*?(?=<h2\b|$)/gi,block=>{
    const heading=plainText(block.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? "");
    if (data.path === '/information-tsukuba/' && heading === tsukubaComprehensiveTitle) return '';
    if (data.path === '/information-tsukuba/' && heading === '大学基本情報') {
      if (overviewReplaced) return '';
      overviewReplaced=true;
      return renderTsukubaUniversityOverview();
    }
    if (["一般選抜情報","一次選抜情報","最新の入試情報を確認する"].includes(heading) || /^\d{4}年度の入試情報$/.test(heading)) {
      if (replaced) return "";
      replaced=true;
      return admissionHtml;
    }
    if (heading === "募集要項") return "";
    return block;
  });
  if (!replaced) contentHtml+=admissionHtml;
  if (data.path === '/information-tsukuba/') {
    if (!overviewReplaced) contentHtml+=renderTsukubaUniversityOverview();
    // Lead with the current admission information; keep the university overview below it.
    contentHtml=admissionHtml+renderTsukubaComprehensiveSelection()+contentHtml.replace(admissionHtml,'');
  }
  contentHtml=contentHtml.replace(/<p\b[^>]*(?:data-university-info-safety=["']overview["']|data-university-admissions-overview)[^>]*>[\s\S]*?<\/p>/gi,"");
  contentHtml=contentHtml.replace(/<h3\b([^>]*)>([\s\S]*?)<\/h3>/gi,(tag,attrs,inner)=>plainText(inner)==="学納金"?`<h3${attrs}>学納金（掲載時点の参考情報）</h3>`:tag);
  const overviewNotice='<p data-university-admissions-overview>入試表は2027年度の情報です。大学概要の統計・学納金は過年度の参考情報です。教育内容・費用は大学の最新案内をご確認ください。</p>';
  if (data.path !== '/information-tsukuba/') contentHtml=overviewNotice+contentHtml;
  const toc=[...contentHtml.matchAll(/<h([23])\b[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h\1>/gi)].map(match=>({id:match[2],text:plainText(match[3]),level:Number(match[1]) as 2|3}));
  const infoItems=post.infoItems.map(item=>item.label === "年度" ? {...item,value:"2027年度（入試情報）"} : item.label === "種別" ? {...item,value:"大学概要・2027年度入試情報"} : item);
  return {...post,...universityAdmissionsMetadata(data),contentHtml,infoItems,toc};
}

// Vite supplies env.SSR and expands the literal eager glob for Astro builds.
// Pure Node imports have no env, so tests can supply their own index without
// evaluating a Vite loader. Broken JSON still fails Vite parsing/building.
const modules: Record<string,unknown> = import.meta.env?.SSR
  ? import.meta.glob("../data/universityAdmissions/*.json",{eager:true,import:"default"})
  : {};
const universityAdmissionsIndex=createUniversityAdmissionsIndex(modules);
export function applyVerifiedUniversityAdmissions<T extends AdmissionPost>(post: T): T {
  return applyUniversityAdmissionsFromIndex(post,universityAdmissionsIndex);
}
