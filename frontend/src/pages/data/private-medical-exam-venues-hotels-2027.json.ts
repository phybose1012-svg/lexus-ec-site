import type { APIRoute } from "astro";
import { getPrivateMedicalExamVenuesHotels2027Dataset } from "../../data/privateMedicalExamVenuesHotels2027Dataset";
import { privateMedicalExamVenuesHotels2027Metadata } from "../../data/privateMedicalExamVenuesHotels2027Metadata";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(getPrivateMedicalExamVenuesHotels2027Dataset(), null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      "Content-Disposition":
        'inline; filename="private-medical-exam-venues-hotels-2027.json"',
      Link: `<${privateMedicalExamVenuesHotels2027Metadata.canonicalUrl}>; rel="describedby"`,
    },
  });
