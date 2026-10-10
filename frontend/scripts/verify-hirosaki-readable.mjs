import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { parse } from 'parse5';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright-core');
let [url,out]=process.argv.slice(2);
assert.ok(url&&out,'Use URL and absolute evidence directory');
let server;
if(url==='local'){
 const root=fileURLToPath(new URL('../dist/',import.meta.url));
 server=http.createServer((req,res)=>{let file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!file.startsWith(root)||!fs.existsSync(file)){res.statusCode=404;return res.end('404');}const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2'};res.setHeader('Content-Type',types[path.extname(file)]??'application/octet-stream');fs.createReadStream(file).pipe(res);});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));url=`http://127.0.0.1:${server.address().port}/information-hirosaki/`;
}
fs.mkdirSync(out,{recursive:true});
const read=f=>JSON.parse(fs.readFileSync(new URL(f,import.meta.url),'utf8'));
const data=read('../src/data/universityAdmissions/hirosaki.json');
const copy=read('../src/data/hirosakiReaderCopy.json');
const overview=read('../src/data/hirosakiUniversityOverview.json');
const mappingDocument=JSON.parse(fs.readFileSync('C:/---hp-seo/reports/university-admissions/hirosaki/editorial/fact-display-map-v2.json','utf8'));
const mapping=mappingDocument.mapping;
const clean=s=>s.replace(/\s+/gu,'').trim();
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=(n,p,result=[])=>{if(p(n))result.push(n);for(const c of n.childNodes??[])all(c,p,result);return result;};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const evidence={url,checkedAt:new Date().toISOString(),passed:false,views:[],screenshots:[]};
let browser;
try{
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(url,{waitUntil:'networkidle'});assert.equal(response.status(),200);
 const html=await page.content();fs.writeFileSync(path.join(out,'actual-page.html'),html);evidence.htmlSha256=crypto.createHash('sha256').update(html).digest('hex');
 const dom=parse(html);const wrapper=all(dom,n=>attr(n,'data-admissions-presentation')==='hirosaki-readable-v1');assert.equal(wrapper.length,1);
 const ids=mapping.map(m=>m.origin);assert.equal(new Set(ids).size,ids.length);
 const expectedIds=[];
 for(const s of data.schemes){for(const [k,f] of [['schedule','scheduleRows'],['exam','examRows'],['venue','venueRows'],['note','notes']])s[f].forEach((r,i)=>expectedIds.push(`${s.id}/${k}/${i}`));}data.coverageNotes.forEach((n,i)=>expectedIds.push('coverage/'+i));
 assert.deepEqual(new Set(ids),new Set(expectedIds),'Every original fact, note and coverage item needs a display mapping');
 for(const m of mapping)for(const id of m.locations)assert.equal(all(dom,n=>attr(n,'data-hirosaki-fact')===id).length,1,`${m.origin}: missing ${id}`);
 assert.equal(mappingDocument.additionalFacts.length,4);
 for(const addition of mappingDocument.additionalFacts){
  const nodes=all(dom,n=>attr(n,'data-hirosaki-fact')===addition.id);assert.equal(nodes.length,1,addition.id);
  const value=all(nodes[0],n=>attr(n,'data-hirosaki-value')!==undefined);assert.equal(clean(text(value[0])),clean(addition.text));
  for(let parent=nodes[0].parentNode;parent;parent=parent.parentNode)assert.notEqual(parent.tagName,'details','Mandatory conditions must remain visible');
 }
 let checked=0;
 for(const g of copy.groups)for(const r of [...g.dates,...g.eligibility,...g.facts,...g.venues,...g.notes]){
  const nodes=all(dom,n=>attr(n,'data-hirosaki-fact')===r.id);assert.equal(nodes.length,1);
  const value=all(nodes[0],n=>attr(n,'data-hirosaki-value')!==undefined);assert.equal(value.length,1);
  assert.equal(clean(text(value[0])),clean(r.text),r.id);assert.deepEqual(JSON.parse(attr(nodes[0],'data-admission-source-ids')),r.sourceIds);assert.equal(attr(nodes[0],'data-admission-status'),r.status);checked++;
 }
 for(const r of [copy.capacity,copy.publication,copy.scope,copy.regional])assert.equal(clean(text(all(dom,n=>attr(n,'data-hirosaki-fact')===r.id)[0])).includes(clean(r.text)),true);
 const allText=clean(text(dom));
 for(const s of [...copy.withdrawal,copy.withdrawalNote,...copy.groups[0].qualificationChoices,...overview.access,...copy.metadata.keyPoints])assert.ok(allText.includes(clean(s)),s);
 for(const g of copy.groups){
  const table=all(dom,n=>attr(n,'data-hirosaki-table')===g.id+'-scores')[0],rows=all(table,n=>n.tagName==='tbody')[0].childNodes.filter(n=>n.tagName==='tr');
  const cells=rows.map(r=>r.childNodes.filter(n=>['td','th'].includes(n.tagName)).map(text));
  const expected=g.id==='general'?[200,100,200,300,200,50]:[200,100,200,200,200,50];
  assert.deepEqual(cells.slice(0,6).map(c=>Number(c[1].replace(/[,点]/g,''))),expected);
  assert.equal(expected.reduce((a,b)=>a+b,0),g.scores.commonTotal);
  assert.equal(cells.at(-1)[1],g.scores.total.toLocaleString('ja-JP')+'点');
  assert.equal(data.schemes.find(s=>s.id===g.schemeIds[0]).examRows[6].value.includes(g.scores.commonTotal.toLocaleString('ja-JP')),true);
 }
 assert.ok(allText.includes('1,650点')&&allText.includes('1,350点')&&allText.includes('段階評価'));
 assert.doesNotMatch(text(wrapper[0]),/確定済みとして扱って|本表の掲載対象|推測して|転用しない|確認できる日程|原典の記載を確認/);
 assert.equal(all(wrapper[0],n=>n.tagName==='table').some(t=>all(t,n=>n.tagName==='a'&&/^https?:/.test(attr(n,'href')??'')).length),false,'No inline source links');
 const headings=all(dom,n=>n.tagName==='h2').map(text);assert.ok(headings.indexOf('2027年度の入試情報')<headings.indexOf('大学基本情報'));
 assert.ok(allText.includes('47人')&&allText.includes('65人')&&allText.includes('58.9%')&&allText.includes('30.4%')&&allText.includes('10.7%'));
 assert.equal(all(dom,n=>attr(n,'data-hirosaki-table')!==undefined).length,7);
 for(const view of [{name:'pc',width:1440,height:1000},{name:'390',width:390,height:844},{name:'320',width:320,height:844}]){
  await page.setViewportSize(view);await page.goto(url,{waitUntil:'networkidle'});
  const dimensions=await page.evaluate(()=>({width:innerWidth,documentWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('.hirosaki-readable th,.hirosaki-readable td,.hirosaki-readable dd,.hirosaki-readable p')].filter(e=>e.scrollWidth>e.clientWidth+1).map(e=>({text:e.textContent.slice(0,80),client:e.clientWidth,scroll:e.scrollWidth}))}));
  assert.ok(dimensions.documentWidth<=view.width,view.name+' document overflow');assert.deepEqual(dimensions.overflow,[]);
  const sourceHints=page.locator('.hirosaki-readable .admission-source-hint');await sourceHints.first().click();
  assert.equal(await page.locator('#hirosaki-admission-sources').isVisible(),true,'Source hint must reveal sources');
  await page.locator('[data-hirosaki-overview] details summary').click();assert.equal(await page.locator('[data-hirosaki-overview] details').getAttribute('open'),'');
  const tables=page.locator('[data-hirosaki-table]');
  for(let i=0;i<await tables.count();i++){
   const table=tables.nth(i),id=await table.getAttribute('data-hirosaki-table');
   const file=path.join(out,`${view.name}-${id}.png`);await table.screenshot({path:file,style:'header,.mobile-fixed-nav-wrap,.skip-link { visibility: hidden !important; }'});evidence.screenshots.push(file);
   const bounds=await table.boundingBox(),top=bounds.y+await page.evaluate(()=>scrollY);
   for(let y=0;y<bounds.height;y+=view.height-160){await page.evaluate(v=>scrollTo(0,v),top+y-110);const slice=path.join(out,`${view.name}-${id}-view-${Math.floor(y/(view.height-160))}.png`);await page.screenshot({path:slice});evidence.screenshots.push(slice);}
  }
  for(const [label,selector] of [['top','.article-keypoints'],['source','#hirosaki-admission-sources'],['university-overview','section.hirosaki-readable[data-hirosaki-overview] #所在地'],['overview-source','section.hirosaki-readable[data-hirosaki-overview] details'],['region','#hirosaki-regional-obligations']]){await page.locator(selector).first().scrollIntoViewIfNeeded();const file=path.join(out,`${view.name}-${label}.png`);await page.screenshot({path:file});evidence.screenshots.push(file);}
  for(const fact of mappingDocument.additionalFacts){const file=path.join(out,`${view.name}-${fact.id}.png`);await page.locator(`[data-hirosaki-fact="${fact.id}"]`).screenshot({path:file,style:'header,.mobile-fixed-nav-wrap { visibility: hidden !important; }'});evidence.screenshots.push(file);}
  const tocLink=page.locator('.article-toc a[href="#所在地"]');await tocLink.click();assert.equal(await page.evaluate(()=>location.hash),'#'+encodeURIComponent('所在地'));
  await page.locator('a[href="#admission-scheme-general-aomori"]').click();const anchor=await page.locator('#admission-scheme-general-aomori').boundingBox();assert.ok(anchor.y>=80&&anchor.y<view.height);
  // Every TOC and frame link must resolve to a visible document target.
  const targets=await page.locator('.article-toc a,.hirosaki-readable a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
  for(const target of targets.filter(t=>t?.startsWith('#')&&t.length>1))assert.equal(await page.locator(`[id="${decodeURIComponent(target.slice(1))}"]`).count(),1,target);
  evidence.views.push({...view,...dimensions,tableCount:await tables.count(),sourceUI:true,tocClicked:true,frameTargetY:anchor.y,checkedDisplayRecords:checked,mappedFacts:mapping.length,newFactsChecked:mappingDocument.additionalFacts.length});
 }
 assert.deepEqual(errors,[]);evidence.passed=true;
}finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());evidence.screenshots=evidence.screenshots.map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}));fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(evidence,null,2)+'\n');}
console.log(JSON.stringify({passed:evidence.passed,views:evidence.views,screenshots:evidence.screenshots.length}));
