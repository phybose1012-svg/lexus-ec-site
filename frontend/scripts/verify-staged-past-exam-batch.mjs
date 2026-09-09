import fs from 'node:fs';
const origin='https://staging.lexus-ec.pages.dev';
const catalog=JSON.parse(fs.readFileSync('src/data/pastExamBatch/catalog.json','utf8'));
let checked=0;const failures=[];
for(const c of catalog)for(const role of ['questions','answers','analysis']){
 const route=`/past-exam-library/${c.university}/${c.year}/${c.segment}/${role}/`;
 try {
  const response=await fetch(origin+route,{signal:AbortSignal.timeout(20000)});
  const html=await response.text();
  if(response.status!==200)throw new Error(`HTTP ${response.status}`);
  if((html.match(/<h1\b/g)||[]).length!==1)throw new Error('Expected one h1');
  if(!/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/.test(html))throw new Error('Missing noindex');
  if(!html.includes(`https://lexus-ec.com${route}`))throw new Error('Wrong canonical URL');
 }catch(error){failures.push({route,error:error.message});}
 checked++;if(checked%30===0)console.log(`Verified ${checked} routes; failures ${failures.length}`);
}
const report={origin,checked,failures};
fs.mkdirSync('../qa/past-exam-batch',{recursive:true});
fs.writeFileSync('../qa/past-exam-batch/staging-http.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
