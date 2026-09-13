// Manual evidence review can find semantic defects beyond numeric validation.
// A changed source never clears a hold automatically: it requires re-review.
export function targetReviewHold(registry,id,sha256){
 const hold=registry[id];
 if(!hold)return null;
 if(!/^[a-f0-9]{64}$/.test(hold.analysisSha256)||typeof hold.reason!=='string'||!hold.reason.trim()||!hold.handoff?.startsWith('docs/handoffs/'))throw Error('Invalid target review hold');
 return `${hold.reason}${sha256===hold.analysisSha256?'':' 元データの更新を検出しました。修復内容の再確認まで保留を維持します。'} (${hold.handoff})`;
}
