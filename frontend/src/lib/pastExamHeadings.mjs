// Reader metadata supplies the heading when a source page-break loses it.
// Do not derive a heading from nearby prose or reintroduce redundant kickers.
export function ensureMajorQuestionHeading(fragment,label){
 if(/<h2\b/i.test(fragment))return fragment;
 if(typeof label!=='string'||!label.trim())throw Error('A verified major-question label is required');
 if(!/^<article\b[^>]*\bdata-major-question-id=/i.test(fragment))throw Error('A major-question article is required');
 const escaped=label.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
 return fragment.replace(/^(<article\b[^>]*>)/i,`$1<h2>${escaped}</h2>`);
}
