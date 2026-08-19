import {
  privateMedicalExamVenueAssignments2027,
  privateMedicalExamVenueSummary2027,
  privateMedicalExamVenues2027,
  venueAssignmentConditionLabels,
  venuePublicationStateLabels,
} from "./privateMedicalExamVenues2027.ts";
import {
  hotelVenueAccessReviewStateLabels2027,
  privateMedicalVenueHotels2027,
} from "./privateMedicalVenueHotels2027.ts";
import {
  privateMedicalExamVenuesHotels2027FieldDefinitions,
  privateMedicalExamVenuesHotels2027Metadata,
} from "./privateMedicalExamVenuesHotels2027Metadata.ts";

const publicHotels = privateMedicalVenueHotels2027.filter(
  (hotel) => hotel.operatingStatus === "official_site_active" && hotel.reviewState === "verified",
);

const sourceUrls = [
  ...privateMedicalExamVenueAssignments2027.map((assignment) => assignment.officialAdmissionUrl),
  ...privateMedicalExamVenues2027.map((venue) => venue.officialUrl),
  ...publicHotels.flatMap((hotel) => [
    hotel.officialUrl,
    hotel.officialBookingUrl,
    hotel.operatingStatusEvidenceUrl,
    ...hotel.amenities.map((amenity) => amenity.evidenceUrl),
    ...hotel.venueAccess.flatMap((access) => access.evidenceUrls),
  ]),
].filter((url): url is string => Boolean(url));

export const privateMedicalExamVenuesHotels2027SourceUrls = [...new Set(sourceUrls)];

const publicFieldDefinitions = privateMedicalExamVenuesHotels2027FieldDefinitions.map((field) => ({
  ...field,
}));

const toPublicVenue = (venue: (typeof privateMedicalExamVenues2027)[number]) => ({
  venueId: venue.venueId,
  academicYear: venue.academicYear,
  name: venue.name,
  shortName: venue.shortName,
  ...(venue.postalCode ? { postalCode: venue.postalCode } : {}),
  address: venue.address,
  prefecture: venue.prefecture,
  municipality: venue.municipality,
  nearestStations: [...venue.nearestStations],
  officialUrl: venue.officialUrl,
  ...(venue.officialUrlLabel ? { officialUrlLabel: venue.officialUrlLabel } : {}),
  ...(venue.accessNote ? { accessNote: venue.accessNote } : {}),
  reviewState: venue.reviewState,
  verifiedAt: venue.verifiedAt,
});

const toPublicAssignment = (
  assignment: (typeof privateMedicalExamVenueAssignments2027)[number],
) => ({
  assignmentId: assignment.assignmentId,
  academicYear: assignment.academicYear,
  universityId: assignment.universityId,
  universityName: assignment.universityName,
  region: assignment.region,
  prefecture: assignment.prefecture,
  routeId: assignment.routeId,
  routeName: assignment.routeName,
  routeCategory: assignment.routeCategory,
  routeStatus: assignment.routeStatus,
  examStage: assignment.examStage,
  examStageLabel: assignment.examStageLabel,
  examDateLabel: assignment.examDateLabel,
  announcedPrefectures: [...assignment.announcedPrefectures],
  venueLinks: assignment.venueLinks.map((link) => ({
    venueId: link.venueId,
    role: link.role,
    ...(link.applicantPrefecture ? { applicantPrefecture: link.applicantPrefecture } : {}),
    ...(link.examPart ? { examPart: link.examPart } : {}),
    ...(link.examDate ? { examDate: link.examDate } : {}),
    ...(link.officialVenueText ? { officialVenueText: link.officialVenueText } : {}),
  })),
  announcedVenueText: assignment.announcedVenueText,
  publicationState: assignment.publicationState,
  conditions: [...assignment.conditions],
  sharedWithRouteIds: [...assignment.sharedWithRouteIds],
  ...(assignment.officialAdmissionUrl
    ? { officialAdmissionUrl: assignment.officialAdmissionUrl }
    : {}),
  evidenceLabel: assignment.evidenceLabel,
  ...(assignment.evidenceLocator ? { evidenceLocator: assignment.evidenceLocator } : {}),
  reviewState: assignment.reviewState,
  verifiedAt: assignment.verifiedAt,
  ...(assignment.note ? { note: assignment.note } : {}),
});

