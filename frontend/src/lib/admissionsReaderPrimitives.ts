/** Shared presentation only. Each university owns its facts, route scopes and labels. */
export type AdmissionReaderRow = {label:string; value:string; origins:string[]; sourceIds:string[]; status?:string};
export const escapeAdmissionText = (value:string) => value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function admissionFactAttributes(row:AdmissionReaderRow) {
  return `data-admission-origins="${escapeAdmissionText(row.origins.join(' '))}" data-admission-source-ids="${escapeAdmissionText(row.sourceIds.join(' '))}"${row.status?` data-admission-status="${escapeAdmissionText(row.status)}"`:''}`;
}
export function renderAdmissionReaderTable(caption:string,rows:AdmissionReaderRow[],kind='schedule') {
  return `<table data-admission-table="${escapeAdmissionText(kind)}"><caption>${escapeAdmissionText(caption)}</caption><thead><tr><th scope="col">項目</th><th scope="col">内容</th></tr></thead><tbody>${rows.map(r=>`<tr ${admissionFactAttributes(r)}><th scope="row">${escapeAdmissionText(r.label)}</th><td>${escapeAdmissionText(r.value)}</td></tr>`).join('')}</tbody></table>`;
}
export function renderAdmissionReaderConditions(rows:AdmissionReaderRow[]) {
  return `<ul class="admission-conditions">${rows.map(r=>`<li ${admissionFactAttributes(r)}><strong>${escapeAdmissionText(r.label)}</strong> ${escapeAdmissionText(r.value)}</li>`).join('')}</ul>`;
}
export function renderAdmissionReaderSources(sources:{id:string;title:string;url:string}[]) {
  return `<details class="admission-sources" data-admission-source-list><summary>情報ソースはこちら</summary><ul>${sources.map(s=>{
    if(!/^https?:\/\//u.test(s.url)) throw new Error('Official source URL must use HTTP(S)');
    return `<li><a href="${escapeAdmissionText(s.url)}" data-admission-source-id="${escapeAdmissionText(s.id)}" target="_blank" rel="noopener noreferrer">${escapeAdmissionText(s.title)}</a></li>`;
  }).join('')}</ul></details>`;
}
