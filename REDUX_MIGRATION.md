# Redux Migration Documentation

## Overview
This project has been migrated from using localStorage and Context API to Redux Toolkit for better state management. The migration removes localStorage dependencies and provides a centralized, predictable state management solution.

## What Changed

### 1. Removed localStorage Usage
- ❌ No more localStorage for storing campaigns, users, and dates
- ✅ All state is now managed through Redux store
- ✅ State persists during the session but resets on page refresh (as intended)

### 2. New Redux Architecture

#### Store Structure
```
src/store/
├── index.js              # Main store configuration
├── slices/
│   └── filterSlice.js    # Filter state management
└── hooks/
    └── useFilter.js      # Custom hook for filter operations
```

#### Filter State Structure
```javascript
{
  dateRange: [startDate, endDate],
  selectedCampaigns: ["All"],
  selectedUsers: ["All"],
  campaigns: [],
  users: [],
  loading: {
    campaigns: false,
    users: false,
  },
  error: {
    campaigns: null,
    users: null,
  }
}
```

### 3. New Reusable Components

#### FilterHeader Component
- **Location**: `src/components/FilterHeader.js`
- **Purpose**: Reusable header component with campaign, user, and date filters
- **Props**:
  - `title`: Page title
  - `subtitle`: Optional subtitle
  - `showBackButton`: Boolean to show back button
  - `onBackClick`: Function for back button click

#### Usage Example
```javascript
import FilterHeader from './FilterHeader';

// In your component
<FilterHeader 
  title="Dashboard"
  subtitle="Overview of your data"
  showBackButton={false}
/>
```

### 4. Custom Hook: useFilter
- **Location**: `src/hooks/useFilter.js`
- **Purpose**: Provides easy access to filter state and actions
- **Returns**:
  - All filter state (dateRange, selectedCampaigns, selectedUsers, etc.)
  - Action functions (updateDateRange, updateSelectedCampaigns, etc.)

#### Usage Example
```javascript
import { useFilter } from '../hooks/useFilter';

const MyComponent = () => {
  const { 
    dateRange, 
    selectedCampaigns, 
    selectedUsers,
    updateDateRange,
    updateSelectedCampaigns 
  } = useFilter();
  
  // Use the state and actions
};
```

## Migration Benefits

### 1. Better State Management
- ✅ Centralized state management
- ✅ Predictable state updates
- ✅ Better debugging with Redux DevTools
- ✅ No localStorage dependencies

### 2. Code Reusability
- ✅ Single FilterHeader component used across all pages
- ✅ Consistent filter behavior across the application
- ✅ Easy to maintain and update

### 3. Performance
- ✅ No localStorage reads/writes on every state change
- ✅ Optimized re-renders with Redux
- ✅ Better memory management

### 4. Developer Experience
- ✅ Type-safe state updates
- ✅ Better error handling
- ✅ Easier testing
- ✅ Clear data flow

## Updated Components

### Dashboard (`src/components/DashBoard.js`)
- ✅ Uses FilterHeader component
- ✅ Uses useFilter hook
- ✅ Removed all localStorage and Context dependencies

### Lead (`src/components/Lead.js`)
- ✅ Uses FilterHeader component
- ✅ Uses useFilter hook
- ✅ Simplified state management

### Sales (`src/components/Sales.js`)
- ✅ Uses FilterHeader component
- ✅ Uses useFilter hook
- ✅ Removed localStorage dependencies

## How to Use

### 1. Adding FilterHeader to a New Page
```javascript
import FilterHeader from '../components/FilterHeader';

const MyNewPage = () => {
  return (
    <div>
      <FilterHeader 
        title="My Page"
        subtitle="Optional subtitle"
        showBackButton={true}
        onBackClick={() => navigate('/previous-page')}
      />
      {/* Your page content */}
    </div>
  );
};
```

### 2. Accessing Filter State
```javascript
import { useFilter } from '../hooks/useFilter';

const MyComponent = () => {
  const { dateRange, selectedCampaigns, selectedUsers } = useFilter();
  
  // Use the filter state in your API calls
  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchData(dateRange, selectedCampaigns, selectedUsers);
    }
  }, [dateRange, selectedCampaigns, selectedUsers]);
};
```

### 3. Updating Filter State
```javascript
import { useFilter } from '../hooks/useFilter';

const MyComponent = () => {
  const { updateDateRange, updateSelectedCampaigns } = useFilter();
  
  const handleDateChange = (start, end) => {
    updateDateRange(start, end);
  };
  
  const handleCampaignChange = (campaigns) => {
    updateSelectedCampaigns(campaigns);
  };
};
```

## Dependencies Added
- `@reduxjs/toolkit`: Redux Toolkit for simplified Redux setup
- `react-redux`: React bindings for Redux

## Dependencies Removed
- `DateContext.js`: No longer needed
- All localStorage operations for filter state

## Testing
The new Redux implementation can be tested using Redux DevTools browser extension for better debugging and state inspection.

## Future Enhancements
1. Add persistence layer if needed (redux-persist)
2. Add more slices for other application state
3. Implement middleware for API calls
4. Add TypeScript for better type safety