const toPublicHotel = (hotel: (typeof privateMedicalVenueHotels2027)[number]) => ({
  hotelId: hotel.hotelId,
  name: hotel.name,
  ...(hotel.postalCode ? { postalCode: hotel.postalCode } : {}),
  address: hotel.address,
  prefecture: hotel.prefecture,
  municipality: hotel.municipality,
  officialUrl: hotel.officialUrl,
  ...(hotel.officialBookingUrl ? { officialBookingUrl: hotel.officialBookingUrl } : {}),
  nearestStation: hotel.nearestStation,
  venueAccess: hotel.venueAccess.map((access) => {
    const routeNeedsReview = access.reviewState.includes("needs_route_review");
    return {
      venueId: access.venueId,
      modes: [...access.modes],
      routeSummary: access.routeSummary,
      ...(access.transferCount === undefined ? {} : { transferCount: access.transferCount }),
      ...(!routeNeedsReview && access.travelTimeLabel
        ? { travelTimeLabel: access.travelTimeLabel }
        : {}),
      ...(!routeNeedsReview && access.distanceLabel ? { distanceLabel: access.distanceLabel } : {}),
      measurementBasis: access.measurementBasis,
      reviewState: [...access.reviewState],
      verifiedAt: access.verifiedAt,
      ...(access.caution ? { caution: access.caution } : {}),
      evidenceUrls: [...access.evidenceUrls],
    };
  }),
  amenities: hotel.amenities.map((amenity) => ({
    key: amenity.key,
    label: amenity.label,
    detail: amenity.detail,
    evidenceUrl: amenity.evidenceUrl,
  })),
  operatingStatus: hotel.operatingStatus,
  ...(hotel.operatingStatusEvidenceUrl
    ? { operatingStatusEvidenceUrl: hotel.operatingStatusEvidenceUrl }
    : {}),
  reviewState: hotel.reviewState,
  verifiedAt: hotel.verifiedAt,
  ...(hotel.note ? { note: hotel.note } : {}),
});

const publicHotelLinkedVenueCount = new Set(
  publicHotels.flatMap((hotel) => hotel.venueAccess.map((access) => access.venueId)),
).size;

export const getPrivateMedicalExamVenuesHotels2027Dataset = () => ({
  schemaVersion: "1.1.0",
  metadata: privateMedicalExamVenuesHotels2027Metadata,
  scope: {
    country: "JP",
    academicYear: 2027,
    universityCount: privateMedicalExamVenueSummary2027.universityCount,
    routeCount: privateMedicalExamVenueSummary2027.routeCount,
    exclusions: [
      "大学入学共通テスト本試験だけの会場",
      "学士編入・大学院・医学科以外の学部学科",
      "正式会場が未公表の方式に対する推測ホテル",
    ],
  },
  fieldDefinitions: publicFieldDefinitions,
  definitions: {
    publicationStates: venuePublicationStateLabels,
    assignmentConditions: venueAssignmentConditionLabels,
    reviewStates: {
      verified: "公式情報と照合済み",
      monitoring: "公式発表の更新を継続確認中",
      needs_review: "公式資料間の差異等を確認中",
    },
    venueLinkRoles: {
      fixed: "固定会場",
      choice: "受験生が選択できる会場",
      announced: "公表済み会場（選択方法は未公表）",
      primary: "原則会場",
      overflow: "定員状況等による代替会場",
    },
    examParts: {
      written: "学力試験",
      interview: "面接試験",
    },
    hotelAccessReviewStates: hotelVenueAccessReviewStateLabels2027,
  },
  summary: {
    ...privateMedicalExamVenueSummary2027,
    hotelCount: publicHotels.length,
    hotelLinkedVenueCount: publicHotelLinkedVenueCount,
  },
  venues: privateMedicalExamVenues2027.map(toPublicVenue),
  assignments: privateMedicalExamVenueAssignments2027.map(toPublicAssignment),
  hotels: publicHotels.map(toPublicHotel),
  provenance: {
    venuePolicy:
      "2027年度の大学公式募集要項・訂正資料・公式入試ページを優先し、各レコードに紐づく公式根拠と照合します。",
    hotelPolicy:
      "正式会場を確認した後に、宿泊施設と交通機関の公式サイトで名称、住所、営業状態、設備、経路をそれぞれ確認します。",
    sourceUrls: privateMedicalExamVenuesHotels2027SourceUrls,
    verifiedAt: privateMedicalExamVenuesHotels2027Metadata.dateModified,
  },
  disclaimer:
    "会場・日程・交通・宿泊条件は変更される場合があります。出願前と受験票発行後に、大学・会場・宿泊施設・交通機関の最新公式情報を必ず確認してください。",
});
