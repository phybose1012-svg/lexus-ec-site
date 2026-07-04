import { readFileSync } from "node:fs";
import { classifyArticlePost, getTaxonomyStats } from "../src/data/articleTaxonomy.js";

const generatedFiles = [
  "admissionInfoPosts",
  "universityStrategyPosts",
  "interviewPrepPosts",
  "voiceInterviewPosts",
];

const allPosts = generatedFiles.flatMap((name) =>
  JSON.parse(readFileSync(new URL(`../src/data/generated/${name}.json`, import.meta.url), "utf8")),
);

const classified = allPosts.map((post) => ({
  path: post.path,
  title: post.displayTitle || post.title,
  taxonomy: classifyArticlePost(post),
}));

const invalid = classified.filter(({ taxonomy }) => {
  const facets = taxonomy.facets;
  return (
    !taxonomy.primaryCategory ||
    taxonomy.primaryCategoryId === "uncategorized" ||
    !taxonomy.subCategory ||
    !facets.year ||
    facets.year === "年度未設定" ||
    !facets.universityType ||
    !facets.region ||
    !facets.examType ||
    taxonomy.subCategory.includes("未分類") ||
    taxonomy.primaryCategory.includes("未分類")
  );
});

const stats = getTaxonomyStats(allPosts);
const subCategoryCounts = {};
for (const item of classified) {
  const key = `${item.taxonomy.primaryCategory} > ${item.taxonomy.subCategory}`;
  subCategoryCounts[key] = (subCategoryCounts[key] || 0) + 1;
}

console.log(JSON.stringify({
  total: classified.length,
  invalidCount: invalid.length,
  countByPrimary: stats.countByPrimary,
  countByRegion: stats.countByRegion,
  countByExamType: stats.countByExamType,
  countBySubCategory: Object.fromEntries(
    Object.entries(subCategoryCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja")),
  ),
  invalid: invalid.slice(0, 20),
}, null, 2));

if (invalid.length > 0) {
  process.exitCode = 1;
}
