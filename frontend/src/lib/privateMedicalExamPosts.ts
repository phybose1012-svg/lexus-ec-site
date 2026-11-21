import type { MarkdownInstance } from "astro";
import { z } from "astro/zod";
import { getPrivateMedicalSchoolPath, privateMedicalSchools } from "../data/privateMedicalSchools";

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const label = z.string().trim().min(1);
const metadata = z.object({
  university: slug.refine((id) => privateMedicalSchools.some((school) => school.id === id), "Unknown university ID"),
  year: z.number().int().min(1900).max(9999),
  selection: slug,
  selectionLabel: label,
  subject: slug,
  subjectLabel: label,
  title: label,
  description: label,
});

type ExamPostMetadata = z.infer<typeof metadata>;
type MarkdownPost = MarkdownInstance<Record<string, unknown>>;

export function collectPrivateMedicalExamPosts(modules: Record<string, MarkdownPost>) {
  const paths = new Set<string>();
  const posts = Object.entries(modules).flatMap(([file, article]) => {
    const draft = z.boolean().default(true).parse(article.frontmatter.draft, { path: [file, "draft"] });
    if (draft) return [];

    const data = metadata.parse(article.frontmatter, { path: [file] });
    const path = `${getPrivateMedicalSchoolPath(data.university)}${data.year}/${data.selection}/${data.subject}/`;
    if (paths.has(path)) throw new Error(`Duplicate private medical exam post route ${path} in ${file}`);
    paths.add(path);

    return [{ ...data, path, article }];
  });

  return posts.sort((a, b) =>
    b.year - a.year || a.selection.localeCompare(b.selection) || a.subject.localeCompare(b.subject),
  );
}

export const privateMedicalExamPosts = collectPrivateMedicalExamPosts(
  import.meta.glob<MarkdownPost>("../content/private-medical-exam-prep/**/*.md", { eager: true }),
);

export type PrivateMedicalExamPost = ExamPostMetadata & { path: string; article: MarkdownPost };

export function getPrivateMedicalExamPostGroups(university: string) {
  const years = new Map<number, Map<string, PrivateMedicalExamPost[]>>();
  for (const post of privateMedicalExamPosts) {
    if (post.university !== university) continue;

    const selections = years.get(post.year) ?? new Map<string, PrivateMedicalExamPost[]>();
    const subjects = selections.get(post.selection) ?? [];
    subjects.push(post);
    selections.set(post.selection, subjects);
    years.set(post.year, selections);
  }
  return years;
}
