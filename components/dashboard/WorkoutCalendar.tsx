'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { WorkoutLog } from '../../lib/types';

interface WorkoutCalendarProps {
  logs: WorkoutLog[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

export default function WorkoutCalendar({ logs, onDateSelect, selectedDate }: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get the first day of the week for the first day of the month
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Generate calendar dates
  const calendarDates = [];
  const current = new Date(startDate);
  
  for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
    calendarDates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  // Create a map of logged dates for quick lookup
  const loggedDates = new Set(logs.map(log => log.date));

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    onDateSelect?.(date);
  };

  const isDateInCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isLoggedDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return loggedDates.has(dateString);
  };

  const isSelectedDate = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="card-gradient rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Workout Calendar</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthName}
            </span>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {calendarDates.map((date, index) => {
              const inCurrentMonth = isDateInCurrentMonth(date);
              const todayDate = isToday(date);
              const logged = isLoggedDate(date);
              const selected = isSelectedDate(date);

              return (
                <motion.button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`
                    p-2 text-sm rounded-md transition-colors relative
                    ${inCurrentMonth ? 'text-foreground' : 'text-muted-foreground/50'}
                    ${todayDate ? 'font-bold' : ''}
                    ${selected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                    ${logged && !selected ? 'bg-success/20 text-success-foreground border border-success/30' : ''}
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {date.getDate()}
                  
                  {logged && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-success rounded-full" />
                  )}
                  
                  {todayDate && !logged && (
                    <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Workout Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}