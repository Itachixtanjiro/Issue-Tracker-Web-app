import React from 'react';

export const IssueSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
      ))}
    </div>
  </div>
);