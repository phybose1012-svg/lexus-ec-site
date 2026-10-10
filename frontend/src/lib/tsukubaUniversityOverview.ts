import overview from '../data/tsukubaUniversityOverview.json' with { type: 'json' };

export const tsukubaOverviewVerifiedAt = overview.verifiedAt;
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Both distributions use the official medical-program entrants column. */
export function renderTsukubaUniversityOverview(): string {
  const { address, access, entrants, sources } = overview;
  if (entrants.male + entrants.female !== entrants.total || entrants.currentGraduate + entrants.previousGraduate !== entrants.total) {
    throw new Error('Tsukuba overview: entrant counts do not match the common total');
  }
  const table = (id: string, title: string, rows: [string, number][]) => `<section aria-labelledby="${id}"><h3 id="${id}">${title}</h3><table><caption>${entrants.year}年度 医学類入学者（${entrants.total}人）</caption><thead><tr><th scope="col">区分</th><th scope="col">人数</th><th scope="col">割合</th></tr></thead><tbody>${rows.map(([label, count]) => `<tr><th scope="row">${label}</th><td>${count}人</td><td>${(count / entrants.total * 100).toFixed(1)}%</td></tr>`).join('')}</tbody></table></section>`;
  return `<h2 id="大学基本情報">大学基本情報</h2><section class="tsukuba-university-overview" data-tsukuba-university-overview aria-labelledby="大学基本情報"><h3 id="所在地">所在地</h3><p>〒${escape(address.postalCode)} ${escape(address.street)}<br>${escape(overview.name)}<small>${escape(address.office)}</small></p><h3 id="アクセス">アクセス</h3><p>${escape(access.station)}に隣接する「${escape(access.terminal)}」から「${escape(access.bus)}」のバスで約${access.minutes}分。<br>「${escape(access.stop)}」下車。</p><div class="tsukuba-overview-statistics">${table('男女比', '男女比', [['男性', entrants.male], ['女性', entrants.female]])}${table('現浪比', '現浪比', [['現役', entrants.currentGraduate], ['既卒', entrants.previousGraduate]])}</div><details class="tsukuba-overview-sources"><summary>情報ソースはこちら</summary><ul>${sources.map(source => `<li><a href="${escape(source.url)}">${escape(source.title)}</a></li>`).join('')}</ul></details></section>`;
}
