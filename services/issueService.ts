import { v4 as uuidv4 } from 'uuid';
import { Issue, IssueStatus, IssuePriority, IssueFilters, IssueSort, PaginationState } from '../types';

let issues: Issue[] = [];

// Pre-populate with dummy data
const dummyAssignees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Edward'];
const dummyTitles = [
    'UI bug on login screen', 'API endpoint returning 500', 'Database migration failed',
    'Update user documentation', 'Refactor authentication service', 'Add new payment gateway',
    'Fix broken link on homepage', 'Improve mobile responsiveness', 'Optimize image loading',
    'Set up CI/CD pipeline', 'Write unit tests for user model', 'Design new dashboard layout',
    'Fix styling inconsistencies', 'Add dark mode support', 'Implement password reset feature'
];

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

if (issues.length === 0) {
    for (let i = 0; i < 25; i++) {
        const now = new Date();
        const createdAt = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const updatedAt = new Date(createdAt.getTime() + Math.random() * (now.getTime() - createdAt.getTime()));

        issues.push({
            id: uuidv4(),
            title: getRandomElement(dummyTitles),
            description: 'This is a detailed description for the issue. It might contain markdown or code snippets.',
            status: getRandomElement(Object.values(IssueStatus)),
            priority: getRandomElement(Object.values(IssuePriority)),
            assignee: Math.random() > 0.3 ? getRandomElement(dummyAssignees) : undefined,
            createdAt,
            updatedAt
        });
    }
}

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const issueService = {
  async getIssues(
    filters: IssueFilters,
    sort: IssueSort,
    pagination: PaginationState
  ): Promise<{ issues: Issue[], total: number }> {
    await simulateDelay(300);

    let filteredIssues = [...issues];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredIssues = filteredIssues.filter(issue => issue.title.toLowerCase().includes(searchTerm));
    }
    if (filters.status) {
      filteredIssues = filteredIssues.filter(issue => issue.status === filters.status);
    }
    if (filters.priority) {
      filteredIssues = filteredIssues.filter(issue => issue.priority === filters.priority);
    }
    if (filters.assignee) {
        filteredIssues = filteredIssues.filter(issue => issue.assignee === filters.assignee);
    }

    filteredIssues.sort((a, b) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];
      let comparison = 0;
      if (fieldA > fieldB) {
        comparison = 1;
      } else if (fieldA < fieldB) {
        comparison = -1;
      }
      return sort.direction === 'desc' ? comparison * -1 : comparison;
    });
    
    const total = filteredIssues.length;
    const paginatedIssues = filteredIssues.slice(
      (pagination.page - 1) * pagination.pageSize,
      pagination.page * pagination.pageSize
    );

    return { issues: paginatedIssues, total };
  },

  async getIssueById(id: string): Promise<Issue | undefined> {
    await simulateDelay(200);
    return issues.find(issue => issue.id === id);
  },

  async createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue> {
    await simulateDelay(400);
    const now = new Date();
    const newIssue: Issue = {
      ...issueData,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    issues = [newIssue, ...issues];
    return newIssue;
  },

  async updateIssue(id: string, updates: Partial<Omit<Issue, 'id' | 'createdAt'>>): Promise<Issue | undefined> {
    await simulateDelay(400);
    const issueIndex = issues.findIndex(issue => issue.id === id);
    if (issueIndex === -1) {
      return undefined;
    }
    const updatedIssue = {
      ...issues[issueIndex],
      ...updates,
      updatedAt: new Date(),
    };
    issues[issueIndex] = updatedIssue;
    return updatedIssue;
  },
  
  async getAssignees(): Promise<string[]> {
    await simulateDelay(100);
    const allAssignees = issues
      .map(issue => issue.assignee)
      .filter((assignee): assignee is string => !!assignee);
    const uniqueAssignees = [...new Set(allAssignees)];
    return uniqueAssignees.sort();
  },
};