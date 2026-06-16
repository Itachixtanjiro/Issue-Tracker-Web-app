
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { IssueListPage } from './pages/IssueListPage';
import { IssueDetailPage } from './pages/IssueDetailPage';
import { usePerformance } from './hooks/usePerformance';

function App() {
  usePerformance();
  return (
    <HashRouter>
      <div className="min-h-screen text-gray-800 dark:text-gray-200">
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-4">
             <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                React Issue Tracker
             </Link>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<IssueListPage />} />
            <Route path="/issues/:id" element={<IssueDetailPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
