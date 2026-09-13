import fs from 'node:fs';
import path from 'node:path';
// Two source generator layouts; identity and contents are still checked by extractAnalysis.
export function analysisHtmlLocation(directory){
 const candidates=['preview-html/public-preview/index.html','generated/public-preview/index.html'];
 return candidates.find(relative=>fs.existsSync(path.join(directory,relative)))??candidates[0];
}
