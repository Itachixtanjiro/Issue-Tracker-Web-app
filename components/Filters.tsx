import React from 'react';
import { IssueFilters } from '../types';
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants';
import { debounce } from '../utils/debounce';

interface FiltersProps {
  filters: IssueFilters;
  onFilterChange: (newFilters: IssueFilters) => void;
  assignees: string[];
}

export const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, assignees }) => {

  const handleDebouncedSearch = debounce((value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleDebouncedSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <input
        type="text"
        name="search"
        placeholder="Search by title..."
        onChange={handleSearchChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <select
        name="status"
        value={filters.status || ''}
        onChange={handleFilterChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map(status => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <select
        name="priority"
        value={filters.priority || ''}
        onChange={handleFilterChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">All Priorities</option>
        {PRIORITY_OPTIONS.map(priority => (
          <option key={priority} value={priority}>{priority}</option>
        ))}
      </select>
      <select
        name="assignee"
        value={filters.assignee || ''}
        onChange={handleFilterChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">All Assignees</option>
        {assignees.map(assignee => (
          <option key={assignee} value={assignee}>{assignee}</option>
        ))}
      </select>
    </div>
  );
};