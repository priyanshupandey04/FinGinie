import { Plan, PlanVersion } from "@/src/generated";

// Create a new type that includes the relation
export type PlanWithVersions = Plan& {
  versions: PlanVersion[];
};