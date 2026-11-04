export function initOsakaikaTabs(root:HTMLElement) {
 if(root.classList.contains('is-enhanced'))return;
 const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-oat-group-tab]')];
 const routeGroup:Record<string,string>={'general-early':'general','general-late':'general','common-test':'common',shisei:'shisei',recommendation:'recommendation',designated:'recommendation','regional-osaka':'regional'};
 const remembered:Record<string,string>={general:'general-early',common:'common-test',shisei:'shisei',recommendation:'recommendation',regional:'regional-osaka'};
 let active='general-early';
 function updateHeaderOffset(){
  const fixed=[...document.querySelectorAll<HTMLElement>('.site-header,.mega-nav,.mobile-fixed-nav-wrap')].filter(el=>{
   const style=getComputedStyle(el);return style.display!=='none'&&['sticky','fixed'].includes(style.position);
  });
  const height=Math.max(0,...fixed.map(el=>el.getBoundingClientRect().height));
  root.style.setProperty('--oat-header-offset',`${height}px`);
 }
 function select(id:string,scroll=false,historyMode='push') {
  const group=routeGroup[id];if(!group)return;
  active=id;remembered[group]=id;
  root.querySelectorAll<HTMLElement>('[data-oat-group]').forEach(el=>el.hidden=el.dataset.oatGroup!==group);
  root.querySelectorAll<HTMLElement>('[data-oat-route]').forEach(el=>el.hidden=el.dataset.oatRoute!==id);
  tabs.forEach(t=>{const chosen=t.dataset.oatGroupTab===group;t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1;});
  root.querySelectorAll('[data-oat-route-tab]').forEach(t=>t.setAttribute('aria-pressed',String(t.getAttribute('data-oat-route-tab')===id)));
  const live=root.querySelector('[data-oat-live]');if(live)live.textContent=`${root.querySelector(`#oat-heading-${id}`)?.textContent}を表示しています。`;
  if(historyMode==='push'&&location.hash!==`#osakaika-${id}`)history.pushState(null,'',`#osakaika-${id}`);
  if(scroll){
   const anchor=root.querySelector<HTMLElement>('.oat-tabs-wrap')!;
   const offset=parseFloat(root.style.getPropertyValue('--oat-header-offset'))||0;
   window.scrollTo({top:Math.max(0,window.scrollY+anchor.getBoundingClientRect().top-offset),behavior:'instant'});
  }
 }
 function openDialog(id:string){
  const dialog=root.querySelector<HTMLDialogElement>(`#oat-dialog-${id}`);
  if(dialog&&!dialog.open)dialog.showModal();
 }
 const dialogs:Record<string,string>={overview:'overview',procedures:'procedures',venues:'venues',fees:'fees',basic:'basic'};
 function followHash(){
  const id=location.hash.replace('#osakaika-','');
  if(routeGroup[id])select(id,false,'none');
  else if(dialogs[id])openDialog(dialogs[id]);
 }
 root.addEventListener('click',event=>{
  const target=(event.target as Element).closest<HTMLElement>('button,a');if(!target)return;
  if(target.dataset.oatGroupTab){select(remembered[target.dataset.oatGroupTab],true);return;}
  if(target.dataset.oatRouteTab){select(target.dataset.oatRouteTab,true);return;}
  if(target.dataset.oatOpen){openDialog(target.dataset.oatOpen);return;}
  if(target.hasAttribute('data-oat-close')){target.closest('dialog')?.close();return;}
  const href=target.getAttribute('href')||'';
  if(href.startsWith('#osakaika-')){
   const id=href.slice('#osakaika-'.length);
   if(routeGroup[id]){event.preventDefault();target.closest('dialog')?.close();select(id,true);root.querySelector<HTMLElement>(`#oat-heading-${id}`)?.focus({preventScroll:true});}
   else if(dialogs[id]){event.preventDefault();openDialog(dialogs[id]);}
   else if(id==='common-subjects'){event.preventDefault();select(active==='shisei'?'shisei':'common-test',true);const detail=root.querySelector<HTMLDetailsElement>(`#osakaika-${active} .oat-exams details`);if(detail)detail.open=true;}
  }
 });
 root.addEventListener('keydown',event=>{
  const tab=(event.target as Element).closest<HTMLButtonElement>('[data-oat-group-tab]');if(!tab)return;
  const i=tabs.indexOf(tab);let n=i;
  if(event.key==='ArrowRight')n=(i+1)%tabs.length;
  else if(event.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;
  else if(event.key==='Home')n=0;
  else if(event.key==='End')n=tabs.length-1;
  else return;
  event.preventDefault();select(remembered[tabs[n].dataset.oatGroupTab!],false);tabs[n].focus({preventScroll:true});
 });
 root.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{
  const r=dialog.getBoundingClientRect();
  if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();
 }));
 let openedForPrint:HTMLDetailsElement[]=[];
 window.addEventListener('beforeprint',()=>{
  openedForPrint=[...root.querySelectorAll<HTMLDetailsElement>(`#osakaika-${active} details:not([open]):not(.admission-sources)`)];openedForPrint.forEach(d=>d.open=true);
 });
 window.addEventListener('afterprint',()=>openedForPrint.forEach(d=>d.open=false));
 updateHeaderOffset();window.addEventListener('resize',updateHeaderOffset);
 root.classList.add('is-enhanced');select('general-early',false,'none');followHash();window.addEventListener('hashchange',followHash);window.addEventListener('popstate',followHash);
}
function init(){document.querySelectorAll<HTMLElement>('[data-osakaika-tabs]').forEach(initOsakaikaTabs);}
init();document.addEventListener('astro:page-load',init);
