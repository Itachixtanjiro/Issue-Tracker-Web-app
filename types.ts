
export enum IssueStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Closed = 'Closed',
}

export enum IssuePriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IssueFilters {
  search?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignee?: string;
}

export interface IssueSort {
  field: keyof Issue;
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
}
