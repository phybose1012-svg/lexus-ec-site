import type {
  AdmissionPlanningRoute2027,
  PlanningAssignment2027,
  PlanningExamGroup2027,
  PlanningExamStage2027,
} from "../data/admissionPlanning2027";

export type PlannerGoal = "priority" | "coverage";
export type PlannerPriority = 1 | 2 | 3 | 4;

export type PlannerSelection = {
  routeId: string;
  priority: PlannerPriority;
};

export type PlannerForcedChoices = Record<string, string | string[]>;

export type PlannerRouteReference = {
  routeId: string;
  universityName: string;
  routeName: string;
  priority: PlannerPriority;
};

export type PlannerAssignment = {
  groupId: string;
  sharedGroupId?: string;
  stage: PlanningExamStage2027;
  dates: string[];
  availableDates: string[];
  assignment: PlanningAssignment2027;
  attendance: PlanningExamGroup2027["attendance"];
  note?: string;
  raw: string;
  routes: PlannerRouteReference[];
};

export type PlannerConflictKind =
  | "first_first"
  | "first_second"
  | "second_second"
  | "same_university";
export type PlannerConflictSeverity = "hard" | "decision" | "conditional";

export type PlannerConflict = {
  id: string;
  date: string;
  possibleDates: string[];
  kind: PlannerConflictKind;
  severity: PlannerConflictSeverity;
  left: PlannerAssignment;
  right: PlannerAssignment;
  recommendedRouteId?: string;
};

export type PlannerCalendarEvent = {
  id: string;
  date: string;
  type:
    | "applicationStart"
    | "applicationDeadline"
    | "commonTest"
    | "firstExam"
    | "firstResult"
    | "secondExam"
    | "finalResult"
    | "procedureDeadline";
  universityName: string;
  routeNames: string[];
  detail: string;
  state:
    | "confirmed"
    | "selected"
    | "alternative"
    | "conditional"
    | "decision"
    | "pending";
  recommended?: boolean;
  sourceUrl?: string;
};

export type AdmissionPlanResult = {
  status: "ready" | "needs_decision" | "conflict" | "incomplete";
  selectedRoutes: PlannerRouteReference[];
  assignments: PlannerAssignment[];
  conflicts: PlannerConflict[];
  calendar: PlannerCalendarEvent[];
  exploredPlans: number;
};

type GroupOccurrence = {
  group: PlanningExamGroup2027;
  route: AdmissionPlanningRoute2027;
  priority: PlannerPriority;
};

type MergedGroup = {
  key: string;
  group: PlanningExamGroup2027;
  occurrences: GroupOccurrence[];
};

const priorityWeight: Record<PlannerPriority, number> = { 1: 5, 2: 3, 3: 2, 4: 1 };

const uncertainAssignments = new Set<PlanningAssignment2027>([
  "candidate_preference",
  "university_assignment",
  "unknown",
]);

const routeRef = (occurrence: GroupOccurrence): PlannerRouteReference => ({
  routeId: occurrence.route.id,
  universityName: occurrence.route.universityName,
  routeName: occurrence.route.routeName,
  priority: occurrence.priority,
});

const uniqueRouteRefs = (occurrences: GroupOccurrence[]) => {
  const refs = new Map<string, PlannerRouteReference>();
  occurrences.forEach((occurrence) => refs.set(occurrence.route.id, routeRef(occurrence)));
  return [...refs.values()];
};

const mergeGroups = (occurrences: GroupOccurrence[]): MergedGroup[] => {
  const groups = new Map<string, MergedGroup>();

  occurrences.forEach((occurrence) => {
    const key = occurrence.group.sharedEventGroupId ?? occurrence.group.id;
    const existing = groups.get(key);
    if (existing) {
      existing.occurrences.push(occurrence);
      existing.group.dates = [...new Set([...existing.group.dates, ...occurrence.group.dates])].sort();
      return;
    }

    groups.set(key, {
      key,
      group: { ...occurrence.group, dates: [...occurrence.group.dates] },
      occurrences: [occurrence],
    });
  });

  return [...groups.values()];
};

