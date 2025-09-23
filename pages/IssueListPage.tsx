import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../hooks/useIssues';
import { Issue } from '../types';
import { IssueFormModal } from '../components/IssueFormModal';
import { Filters } from '../components/Filters';
import { IssueTable } from '../components/IssueTable';
import { Pagination } from '../components/Pagination';
import { issueService } from '../services/issueService';

export const IssueListPage: React.FC = () => {
  const {
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
  } = useIssues();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [assignees, setAssignees] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignees = async () => {
        try {
            const fetchedAssignees = await issueService.getAssignees();
            setAssignees(fetchedAssignees);
        } catch (e) {
            console.error("Failed to fetch assignees", e);
        }
    };
    fetchAssignees();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingIssue(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIssue(null);
  };

  const handleRowClick = (issueId: string) => {
    navigate(`/issues/${issueId}`);
  };

  const handleFormSubmit = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'> | Issue) => {
    if ('id' in issueData) {
      await updateIssue(issueData.id, issueData);
    } else {
      await createIssue(issueData);
    }
    handleCloseModal();
  };
  
  const totalPages = useMemo(() => Math.ceil(total / pagination.pageSize), [total, pagination.pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Issues</h1>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Create Issue
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <Filters filters={filters} onFilterChange={setFilters} assignees={assignees} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {loading && <div className="p-4 text-center">Loading issues...</div>}
        {error && <div className="p-4 text-center text-red-500">{error}</div>}
        {!loading && !error && (
          <>
            <IssueTable
              issues={issues}
              sort={sort}
              onSort={handleSort}
              onEdit={handleOpenEditModal}
              onRowClick={handleRowClick}
            />
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              pageSize={pagination.pageSize}
              onPageSizeChange={handlePageSizeChange}
              totalItems={total}
            />
          </>
        )}
      </div>

      {isModalOpen && (
        <IssueFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          initialData={editingIssue}
        />
      )}
    </div>
  );
};