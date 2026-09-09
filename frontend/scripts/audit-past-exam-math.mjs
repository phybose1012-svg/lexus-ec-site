import fs from 'node:fs';
import vm from 'node:vm';
const ctx={};vm.runInNewContext(fs.readFileSync('public/assets/vendor/katex/katex.min.js','utf8'),ctx);
const decode=s=>s.replace(/&#(x[0-9a-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replaceAll('&quot;','"').replaceAll('&apos;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
let targets=0;const issues=[];
for(const role of ['Questions','Answers'])for(const file of fs.readdirSync(`src/data/generated/pastExam${role}`).filter(f=>f.endsWith('.json'))){
 const p=JSON.parse(fs.readFileSync(`src/data/generated/pastExam${role}/${file}`,'utf8'));
 const groups=p.document.questions??p.document.majorQuestions;
 for(const group of groups)for(const match of group.html.matchAll(/<[^>]+data-katex="([^"]*)"[^>]*>/g)){
  const latex=decode(match[1]);targets++;
  try{ctx.katex.renderToString(latex,{displayMode:match[0].includes('data-display-mode="true"'),throwOnError:true,strict:'ignore',trust:false});}
  catch(e){issues.push({packageId:p.packageId,role:role.toLowerCase(),major:group.id,latex,error:e.message});}
 }
}
fs.writeFileSync('src/data/pastExamBatch/math-audit.json',JSON.stringify({targets,issues},null,2)+'\n');
console.log(`${targets} TeX targets; ${issues.length} rendering errors`);
for(const item of issues.slice(0,45))console.log(`${item.packageId} ${item.major}: ${item.error}`);