const assignmentOptions = (merged: MergedGroup, forcedChoices: PlannerForcedChoices) => {
  const { group } = merged;
  if (group.dates.length === 0) return [[]];
  if (group.attendance === "all") return [[...group.dates]];

  const forced = forcedChoices[group.id] ?? forcedChoices[merged.key];
  const forcedDates = (Array.isArray(forced) ? forced : forced ? [forced] : []).filter(
    (date, index, dates) => group.dates.includes(date) && dates.indexOf(date) === index,
  );
  if (forcedDates.length > 0) return [forcedDates.sort()];
  return group.dates.map((date) => [date]);
};

const overlap = (left: string[], right: string[]) => left.filter((date) => right.includes(date));

const conflictKind = (
  left: PlanningExamStage2027,
  right: PlanningExamStage2027,
): PlannerConflictKind | undefined => {
  if (left === "common_test" || right === "common_test") return undefined;
  if (left === "first_exam" && right === "first_exam") return "first_first";
  if (left === "second_exam" && right === "second_exam") return "second_second";
  return "first_second";
};

const groupPriority = (group: MergedGroup, goal: PlannerGoal) => {
  if (goal === "coverage") return 1;
  return Math.max(...group.occurrences.map((occurrence) => priorityWeight[occurrence.priority]));
};

const groupsBelongToSameUniversity = (left: MergedGroup, right: MergedGroup) => {
  const universities = new Set(
    [...left.occurrences, ...right.occurrences].map(
      (occurrence) => occurrence.route.universityId,
    ),
  );
  return universities.size === 1;
};

const pairPenalty = (
  left: MergedGroup,
  leftDates: string[],
  right: MergedGroup,
  rightDates: string[],
  goal: PlannerGoal,
) => {
  const dates = overlap(leftDates, rightDates);
  if (dates.length === 0) return 0;
  const kind = conflictKind(left.group.stage, right.group.stage);
  if (!kind) return 0;

  const base = groupsBelongToSameUniversity(left, right)
    ? 180
    : kind === "first_first"
      ? 10_000
      : kind === "first_second"
        ? 2_200
        : 900;
  const uncertainty =
    uncertainAssignments.has(left.group.assignment) || uncertainAssignments.has(right.group.assignment)
      ? 0.45
      : 1;
  return base * uncertainty * dates.length * Math.max(groupPriority(left, goal), groupPriority(right, goal));
};

const scorePlan = (groups: MergedGroup[], choices: string[][], goal: PlannerGoal) => {
  let score = 0;
  for (let leftIndex = 0; leftIndex < groups.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < groups.length; rightIndex += 1) {
      score += pairPenalty(
        groups[leftIndex],
        choices[leftIndex],
        groups[rightIndex],
        choices[rightIndex],
        goal,
      );
    }
  }

  const examDays = [...new Set(choices.flat())].sort();
  for (let index = 1; index < examDays.length; index += 1) {
    const previous = new Date(`${examDays[index - 1]}T00:00:00Z`).getTime();
    const current = new Date(`${examDays[index]}T00:00:00Z`).getTime();
    if ((current - previous) / 86_400_000 === 1) score += goal === "priority" ? 3 : 10;
  }

  return score;
};

const chooseBestAssignments = (
  groups: MergedGroup[],
  goal: PlannerGoal,
  forcedChoices: PlannerForcedChoices,
) => {
  const options = groups.map((group) => assignmentOptions(group, forcedChoices));
  let explored = 0;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestChoices: string[][] = groups.map(() => []);
  const working: string[][] = [];
  const maxPlans = 30_000;

  const visit = (index: number) => {
    if (explored >= maxPlans) return;
    if (index === groups.length) {
      explored += 1;
      const score = scorePlan(groups, working, goal);
      if (score < bestScore) {
        bestScore = score;
        bestChoices = working.map((dates) => [...dates]);
      }
      return;
    }

    options[index].forEach((dates) => {
      working[index] = dates;
      visit(index + 1);
    });
  };

  visit(0);
  return { choices: bestChoices, explored };
};

