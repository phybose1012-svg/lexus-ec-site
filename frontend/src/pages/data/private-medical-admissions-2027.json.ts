import type { APIRoute } from "astro";
import { getPrivateMedicalAdmissions2027Dataset } from "../../data/privateMedicalAdmissions2027Dataset";
import { privateMedicalAdmissions2027Metadata } from "../../data/privateMedicalAdmissions2027Metadata";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(getPrivateMedicalAdmissions2027Dataset(), null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'inline; filename="private-medical-admissions-2027.json"',
      Link: `<${privateMedicalAdmissions2027Metadata.canonicalUrl}>; rel="describedby"`,
    },
  });
