/** @param {{deploymentBranch: string, productionBranch: string, noindex?: boolean}} options */
export function robotsForPage({ deploymentBranch, productionBranch, noindex = false }) {
  // Preview protection always wins, even when an individual page is approved.
  if (deploymentBranch && deploymentBranch !== productionBranch) return "noindex,nofollow,max-image-preview:large";
  return noindex ? "noindex,follow,max-image-preview:large" : "max-image-preview:large";
}
