export interface ClientDashboardData {
  totalCases: number;
  activeCases: number;
  totalDocuments: number;
  totalOutstanding: number;
  unreadNotificationCount: number;
  upcomingDeadlines: UpcomingDeadline[];
  recentActivity: ClientRecentActivity[];
}

export interface RecentActivity {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: Record<string, any>;
  ipAddress: string;
  timestamp: string;
}

export type ClientRecentActivity = Omit<
  RecentActivity,
  "actorId" | "ipAddress" | "actorEmail" | "details"
>;

interface UpcomingDeadline {
  id: string;
  caseId: string;
  caseTitle: string;
  caseNumber: string;
  title: string;
  dueDate: string;
  completed: boolean;
}

export interface DashboardData {
  teamSize: number;
  seatLimit: number;
  pendingInvitations: number;
  totalCases: number;
  activeCases: number;
  outstandingInvoiceTotal: number;
  overdueInvoiceCount: number;
  subscriptionTier: string;
  subscriptionStatus: string;
  billableHoursThisMonth: number;
  upcomingHearingsCount: number;
  openTasksCount: number;
  overdueTasksCount: number;
  upcomingDeadlines: UpcomingDeadline[];
  recentActivity: RecentActivity[];
}

export type DashboardResponse = DashboardData | ClientDashboardData;

/** `ClientDashboardData` is the only variant with a `totalDocuments` field. */
export function isClientDashboard(
  data: DashboardResponse,
): data is ClientDashboardData {
  return "totalDocuments" in data;
}
