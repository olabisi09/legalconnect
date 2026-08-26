export interface CaseDocument {
  id: string;
  caseId: string;
  orgId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: string;
  confidentiality: string;
  description: string;
  uploadedBy: string;
  storageRef: string;
  checksum: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  storageRef: string;
  checksum: string;
  mimeType: string;
  contentLength: number;
  changeDescription: string;
  createdBy: string;
  createdAt: string;
}

export type DocumentDetail = CaseDocument & { versions: CaseDocumentVersion[] };

export type Confidentiality =
  | "OPEN"
  | "INTERNAL"
  | "CONFIDENTIAL"
  | "ATTORNEY_CLIENT_PRIVILEGED";

export type AccessLevel = "VIEW" | "COMMENT" | "EDIT" | "FULL_CONTROL";

export type ShareTargetType = "USER" | "TEAM" | "ROLE" | "ORGANIZATION";

export type DocumentStatus =
  | "CREATED"
  | "UPLOADED"
  | "DRAFT"
  | "REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "ARCHIVED"
  | "DESTROYED";

export interface RegisterDocumentPayload {
  fileName: string;
  fileType?: string;
  fileSize?: number;
  confidentiality?: Confidentiality;
  description?: string;
}

export interface UploadFilePayload {
  id: string;
  file: File;
  changeDescription?: string;
}

export interface ShareDocumentPayload {
  id: string;
  targetType: ShareTargetType;
  targetId: string;
  accessLevel: AccessLevel;
  expiresAt?: string;
}

export interface TransitionPayload {
  id: string;
  newStatus: DocumentStatus;
  reason?: string;
}
