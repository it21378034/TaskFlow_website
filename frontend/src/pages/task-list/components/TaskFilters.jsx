import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TaskFilters = ({ 
  activeFilters, 
  onFilterChange, 
  onClearFilters,
  onSearch,
  searchQuery 
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filterOptions = {
    status: [
      { value: 'pending', label: 'Pending', color: 'bg-warning-100 text-warning-700' },
      { value: 'in-progress', label: 'In Progress', color: 'bg-primary-100 text-primary-700' },
      { value: 'completed', label: 'Completed', color: 'bg-success-100 text-success-700' }
    ],
    priority: [
      { value: 'high', label: 'High Priority', color: 'bg-error-100 text-error-700' },
      { value: 'medium', label: 'Medium Priority', color: 'bg-warning-100 text-warning-700' },
      { value: 'low', label: 'Low Priority', color: 'bg-success-100 text-success-700' }
    ]
  };

  const handleFilterToggle = (filterType, value) => {
    const currentValues = activeFilters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterType, newValues);
  };

  const handleDateRangeChange = (type, value) => {
    const newRange = { ...dateRange, [type]: value };
    setDateRange(newRange);
    
    if (newRange.start && newRange.end) {
      onFilterChange('dateRange', newRange);
    }
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((count, values) => {
      if (Array.isArray(values)) return count + values.length;
      if (values && typeof values === 'object') return count + 1;
      return count;
    }, 0);
  };

  const removeFilter = (filterType, value = null) => {
    if (value) {
      const currentValues = activeFilters[filterType] || [];
      onFilterChange(filterType, currentValues.filter(v => v !== value));
    } else {
      onFilterChange(filterType, []);
    }
  };

  return (
    <div className="bg-surface border-b border-border">
      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Icon
                name="Search"
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              />
              <Input
                type="search"
                placeholder="Search tasks or try 'overdue high priority tasks'..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-secondary-50 border-0 rounded-md"
              />
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            iconName="Filter"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`${showAdvancedFilters ? 'bg-primary-50 text-primary' : 'text-text-muted'}`}
          >
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>
          
          {getActiveFilterCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearFilters}
              className="text-text-muted hover:text-error"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Chips */}
      {getActiveFilterCount() > 0 && (
        <div className="px-6 py-3 bg-secondary-50 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {Object.entries(activeFilters).map(([filterType, values]) => {
              if (!values || (Array.isArray(values) && values.length === 0)) return null;
              
              if (filterType === 'dateRange' && values.start && values.end) {
                return (
                  <div
                    key={filterType}
                    className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                  >
                    <Icon name="Calendar" size={14} />
                    <span>{values.start} to {values.end}</span>
                    <button
                      onClick={() => removeFilter(filterType)}
                      className="ml-1 hover:text-primary-800"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                );
              }
              
              if (Array.isArray(values)) {
                return values.map((value) => {
                  const option = filterOptions[filterType]?.find(opt => opt.value === value);
                  return (
                    <div
                      key={`${filterType}-${value}`}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                        option?.color || 'bg-secondary-100 text-text-secondary'
                      }`}
                    >
                      <span>{option?.label || value}</span>
                      <button
                        onClick={() => removeFilter(filterType, value)}
                        className="ml-1 hover:opacity-80"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  );
                });
              }
              
              return null;
            })}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="px-6 py-4 bg-secondary-50 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Status
              </label>
              <div className="space-y-2">
                {filterOptions.status.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(activeFilters.status || []).includes(option.value)}
                      onChange={() => handleFilterToggle('status', option.value)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {filterOptions.priority.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={(activeFilters.priority || []).includes(option.value)}
                      onChange={() => handleFilterToggle('priority', option.value)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Due Date Range
              </label>
              <div className="space-y-2">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="w-full text-sm"
                  placeholder="Start date"
                />
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="w-full text-sm"
                  placeholder="End date"
                />
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Quick Filters
              </label>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange('quickFilter', 'overdue')}
                  className="w-full justify-start text-error hover:bg-error-50"
                >
                  <Icon name="AlertTriangle" size={14} className="mr-2" />
                  Overdue Tasks
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange('quickFilter', 'today')}
                  className="w-full justify-start text-warning hover:bg-warning-50"
                >
                  <Icon name="Clock" size={14} className="mr-2" />
                  Due Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFilterChange('quickFilter', 'unassigned')}
                  className="w-full justify-start text-text-muted hover:bg-secondary-100"
                >
                  <Icon name="UserX" size={14} className="mr-2" />
                  Unassigned
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;