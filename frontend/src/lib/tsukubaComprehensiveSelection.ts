export const tsukubaComprehensiveTitle = '総合選抜から医学類へ進むことも可能';

/** Applicant guidance checked against the medical admissions and SCS websites on 2026-10-10. */
export function renderTsukubaComprehensiveSelection(): string {
  return `<h2 id="admission-comprehensive">${tsukubaComprehensiveTitle}</h2>
<section class="tsukuba-comprehensive-section" data-tsukuba-comprehensive-selection aria-labelledby="admission-comprehensive">
<p>医学類を直接受験する方式に加え、入学後に専門を決める「総合選抜」のルートもあります。総合選抜は、一般選抜・前期日程の一方式です。</p>
<h3 id="admission-comprehensive-steps">入学から医学類への移行まで</h3>
<ol class="tsukuba-comprehensive-steps">
<li><strong>1年次：総合学域群で学ぶ</strong><p>総合選抜で入学し、共通科目や専門導入科目を学びながら、進みたい分野を考えます。</p></li>
<li><strong>1年次の3月：移行先が決まる</strong><p>学生の志望順位と、各学類・専門学群の受入順位を組み合わせて、2年次の所属先が決まります。</p></li>
<li><strong>2年次：医学類に所属</strong><p>医学類への移行が決まった学生は、医学類で学びます。</p></li>
</ol>
<h3 id="admission-comprehensive-capacity">医学類の受入枠と注意点</h3>
<p>2027年度の医学群入試案内では、総合選抜から医学類への2年次受入人数は<strong>5人</strong>とされています。公表人数は募集人員を基準としたもので、実際の受入人数は入学者数などによって異なります。</p>
<p class="tsukuba-comprehensive-important"><strong>総合選抜に合格しても、医学類への移行は保証されません。</strong><br>本人の希望に加え、入学後の成績や適性を踏まえて移行先が決まります。</p>
<details class="tsukuba-overview-sources"><summary>情報ソースはこちら</summary><ul>
<li><a href="https://www.md.tsukuba.ac.jp/igakugun/admissions/">医学群 2027年度入学試験案内</a></li>
<li><a href="https://scs.tsukuba.ac.jp/about/course">総合学域群 移行の制度</a></li>
<li><a href="https://scs.tsukuba.ac.jp/">総合学域群 総合選抜と1年次の学び</a></li>
</ul></details></section>`;
}
