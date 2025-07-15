import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CalendarWidget = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + direction);
    setCurrentDate(newDate);
  };

  const getTasksForDate = (date) => {
    const dateString = new Date(currentYear, currentMonth, date).toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  const isToday = (date) => {
    return today.getDate() === date && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear;
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-8 w-8"></div>
      );
    }

    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const tasksForDate = getTasksForDate(date);
      const hasOverdueTasks = tasksForDate.some(task => 
        new Date(task.dueDate) < today && task.status !== 'completed'
      );
      
      days.push(
        <div
          key={date}
          className={`h-8 w-8 flex items-center justify-center text-sm rounded-md cursor-pointer transition-smooth relative ${
            isToday(date)
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'hover:bg-secondary-100 text-text-primary'
          }`}
        >
          {date}
          {tasksForDate.length > 0 && (
            <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
              hasOverdueTasks ? 'bg-error' : 'bg-primary'
            }`}></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-1 rounded-md hover:bg-secondary-100 transition-smooth"
          >
            <Icon name="ChevronLeft" size={16} className="text-text-muted" />
          </button>
          <span className="text-sm font-medium text-text-primary min-w-24 text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="p-1 rounded-md hover:bg-secondary-100 transition-smooth"
          >
            <Icon name="ChevronRight" size={16} className="text-text-muted" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Due dates</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span>Overdue</span>
          </div>
        </div>
        <button className="text-primary hover:text-primary-600 transition-smooth">
          View All
        </button>
      </div>
    </div>
  );
};

export default CalendarWidget;