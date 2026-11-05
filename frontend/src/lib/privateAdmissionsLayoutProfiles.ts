/** One opt-in file per university allows reviewed pages to be released individually. */
export type PrivateAdmissionsLayout = {
 slug:string;
 variant?:'osakaika';
 groups:{id:string;label:string;schemes:string[]}[];
};
const modules:Record<string,PrivateAdmissionsLayout>=import.meta.env?.SSR?import.meta.glob<PrivateAdmissionsLayout>('../data/privateAdmissionsLayouts/*.json',{eager:true,import:'default'}):{};
const layouts=new Map(Object.values(modules).map(layout=>['/information-'+layout.slug+'/',layout]));
export function getPrivateAdmissionsLayout(path:string){return layouts.get(path);}
