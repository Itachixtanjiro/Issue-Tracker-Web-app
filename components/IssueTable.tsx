
import React from 'react';
import { Issue, IssueSort } from '../types';
import { Badge } from './common/Badge';
import { SortIcon } from './common/Icons';
import { IssueSkeleton } from './IssueSkeleton';


interface IssueTableProps {
  issues: Issue[];
  sort: IssueSort;
  onSort: (field: keyof Issue) => void;
  onEdit: (issue: Issue) => void;
  onRowClick: (issueId: string) => void;
}

const TableHeader: React.FC<{
  field: keyof Issue;
  label: string;
  sort: IssueSort;
  onSort: (field: keyof Issue) => void;
}> = ({ field, label, sort, onSort }) => {
  const isSorted = sort.field === field;
  const IssueTable: React.FC<Props> = ({ issues, loading, ...props }) => {
  if (loading) return <IssueSkeleton />;

  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        <SortIcon direction={isSorted ? sort.direction : undefined} />
      </div>
    </th>
  );
};


export const IssueTable: React.FC<IssueTableProps> = ({ issues, sort, onSort, onEdit, onRowClick }) => {
    
  if (issues.length === 0) {
    return <div className="p-4 text-center text-gray-500 dark:text-gray-400">No issues found.</div>;
  }
    
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <TableHeader field="title" label="Title" sort={sort} onSort={onSort} />
            <TableHeader field="status" label="Status" sort={sort} onSort={onSort} />
            <TableHeader field="priority" label="Priority" sort={sort} onSort={onSort} />
            <TableHeader field="assignee" label="Assignee" sort={sort} onSort={onSort} />
            <TableHeader field="updatedAt" label="Last Updated" sort={sort} onSort={onSort} />
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {issues.map((issue) => (
            <tr key={issue.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => onRowClick(issue.id)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{issue.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">ID: {issue.id.substring(0, 8)}...</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge status={issue.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge priority={issue.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {issue.assignee || 'Unassigned'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(issue.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(issue);
                  }}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
