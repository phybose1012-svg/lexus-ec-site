// Shared document/typography only; each package owns its physical geometry.
import fs from 'node:fs';
import {createFigureHandoff} from './past-exam-figure-handoff.mjs';
export const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const mi=v=>`<tspan class="mi">${esc(v)}</tspan>`;
export const rm=v=>`<tspan class="rm">${esc(v)}</tspan>`;
export const sub=v=>`<tspan class="rm" font-size="70%" baseline-shift="sub">${esc(v)}</tspan>`;
export const math=(x,y,parts,extra='')=>`<text x="${x}" y="${y}" class="math" ${extra}>${parts.join('')}</text>`;
export const text=(x,y,value,extra='')=>`<text x="${x}" y="${y}" ${extra}>${esc(value)}</text>`;
export const line=(x1,y1,x2,y2,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra}/>`;
export const pointsPath=pts=>pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(3)},${p[1].toFixed(3)}`).join(' ');
export const dot=(x,y)=>`<circle cx="${x}" cy="${y}" r="3.5" fill="#18334c" stroke="white" stroke-width="1"/>`;

export function createSvgPackage(packageId,metaUrl){
 if(!/^[a-z0-9-]+$/.test(packageId))throw Error('Invalid package ID');
 const frontend=new URL('../',metaUrl);
 const output=new URL(`public/assets/past-exams/${packageId}/figures/`,frontend);
 const handoff=createFigureHandoff(packageId,metaUrl),items=[];
 fs.mkdirSync(output,{recursive:true});
 const font=name=>fs.readFileSync(new URL(`public/assets/vendor/katex/fonts/${name}.woff2`,frontend)).toString('base64');
 const fonts=`@font-face{font-family:'KaTeX_Main';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${font('KaTeX_Main-Regular')}) format('woff2')}@font-face{font-family:'KaTeX_Math';font-style:italic;font-weight:400;src:url(data:font/woff2;base64,${font('KaTeX_Math-Italic')}) format('woff2')}`;
 return {
  add(id,width,height,alt,caption,body){
   if(!/^[a-z0-9-]+$/.test(id)||items.some(i=>i.id===id))throw Error('Invalid or duplicate figure ID');
   const kept=handoff.keep(id);
   items.push({id,src:`/assets/past-exams/${packageId}/figures/${id}.svg`,width:kept?.width??width,height:kept?.height??height,alt,caption});
   if(kept)return;
   const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title"><title id="title">${esc(alt)}</title><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#18334c"/></marker></defs><style>${fonts}text{font-family:'Yu Gothic','Meiryo',sans-serif;font-size:18px;fill:#18334c;stroke:none}.math{font-family:'KaTeX_Main',serif;font-size:25px}.math .mi{font-family:'KaTeX_Math',serif;font-style:italic}.math .rm{font-family:'KaTeX_Main',serif;font-style:normal}line,path,circle,ellipse,rect{vector-effect:non-scaling-stroke}.guide{stroke:#92a5b5;stroke-dasharray:5 5;stroke-width:1.3}.accent{stroke:#b28736;stroke-width:2.4}.axis{stroke-width:1.3;stroke:#768f9f}</style><rect width="100%" height="100%" fill="white"/><g fill="none" stroke="#18334c" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
   fs.writeFileSync(new URL(`${id}.svg`,output),svg);
  },
  save(notes){
   const manifest={schemaVersion:'lexus-past-exam-figures.v1',packageId,contentProvenance:'original_editorial',restrictedSourceCopied:false,review:{needsHumanReview:true,notes},items};
   fs.writeFileSync(new URL(`src/data/pastExamFigures/${packageId}.json`,frontend),JSON.stringify(manifest,null,2)+'\n');
   handoff.report();return manifest;
  }
 };
}