const toAssignments = (groups: MergedGroup[], choices: string[][]): PlannerAssignment[] =>
  groups.map((merged, index) => ({
    groupId: merged.group.id,
    sharedGroupId: merged.group.sharedEventGroupId,
    stage: merged.group.stage,
    dates: choices[index] ?? [],
    availableDates: [...merged.group.dates],
    assignment: merged.group.assignment,
    attendance: merged.group.attendance,
    note: merged.group.note,
    raw: merged.group.raw,
    routes: uniqueRouteRefs(merged.occurrences),
  }));

const recommendedRoute = (left: PlannerAssignment, right: PlannerAssignment) => {
  const candidates = [...left.routes, ...right.routes].sort((a, b) => a.priority - b.priority);
  if (candidates.length < 2 || candidates[0].priority === candidates[1].priority) return undefined;
  return candidates[0].routeId;
};

const buildConflicts = (assignments: PlannerAssignment[]) => {
  const conflicts: PlannerConflict[] = [];
  const seen = new Set<string>();

  const pushConflict = (
    left: PlannerAssignment,
    right: PlannerAssignment,
    dates: string[],
    severity: PlannerConflictSeverity,
  ) => {
    const stageKind = conflictKind(left.stage, right.stage);
    if (!stageKind) return;
    const universities = new Set(
      [...left.routes, ...right.routes].map((route) => route.universityName),
    );
    const kind: PlannerConflictKind =
      universities.size === 1 ? "same_university" : stageKind;
    dates.forEach((date) => {
      const id = [left.groupId, right.groupId, date, severity].sort().join("::");
      if (seen.has(id)) return;
      seen.add(id);
      conflicts.push({
        id,
        date,
        possibleDates: dates,
        kind,
        severity,
        left,
        right,
        recommendedRouteId: recommendedRoute(left, right),
      });
    });
  };

  for (let leftIndex = 0; leftIndex < assignments.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < assignments.length; rightIndex += 1) {
      const left = assignments[leftIndex];
      const right = assignments[rightIndex];
      const actualDates = overlap(left.dates, right.dates);
      const uncertain =
        uncertainAssignments.has(left.assignment) || uncertainAssignments.has(right.assignment);

      if (actualDates.length > 0) {
        const kind = conflictKind(left.stage, right.stage);
        const severity: PlannerConflictSeverity = uncertain
          ? "conditional"
          : new Set([...left.routes, ...right.routes].map((route) => route.universityName)).size === 1
            ? "conditional"
            : kind === "first_first"
            ? "hard"
            : "decision";
        pushConflict(left, right, actualDates, severity);
      }

      if (uncertain) {
        const riskDates = overlap(left.availableDates, right.availableDates).filter(
          (date) => !actualDates.includes(date),
        );
        if (riskDates.length > 0) pushConflict(left, right, riskDates, "conditional");
      }
    }
  }

  return conflicts.sort((left, right) => left.date.localeCompare(right.date));
};

const calendarTypeForStage: Record<PlanningExamStage2027, PlannerCalendarEvent["type"]> = {
  common_test: "commonTest",
  first_exam: "firstExam",
  second_exam: "secondExam",
};

