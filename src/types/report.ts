export interface Report {
  id: string;
  orgId: string;
  name: string;
  description: string;
  reportType: string;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: null;
}
