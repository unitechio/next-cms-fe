export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  resource_id: string;
  details: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface AuditLogFilters {
  page: number;
  limit: number;
  user_id?: string;
  action?: string;
  resource?: string;
  start_date?: string;
  end_date?: string;
}