const buildCalendar = (
  routes: AdmissionPlanningRoute2027[],
  selections: PlannerSelection[],
  assignments: PlannerAssignment[],
  conflicts: PlannerConflict[],
) => {
  const priorityByRoute = new Map(selections.map((selection) => [selection.routeId, selection.priority]));
  const events: PlannerCalendarEvent[] = [];

  routes.forEach((route) => {
    if (!priorityByRoute.has(route.id)) return;
    route.calendarEvents.forEach((event, index) => {
      events.push({
        id: `${route.id}--${event.type}--${event.date}--${index}`,
        date: event.date,
        type: event.type,
        universityName: route.universityName,
        routeNames: [route.routeName],
        detail: event.detail,
        state: route.status === "pending" ? "pending" : "confirmed",
        sourceUrl: event.sourceUrl ?? route.sourceUrl,
      });
    });
  });

  assignments.forEach((assignment) => {
    const calendarDates =
      assignment.stage === "second_exam" ? assignment.availableDates : assignment.dates;
    calendarDates.forEach((date) => {
      const isSelectedDate = assignment.dates.includes(date);
      const conflict = conflicts.some(
        (candidate) =>
          candidate.date === date &&
          (candidate.left.groupId === assignment.groupId || candidate.right.groupId === assignment.groupId),
      );
      const firstRoute = assignment.routes[0];
      const recommended =
        assignment.stage === "second_exam" &&
        isSelectedDate &&
        assignment.availableDates.length > assignment.dates.length;
      events.push({
        id: `${assignment.groupId}--${date}`,
        date,
        type: calendarTypeForStage[assignment.stage],
        universityName:
          assignment.stage === "common_test" ? "大学入学共通テスト" : firstRoute?.universityName ?? "",
        routeNames: assignment.routes.map((route) => route.routeName),
        detail: assignment.note ?? assignment.raw,
        state: !isSelectedDate
          ? "alternative"
          : conflict
          ? "decision"
          : assignment.assignment === "candidate_choice"
            ? "selected"
            : uncertainAssignments.has(assignment.assignment)
              ? "conditional"
              : "confirmed",
        recommended,
        sourceUrl: routes.find((route) => route.id === firstRoute?.routeId)?.sourceUrl,
      });
    });
  });

  return events
    .filter(
      (event, index, allEvents) =>
        allEvents.findIndex(
          (candidate) =>
            candidate.date === event.date &&
            candidate.type === event.type &&
            candidate.universityName === event.universityName &&
            candidate.detail === event.detail,
        ) === index,
    )
    .sort((left, right) => left.date.localeCompare(right.date) || left.type.localeCompare(right.type));
};

export const planAdmissionRoutes = (
  routes: AdmissionPlanningRoute2027[],
  selections: PlannerSelection[],
  goal: PlannerGoal = "priority",
  forcedChoices: PlannerForcedChoices = {},
): AdmissionPlanResult => {
  const selectionByRoute = new Map(selections.map((selection) => [selection.routeId, selection]));
  const selectedRoutes = routes.filter((route) => selectionByRoute.has(route.id));
  const occurrences = selectedRoutes.flatMap((route) =>
    route.examGroups.map((group) => ({
      group,
      route,
      priority: selectionByRoute.get(route.id)?.priority ?? 4,
    })),
  );
  const mergedGroups = mergeGroups(occurrences);
  const { choices, explored } = chooseBestAssignments(mergedGroups, goal, forcedChoices);
  const assignments = toAssignments(mergedGroups, choices);
  const conflicts = buildConflicts(assignments);
  const hasUnknown = assignments.some(
    (assignment) => assignment.assignment === "unknown" || assignment.availableDates.length === 0,
  );
  const status: AdmissionPlanResult["status"] = conflicts.some(
    (conflict) => conflict.severity === "hard",
  )
    ? "conflict"
    : conflicts.length > 0
      ? "needs_decision"
      : hasUnknown
        ? "incomplete"
        : "ready";

  return {
    status,
    selectedRoutes: selectedRoutes.map((route) => ({
      routeId: route.id,
      universityName: route.universityName,
      routeName: route.routeName,
      priority: selectionByRoute.get(route.id)?.priority ?? 4,
    })),
    assignments,
    conflicts,
    calendar: buildCalendar(routes, selections, assignments, conflicts),
    exploredPlans: explored,
  };
};
