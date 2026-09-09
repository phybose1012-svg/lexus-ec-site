// Reader-facing, scoped review gates. Remove only after canonical source repair.
export const reviewNotices={
 'fujita-health-2025-general-early-physics':{
  'major-question-04':{
   title:'第4問・問9〜10の解説は前提を確認中です',
   message:'元解答は問10を「数式のグラフ」として扱っていますが、この限定が学習者向けHTMLから抜けています。下向きの速度や再衝突を含む物理的な適用範囲は確認中です。以下のグラフも数式の可視化に限り、確認完了まで正式な演習・採点用に使用しないでください。',
  },
 },
 'fujita-health-2025-general-early-mathematics':{
  'major-question-01':{
   title:'第1問の解説は一部確認中です',
   message:'(1)の体積計算、(2)の偏角条件、(8)の置換後の値域について、元データの説明に不整合があります。問題条件・解答値の変更ではありませんが、該当解説は確認完了まで正式な教材として使用しないでください。',
  },
 },
 'dokkyo-medical-2025-general-early-physics':{
  'major-question-04':{
   title:'第4問・問3〜4は元データを確認中です',
   message:'問題文の電流条件「I₀/6」と解説の「I₀」が一致していません。原本と照合するまで、問3〜4は演習・採点の対象外としてください。',
  },
 },
};
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function withReviewNotice(html,packageId,majorId){
 const notice=reviewNotices[packageId]?.[majorId];
 if(!notice)return html;
 if(!html.includes('</h2>'))throw Error('Review notice needs a major heading');
 return html.replace('</h2>',`</h2><aside class="past-exam-source-review" role="note" data-source-review="required"><strong>${escape(notice.title)}</strong><p>${escape(notice.message)}</p></aside>`);
}
