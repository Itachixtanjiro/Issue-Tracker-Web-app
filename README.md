# React Issue Tracker

This is a modern, client-side issue tracker application built with React, TypeScript, and Tailwind CSS. It was developed as a frontend assignment to demonstrate proficiency in building functional, interactive user interfaces. The application allows users to view, search, filter, sort, create, and update issues, all within a clean and responsive UI.

A mock backend service is included to simulate API interactions, making the application fully self-contained and runnable without a separate server.

## Features

- **View Issues**: A comprehensive table displays a list of issues with key details.
- **Search**: A search bar allows for real-time title-based searching with debouncing for performance.
- **Filtering**: Dropdown menus to filter issues by `Status`, `Priority`, and `Assignee`.
- **Sorting**: Clickable table headers to sort issues by any column in ascending or descending order.
- **Pagination**: Full-featured pagination controls, including page navigation and page size selection.
- **Create & Update Issues**: A single, reusable modal form for both creating new issues and editing existing ones.
- **Detailed View**: Clicking on an issue row navigates to a separate page displaying the issue's full data in JSON format.
- **Responsive Design**: The UI is built with Tailwind CSS and is responsive across different screen sizes.
- **Client-Side Simulation**: No backend is required. A mock service layer mimics API latency and data operations.

---

## Architecture & Logic

The application follows a modern component-based architecture, emphasizing separation of concerns, reusability, and state management through custom hooks.

### 1. Backend Simulation (`services/issueService.ts`)

To function without a real backend, a mock service was created to simulate REST API endpoints.

- **In-Memory Data**: It holds an array of `Issue` objects in memory, which is pre-populated with realistic dummy data on startup.
- **Simulated Latency**: Every service method includes a `simulateDelay` function (a `setTimeout` wrapped in a Promise) to mimic real-world network latency, ensuring the UI's loading states are testable and robust.
- **`getIssues` Logic**: This is the core method for fetching data. It meticulously applies the requested operations in a specific order:
    1.  **Filtering**: It first filters the entire dataset based on the `search`, `status`, `priority`, and `assignee` criteria provided.
    2.  **Sorting**: The filtered results are then sorted based on the specified `field` and `direction`.
    3.  **Pagination**: Finally, it uses `.slice()` on the sorted array to return only the subset of issues required for the current page. It also returns the `total` count of filtered items for the pagination component.
- **CRUD Operations**: It includes methods like `createIssue`, `updateIssue`, and `getIssueById` that manipulate the in-memory array, generating `id` and timestamps as a real backend would.
- **`getAssignees`**: To populate the assignee filter dynamically, this method extracts all unique assignee names from the dataset.

### 2. State Management (`hooks/useIssues.ts`)

All the complex logic for managing the state of the issues list is encapsulated in this single custom hook. This keeps the page components clean and focused on rendering.

- **Centralized State**: The hook manages all related state variables: `issues`, `total` (total item count), `loading`, `error`, and the state for `filters`, `sort`, and `pagination`.
- **`fetchIssues` Function**: This function is the heart of the hook. It sets the `loading` state, calls the `issueService`, and then populates the `issues` and `total` state with the response. It's wrapped in `useCallback` to prevent unnecessary re-renders.
- **`useEffect` Trigger**: A `useEffect` hook watches for changes in `filters`, `sort`, or `pagination`. Whenever any of these state objects change, it automatically triggers `fetchIssues` to get the updated data from the service. This declarative approach simplifies data fetching.
- **State Handlers**: The hook exposes simple handler functions (`handleSort`, `handlePageChange`, `setFilters`, etc.). Components call these handlers, which update the internal state, which in turn triggers the `useEffect` and refreshes the data. This creates a clean, unidirectional data flow.

### 3. Component Breakdown

- **`IssueListPage.tsx` (Container Component)**
    - This component acts as the orchestrator for the main page.
    - It calls the `useIssues` hook to get all the data and handler functions.
    - It manages the state for the `IssueFormModal` (whether it's open and whether it's in "edit" mode).
    - It passes down the necessary data and callbacks as props to the presentational components (`Filters`, `IssueTable`, `Pagination`).

- **`Filters.tsx`**
    - Renders the search input and filter dropdowns.
    - To optimize performance, the search input uses a `debounce` utility. This prevents an API call on every keystroke, instead waiting until the user has stopped typing for 300ms.
    - It's a "controlled component"—it receives the current `filters` state as a prop and calls the `onFilterChange` callback (which is `setFilters` from the hook) to update the state in the parent.

- **`IssueTable.tsx`**
    - Responsible for rendering the list of issues.
    - The `TableHeader` sub-component is interactive; clicking it calls the `onSort` handler from the `useIssues` hook. It also displays a visual indicator for the current sort column and direction.
    - It handles two types of clicks on a row:
        1.  A click on the "Edit" button stops event propagation and calls `onEdit` to open the modal.
        2.  A click anywhere else on the row triggers `onRowClick` to navigate to the detail page.

- **`Pagination.tsx`**
    - Receives pagination state (`currentPage`, `totalPages`, `pageSize`, `totalItems`) and renders the navigation controls.
    - It calculates the "Showing X to Y of Z results" text based on these props.
    - Like the filters, it uses callbacks (`onPageChange`, `onPageSizeChange`) to notify the `useIssues` hook of user actions.

- **`IssueFormModal.tsx`**
    - A versatile component that handles both creating and editing.
    - It determines its mode based on whether `initialData` is passed as a prop.
    - A `useEffect` hook populates the form fields when `initialData` changes, allowing it to be pre-filled for editing.
    - It maintains its own internal form state. On submission, it calls the `onSubmit` prop with the form data.

- **`IssueDetailPage.tsx`**
    - This component uses the `useParams` hook from `react-router-dom` to get the issue `id` from the URL.
    - It uses a `useEffect` hook to call the `issueService.getIssueById` method to fetch the data for that specific issue and displays it as a formatted JSON string.

### 4. Routing (`App.tsx`)

- `react-router-dom` is used for client-side routing.
- `HashRouter` is used for simplicity and compatibility with static hosting.
- Two routes are defined:
    - `/`: Renders the `IssueListPage`.
    - `/issues/:id`: Renders the `IssueDetailPage`, making the `:id` parameter available to the component.
