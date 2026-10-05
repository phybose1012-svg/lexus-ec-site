export type PlannerStep = 1 | 2 | 3 | 4;
export type PlannerFlow = { step: PlannerStep; unlocked: PlannerStep };

// Saved calendars return to review, so changed source dates are never silently reused.
export function restorePlannerFlow(savedStep: unknown, hasSelections: boolean): PlannerFlow {
  const step = hasSelections && [2, 3, 4].includes(Number(savedStep))
    ? Math.min(Number(savedStep), 3) as PlannerStep : 1;
  return { step, unlocked: step };
}

export function movePlannerFlow(
  flow: PlannerFlow, target: number, hasSelections: boolean, generate = false,
): PlannerFlow {
  if (![1, 2, 3, 4].includes(target) || (!hasSelections && target !== 1)) return flow;
  const allowed = target <= flow.unlocked || (target === flow.step + 1 && target <= 3)
    || (generate && flow.step === 3 && target === 4);
  if (!allowed) return flow;
  return { step: target as PlannerStep, unlocked: Math.max(flow.unlocked, target) as PlannerStep };
}

export function invalidatePlannerFlow(flow: PlannerFlow, hasSelections: boolean): PlannerFlow {
  if (!hasSelections) return { step: 1, unlocked: 1 };
  const step = Math.min(flow.step, 3) as PlannerStep;
  return { step, unlocked: step };
}
