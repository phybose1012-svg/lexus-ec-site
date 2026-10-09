import fs from 'node:fs/promises';
import path from 'node:path';

const options = {};
for (let i = 2; i < process.argv.length; i += 2) options[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
if (!/^[a-f0-9]{40}$/i.test(options.commit || '') || !['staging', 'main'].includes(options.branch) || !options.output) {
  throw new Error('Use --commit FULL_SHA --branch staging|main --output EVIDENCE.json');
}
const endpoint = `https://api.github.com/repos/phybose1012-svg/lexus-ec-site/commits/${options.commit}/check-runs`;
const response = await fetch(endpoint, {
  signal: AbortSignal.timeout(30000),
  headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Lexus-university-admissions-deployment-check/1.0' },
});
if (!response.ok) throw new Error(`GitHub deployment checks HTTP ${response.status}`);
const document = await response.json();
const runs = document.check_runs.filter(run => run.app?.slug === 'cloudflare-workers-and-pages');
const latest = runs.sort((a, b) => Date.parse(b.started_at || b.created_at || 0) - Date.parse(a.started_at || a.created_at || 0))[0];
const actualBranch = latest?.check_suite?.head_branch ?? null;
const branchMatches = actualBranch === null || actualBranch === options.branch;
const passed = Boolean(latest && latest.status === 'completed' && latest.conclusion === 'success' && branchMatches);
const result = {
  checkedAt: new Date().toISOString(), commit: options.commit, branch: options.branch, actualBranch,
  passed, status: passed ? 'deployed' : latest?.status === 'completed' ? 'failed' : 'pending',
  apiUrl: endpoint,
  checkRuns: runs.map(run => ({
    name: run.name, status: run.status, conclusion: run.conclusion, startedAt: run.started_at,
    completedAt: run.completed_at, detailsUrl: run.details_url, headSha: run.head_sha,
    branch: run.check_suite?.head_branch ?? null, app: run.app?.slug,
    output: { title: run.output?.title, summary: run.output?.summary },
  })),
};
const outputFile = path.resolve(options.output);
await fs.mkdir(path.dirname(outputFile), { recursive: true });
await fs.writeFile(outputFile, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
process.exitCode = passed ? 0 : result.status === 'failed' ? 1 : 2;
