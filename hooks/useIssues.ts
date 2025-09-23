
import { useState, useCallback, useEffect } from 'react';
import { issueService } from '../services/issueService';
import { Issue, IssueFilters, IssueSort, PaginationState } from '../types';
import { PAGE_SIZE_OPTIONS } from '../constants';

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<IssueFilters>({});
  const [sort, setSort] = useState<IssueSort>({ field: 'updatedAt', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: PAGE_SIZE_OPTIONS[0] });

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { issues: fetchedIssues, total: totalCount } = await issueService.getIssues(filters, sort, pagination);
      setIssues(fetchedIssues);
      setTotal(totalCount);
    } catch (e) {
      setError('Failed to fetch issues.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const createIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    await issueService.createIssue(issueData);
    fetchIssues(); // Refresh list
  };

  const updateIssue = async (id: string, updates: Partial<Omit<Issue, 'id' | 'createdAt'>>) => {
    await issueService.updateIssue(id, updates);
    fetchIssues(); // Refresh list
  };
  
  const handleSort = (field: keyof Issue) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ field, direction });
  };
  
  const handlePageChange = (newPage: number) => {
    setPagination(p => ({...p, page: newPage}));
  };
  
  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({ page: 1, pageSize: newPageSize });
  };

  return {
    issues,
    total,
    loading,
    error,
    filters,
    setFilters,
    sort,
    handleSort,
    pagination,
    handlePageChange,
    handlePageSizeChange,
    createIssue,
    updateIssue,
    refresh: fetchIssues,
  };
};
