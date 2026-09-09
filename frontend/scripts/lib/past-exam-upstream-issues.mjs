// Upstream packages use both `items` and `issues`; neither may be silently lost.
export function openUpstreamIssues(document){
 const entries=Array.isArray(document)?document:[...(Array.isArray(document.items)?document.items:[]),...(Array.isArray(document.issues)?document.issues:[])];
 const seen=new Set();
 return entries.filter(issue=>{
  if(!issue||typeof issue!=='object'||['resolved','closed','fixed'].includes(issue.status))return false;
  const key=issue.id||JSON.stringify(issue);if(seen.has(key))return false;seen.add(key);return true;
 });
}
export const upstreamIssueText=issue=>issue.needed_action||issue.message||issue.description||issue.title||JSON.stringify(issue);
