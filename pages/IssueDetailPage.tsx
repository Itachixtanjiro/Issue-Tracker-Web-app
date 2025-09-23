
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Issue } from '../types';
import { issueService } from '../services/issueService';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) {
        setError('Issue ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedIssue = await issueService.getIssueById(id);
        if (fetchedIssue) {
          setIssue(fetchedIssue);
        } else {
          setError('Issue not found.');
        }
      } catch (e) {
        setError('Failed to fetch issue details.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const renderJson = (data: Issue) => {
      const replacer = (key: string, value: any) => {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
      }
      return JSON.stringify(data, replacer, 2);
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Issue Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back to List
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {issue && (
        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">{issue.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">ID: {issue.id}</p>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
            <code>{renderJson(issue)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
