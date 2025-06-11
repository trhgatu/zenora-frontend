export interface TopService {
  name: string;
  count: number;
}

export interface AdminStatistics {
  totalAppointments: number;
  totalRevenue: number;
  completedCount: number;
  cancelledCount: number;
  noShowCount: number;
  topServices: TopService[];
}
