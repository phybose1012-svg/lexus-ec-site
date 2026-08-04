import type { APIRoute } from "astro";
import { getPrivateMedicalSpecialAdmissions2027Dataset } from "../../data/privateMedicalSpecialAdmissions2027Dataset";
import { privateMedicalSpecialAdmissions2027Metadata } from "../../data/privateMedicalSpecialAdmissions2027Metadata";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(getPrivateMedicalSpecialAdmissions2027Dataset(), null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition":
        'inline; filename="private-medical-special-admissions-2027.json"',
      Link: `<${privateMedicalSpecialAdmissions2027Metadata.canonicalUrl}>; rel="describedby"`,
    },
  });
