export const subscriptionTiers = [
  "STARTER",
  "PROFESSIONAL",
  "ENTERPRISE",
] as const;

export const organizationTypes = [
  "SOLO",
  "SMALL_FIRM",
  "MID_SIZE",
  "LARGE_FIRM",
  "CORPORATE_LEGAL",
  "NON_PROFIT",
  "GOVERNMENT",
] as const;

export const PARTY_TYPES = [
  "CLIENT_INDIVIDUAL",
  "CLIENT_ENTITY",
  "CLIENT",
  "OPPOSING_PARTY",
  "OPPOSING_COUNSEL",
  "ADVERSE_PARTY",
  "CO_COUNSEL",
  "WITNESS",
  "THIRD_PARTY",
  "INTERVENOR",
  "JUDGE",
  "EXPERT",
  "ADJUSTER",
  "RELATED_ENTITY",
] as const;

export const ENTITY_TYPES = [
  "INDIVIDUAL",
  "CORPORATION",
  "LLC",
  "PARTNERSHIP",
  "NONPROFIT",
  "GOVERNMENT",
  "TRUST",
  "OTHER",
] as const;

export const PRIORITY_LEVELS = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;

export const MATTER_STATUSES = [
  "DRAFT",
  "INTAKE",
  "ACTIVE",
  "PENDING",
  "CLOSED",
  "ARCHIVED",
] as const;
