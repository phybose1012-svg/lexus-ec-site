import fs from 'node:fs';
import path from 'node:path';
import {openUpstreamIssues,upstreamIssueText} from './lib/past-exam-upstream-issues.mjs';
if(!process.argv[2])throw Error('Provide read-only source repository');
const root=path.resolve(process.argv[2]),ledgerFile='src/data/pastExamBatch/status.json';
const ledger=JSON.parse(fs.readFileSync(ledgerFile,'utf8'));
let total=0;
const sections=[];
for(const entry of ledger.packages){
 const file=path.resolve(root,entry.directory,'issues.json');
 if(!file.startsWith(root+path.sep))throw Error('Source path outside repository');
 const issues=fs.existsSync(file)?openUpstreamIssues(JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''))):[];
 entry.upstreamOpenIssues=issues;total+=issues.length;
 if(issues.length)sections.push(`## ${entry.id}\n\n元データ: \`${entry.directory}/issues.json\`\n\n${issues.map(i=>`- **${i.id??'source-issue'}**: ${upstreamIssueText(i)}`).join('\n')}`);
}
fs.writeFileSync(ledgerFile,JSON.stringify(ledger,null,2)+'\n');
fs.writeFileSync('../docs/handoffs/past-exam-batch/upstream-issues.md',`# 元データの未解決事項（同期記録）\n\n新規取込${ledger.packages.length}パッケージに${total}件。元のissues.jsonのitems/ issues両形式を読み取った編集メモであり、ここで新たに検証・解決したものではありません。権利・仮配点・時間配分・科目担当レビューも含まれます。元ソースは変更していません。各担当は大学別依頼と合わせて参照してください。\n\n${sections.join('\n\n')}\n`);
console.log(`${ledger.packages.length} packages; ${total} upstream open issues recorded`);
