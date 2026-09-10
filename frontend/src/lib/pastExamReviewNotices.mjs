// Reader-facing, scoped review gates. Remove only after canonical source repair.
export const reviewNotices={
 'international-health-welfare-2025-general-mathematics':{
  'major-question-01':{
   title:'第1問(C)・(E)の問題と解答を照合中です',
   message:'対数不等式の定数、双曲線の焦点と接点について、問題HTMLと解答の式が一致していません。原本照合・修復が完了するまで(C)・(E)は演習・採点の対象外としてください。',
  },
  'major-question-02':{
   title:'第2問(2)の解説文を確認中です',
   message:'Mは2本の接線の接点R・Sの中点です。元解説にはQ・Rの中点とする誤記と、四角形ABCDを正方形とする誤記があります。追加した軌跡図は問題の接点中点から計算しています。',
  },
  'major-question-03':{
   title:'第3問(3)(ii)の解答欄を照合中です',
   message:'元問題HTMLに漸化式・一般項が完成した形で記載されています。またp_nはAにいる確率ですが、元解説にはDとする誤記があります。解答欄の復元までは該当設問を採点しないでください。「通る」が辺上の通過を含む点も原本で確認しています。',
  },
  'major-question-04':{
   title:'第4問の符号説明と最終積分を確認中です',
   message:'(2)(ii)の絶対値を外す区間の説明が逆になっており、(3)の積分値と対数の変形にも不整合があります。三角形はx>0の条件から描いていますが、該当解説・最終解答の教材利用は原本照合・修復後にしてください。',
  },
 },
 'hyogo-medical-2025-general-a-b-physics':{
  'major-question-01':{
   title:'問1(4)・(6)・(10)の速度条件は元データを確認中です',
   message:'垂直抗力の式と、解答の速度上限でtan αの次数が一致していません。後続の角度条件も含め、原本照合・修正が完了するまで該当する解答を演習の採点に使用しないでください。',
  },
  'major-question-02':{
   title:'問2の方向選択図は確認中です',
   message:'元HTMLにa・bの矢印と電源極性の対応がありません。図2を確認できるまで、(1)②・④・⑤の方向選択は演習・採点の対象外としてください。',
  },
  'major-question-04':{
   title:'問4(5)の導出過程は確認中です',
   message:'原解説の距離CDの中間式に符号の不一致があり、学習者向けHTMLではその過程が省略されています。焦点への光線を新たに図示していますが、該当導出の教材利用は原本照合・修正後にしてください。',
  },
 },
 'fukuoka-2025-general-keitobetsu-physics':{
  'major-question-01':{
   title:'〔Ⅰ〕(10)の解説は記号を確認中です',
   message:'元解説のうなりの周期の式で、元の音の振動数とうなりの振動数が混同されています。該当式は原本照合・修正が完了するまで正式な教材として使用しないでください。',
  },
  'major-question-03':{
   title:'〔Ⅲ〕(6)の速度の大きさは条件を確認中です',
   message:'問題に記された反発係数の範囲と、解説の速度の「大きさ」の符号に不整合があります。(6)の採点と(7)〜(8)で使う符号の説明は、原本照合・修正が完了するまで確認用として扱ってください。',
  },
 },
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
/** @type {Record<string, {title: string, message: string}>} */
export const analysisReviewNotices={
 'international-health-welfare-2025-general-mathematics':{
  title:'分析の前提となる問題・解説を照合中です',
  message:'第1問の対数・双曲線、第2問の点の定義、第3問の確率の定義と解答欄、第4問の積分に元HTMLの不整合があります。以下の分析は元データのレビュー用表示です。目標点や選択順序を学習・出願判断の根拠として使わず、問題の修復後に評価を再確認してください。',
 },
};
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function withReviewNotice(html,packageId,majorId){
 const notice=reviewNotices[packageId]?.[majorId];
 if(!notice)return html;
 if(!html.includes('</h2>'))throw Error('Review notice needs a major heading');
 return html.replace('</h2>',`</h2><aside class="past-exam-source-review" role="note" data-source-review="required"><strong>${escape(notice.title)}</strong><p>${escape(notice.message)}</p></aside>`);
}
