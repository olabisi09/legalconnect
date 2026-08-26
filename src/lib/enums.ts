export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "LAWYER",
  "PARALEGAL",
  "FINANCE",
  "CLIENT",
] as const;

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

export const PRIORITY_LEVELS = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

export const MATTER_STATUSES = [
  "DRAFT",
  "INTAKE",
  "ACTIVE",
  "PENDING",
  "CLOSED",
  "ARCHIVED",
] as const;

export const CASE_STATUSES = [
  "INTAKE",
  "ACTIVE",
  "RESOLVED",
  "CLOSED",
] as const;

export const CASE_TYPES = [
  "LITIGATION",
  "TRANSACTION",
  "CORPORATE",
  "FAMILY",
  "PROBATE",
  "INTERNAL",
] as const;

export const STAGE_TYPES = [
  "INTAKE",
  "PLEADING",
  "DISCOVERY",
  "MOTIONS",
  "PRE_TRIAL",
  "TRIAL",
  "POST_TRIAL",
  "DILIGENCE",
  "DRAFTING",
  "NEGOTIATION",
  "EXECUTION",
  "POST_CLOSING",
  "RESEARCH",
  "REVIEW",
  "DELIVERY",
  "INVESTIGATION",
  "ANALYSIS",
  "REPORTING",
  "REMEDIATION",
  "MONITORING",
  "INITIATION",
  "PANEL_SELECTION",
  "PRELIMINARY",
  "HEARING",
  "AWARD",
  "ACTION",
  "RECORD",
] as const;

export const DOCUMENT_TYPES = [
  "CREATED",
  "UPLOADED",
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "REJECTED",
  "PUBLISHED",
  "SUPERSEDED",
  "ARCHIVED",
  "DESTROYED",
] as const;
