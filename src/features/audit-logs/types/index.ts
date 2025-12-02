export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  resource_id?: string;
  description?: string;
  details?: string;
  ip_address: string;
  user_agent: string;
  method: string;
  path: string;
  status_code: number;
  duration?: number;
  request_body?: string | null;
  response_body?: string | null;
  old_values?: string | null;
  new_values?: string | null;
  metadata?: string | null;
  created_at: string;
  finished_at?: string | null;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface AuditLogFilters {
  page: number;
  limit: number;
  search?: string;
  user_id?: string;
  action?: string;
  resource?: string;
  start_date?: string;
  end_date?: string;
  status_code?: string;
}
