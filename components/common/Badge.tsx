
import React from 'react';
import { IssueStatus, IssuePriority } from '../../types';

interface BadgeProps {
  status?: IssueStatus;
  priority?: IssuePriority;
}

export const Badge: React.FC<BadgeProps> = ({ status, priority }) => {
  let colorClasses = '';
  let text = '';

  if (status) {
    text = status;
    switch (status) {
      case IssueStatus.Open:
        colorClasses = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        break;
      case IssueStatus.InProgress:
        colorClasses = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        break;
      case IssueStatus.Closed:
        colorClasses = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        break;
    }
  } else if (priority) {
    text = priority;
    switch (priority) {
      case IssuePriority.High:
        colorClasses = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        break;
      case IssuePriority.Medium:
        colorClasses = 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        break;
      case IssuePriority.Low:
        colorClasses = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        break;
    }
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
      {text}
    </span>
  );
};
