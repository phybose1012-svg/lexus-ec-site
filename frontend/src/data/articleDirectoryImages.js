import { classifyArticlePost } from "./articleTaxonomy.js";

const characterImagePrefix = "/illustrations/characters/";

export const isCharacterImage = (image) => Boolean(image?.src?.startsWith(characterImagePrefix));

const realHeroImage = (post) => {
  const image = post?.heroImage;
  if (!image?.src || isCharacterImage(image)) return null;
  return image;
};

const isBasicInformationPost = (post) =>
  post?.template === "admission-info" &&
  post?.path?.startsWith("/information-") &&
  post?.path !== "/information-faq/";

export function buildArticleDirectoryImageIndex(posts) {
  const universityImages = new Map();
  const regionImages = new Map();

  for (const post of posts) {
    if (!isBasicInformationPost(post)) continue;

    const image = realHeroImage(post);
    if (!image) continue;

    const taxonomy = post.taxonomy || classifyArticlePost(post);
    const universityNames = taxonomy.facets.universityNames?.length
      ? taxonomy.facets.universityNames
      : [taxonomy.facets.universityName];

    for (const universityName of universityNames.filter(Boolean)) {
      if (!universityImages.has(universityName)) {
        universityImages.set(universityName, image);
      }
    }

    if (taxonomy.facets.region && !regionImages.has(taxonomy.facets.region)) {
      regionImages.set(taxonomy.facets.region, image);
    }
  }

  return { universityImages, regionImages };
}

const imageByUniversity = (post, imageIndex) => {
  const taxonomy = post.taxonomy || classifyArticlePost(post);
  const universityNames = taxonomy.facets.universityNames?.length
    ? taxonomy.facets.universityNames
    : [taxonomy.facets.universityName];

  for (const universityName of universityNames.filter(Boolean)) {
    const image = imageIndex.universityImages.get(universityName);
    if (image) return image;
  }

  return null;
};

const imageByRegion = (post, imageIndex) => {
  const taxonomy = post.taxonomy || classifyArticlePost(post);
  if (!taxonomy.facets.region) return null;
  return imageIndex.regionImages.get(taxonomy.facets.region) || null;
};

export function resolveArticleDirectoryImage(post, imageIndex) {
  const ownImage = realHeroImage(post);
  const universityImage = imageByUniversity(post, imageIndex);
  const regionImage = imageByRegion(post, imageIndex);

  if (post.template === "voice-interview") {
    return ownImage || universityImage || regionImage;
  }

  return universityImage || ownImage || regionImage;
}
