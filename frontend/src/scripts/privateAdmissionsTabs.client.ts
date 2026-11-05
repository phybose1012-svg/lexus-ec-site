export function initPrivateAdmissionsTabs(root:HTMLElement){
 if(root.classList.contains('is-enhanced'))return;
 const slug=root.dataset.universitySlug!,prefix='#'+slug+'-';
 const tabs=[...root.querySelectorAll<HTMLButtonElement>('[data-pat-group-tab]')];
 const groups=[...root.querySelectorAll<HTMLElement>('[data-pat-group]')];
 const routes=[...root.querySelectorAll<HTMLElement>('[data-pat-route]')];
 const routeGroup=new Map(routes.map(r=>[r.dataset.patRoute!,r.closest<HTMLElement>('[data-pat-group]')!.dataset.patGroup!]));
 const remembered=new Map(groups.map(g=>[g.dataset.patGroup!,g.querySelector<HTMLElement>('[data-pat-route]')!.dataset.patRoute!]));
 let active=routes[0].dataset.patRoute!;
 function updateHeaderOffset(){
  const fixed=[...document.querySelectorAll<HTMLElement>('.site-header,.mega-nav,.mobile-fixed-nav-wrap')].filter(el=>{const style=getComputedStyle(el);return style.display!=='none'&&['sticky','fixed'].includes(style.position);});
  root.style.setProperty('--pat-header-offset',Math.max(0,...fixed.map(el=>el.getBoundingClientRect().height))+'px');
 }
 function select(id:string,scroll=false,historyMode='push'){
  const group=routeGroup.get(id);if(!group)return;
  active=id;remembered.set(group,id);
  groups.forEach(g=>g.hidden=g.dataset.patGroup!==group);
  routes.forEach(r=>r.hidden=r.dataset.patRoute!==id);
  tabs.forEach(t=>{const chosen=t.dataset.patGroupTab===group;t.setAttribute('aria-selected',String(chosen));t.tabIndex=chosen?0:-1;});
  root.querySelectorAll('[data-pat-route-tab]').forEach(t=>t.setAttribute('aria-pressed',String(t.getAttribute('data-pat-route-tab')===id)));
  root.querySelectorAll<HTMLSelectElement>('[data-pat-route-select]').forEach(s=>{if([...s.options].some(o=>o.value===id))s.value=id;});
  const live=root.querySelector('[data-pat-live]');if(live)live.textContent=root.querySelector('#pat-heading-'+id)?.textContent+'を表示しています。';
  if(historyMode==='push'&&location.hash!==prefix+id)history.pushState(null,'',prefix+id);
  if(scroll){const anchor=root.querySelector<HTMLElement>('.pat-tabs-wrap')!;const offset=Number(root.style.getPropertyValue('--pat-header-offset').replace('px',''))||0;window.scrollTo({top:Math.max(0,scrollY+anchor.getBoundingClientRect().top-offset),behavior:'instant'});}
 }
 function openDialog(id:string){const d=root.querySelector<HTMLDialogElement>('#pat-dialog-'+id);if(d&&!d.open)d.showModal();}
 function followHash(){const id=location.hash.slice(prefix.length);if(location.hash.startsWith(prefix)&&routeGroup.has(id))select(id,false,'none');}
 root.addEventListener('click',event=>{
  const target=(event.target as Element).closest<HTMLElement>('button,a');if(!target)return;
  if(target.dataset.patGroupTab){select(remembered.get(target.dataset.patGroupTab)!,true);return;}
  if(target.dataset.patRouteTab){select(target.dataset.patRouteTab,true);return;}
  if(target.dataset.patOpen){openDialog(target.dataset.patOpen);return;}
  if(target.dataset.patSwitch){target.closest('dialog')?.close();openDialog(target.dataset.patSwitch);return;}
  if(target.hasAttribute('data-pat-close')){target.closest('dialog')?.close();return;}
  const href=target.getAttribute('href')||'';
  if(href.startsWith(prefix)&&routeGroup.has(href.slice(prefix.length))){event.preventDefault();target.closest('dialog')?.close();select(href.slice(prefix.length),true);root.querySelector<HTMLElement>('#pat-heading-'+active)?.focus({preventScroll:true});}
  else if(href.startsWith('#pat-full-')){const node=root.querySelector<HTMLElement>('#'+CSS.escape(href.slice(1)));if(node){event.preventDefault();openDialog('full');node.scrollIntoView({block:'start'});}}
 });
 root.addEventListener('change',event=>{const target=event.target;if(target instanceof HTMLSelectElement&&target.hasAttribute('data-pat-route-select'))select(target.value,true);});
 root.addEventListener('keydown',event=>{
  const tab=(event.target as Element).closest<HTMLButtonElement>('[data-pat-group-tab]');if(!tab)return;
  const i=tabs.indexOf(tab);let n=i;
  if(event.key==='ArrowRight')n=(i+1)%tabs.length;else if(event.key==='ArrowLeft')n=(i-1+tabs.length)%tabs.length;else if(event.key==='Home')n=0;else if(event.key==='End')n=tabs.length-1;else return;
  event.preventDefault();select(remembered.get(tabs[n].dataset.patGroupTab!)!,false);tabs[n].focus({preventScroll:true});
 });
 root.querySelectorAll<HTMLDialogElement>('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();}));
 let opened:HTMLDetailsElement[]=[];
 window.addEventListener('beforeprint',()=>{opened=[...root.querySelectorAll<HTMLDetailsElement>('#'+slug+'-'+active+' details:not([open])')];opened.forEach(d=>d.open=true);});
 window.addEventListener('afterprint',()=>opened.forEach(d=>d.open=false));
 updateHeaderOffset();window.addEventListener('resize',updateHeaderOffset);
 root.classList.add('is-enhanced');select(active,false,'none');followHash();window.addEventListener('hashchange',followHash);window.addEventListener('popstate',followHash);
}
function init(){document.querySelectorAll<HTMLElement>('[data-private-admissions-tabs]').forEach(initPrivateAdmissionsTabs);}
init();document.addEventListener('astro:page-load',init);

