// Small, independently checked additions to an imported learner edition.
// Never mutate its snapshot or silently apply additions after an upstream repair.
export function applyAnswerSupplement(snapshot, supplement) {
  const editorial=structuredClone(snapshot.editorial);
  if(!supplement)return editorial;
  if(supplement.schemaVersion!=='lexus-answer-supplement.v1'||supplement.packageId!==snapshot.question.packageId||supplement.sourceSha256!==snapshot.sha256||supplement.contentProvenance!=='original_editorial'||supplement.restrictedSourceCopied!==false)
    throw Error('Answer supplement identity, provenance or source hash mismatch');
  if(!Array.isArray(supplement.operations)||!supplement.operations.length)throw Error('Empty answer supplement');
  for(const op of supplement.operations){
    const replaceTable=op.type==='replace-crop-with-table';
    const validAnchor=replaceTable?op.anchor?.type==='crop'&&typeof op.anchor.asset_id==='string'&&op.anchor.asset_id.length>0:['prose','formula'].includes(op.anchor?.type);
    if((op.type!=='insert-after'&&!replaceTable)||op.expectedMatches!==1||!op.anchor?.major_question_id||!validAnchor||!Array.isArray(op.blocks)||!op.blocks.length|| (replaceTable&&(op.blocks.length!==1||op.blocks[0].type!=='table')))
      throw Error('Unsupported answer supplement operation');
    const matches=[];
    for(const p of editorial.pages)for(let i=0;i<p.blocks.length;i++){
      if(Object.entries(op.anchor).every(([k,v])=>p.blocks[i][k]===v))matches.push([p,i]);
    }
    if(matches.length!==1)throw Error(`Answer supplement expected one anchor, got ${matches.length}`);
    for(const block of op.blocks){
      if(!['table','prose'].includes(block.type)||block.major_question_id!==op.anchor.major_question_id)throw Error('Supplement must stay in the same major question');
      if(block.type==='prose'&&typeof block.text!=='string')throw Error('Supplement prose requires text');
      if(block.type==='table'){
        if(typeof block.caption!=='string'||!block.caption||!Array.isArray(block.headers)||!block.headers.length||!Array.isArray(block.rows)||!block.rows.length||block.rows.some(r=>!Array.isArray(r)||r.length!==block.headers.length)||[...block.headers,...block.rows.flat()].some(v=>typeof v!=='string'))throw Error('Malformed supplemental table');
        if(editorial.pages.some(p=>p.blocks.some(b=>b.type==='table'&&b.caption===block.caption)))throw Error('Supplemental table is already present; review upstream repair');
      }
    }
    matches[0][0].blocks.splice(matches[0][1]+(replaceTable?0:1),replaceTable?1:0,...structuredClone(op.blocks));
  }
  return editorial;
}
