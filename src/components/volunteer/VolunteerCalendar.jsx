import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';

export default function VolunteerCalendar({ needs, onSelectDate, selectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const needsByDate = useMemo(() => {
    const map = {};
    needs.forEach(need => {
      const dateStr = need.date;
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(need);
    });
    return map;
  }, [needs]);

  const getDayNeeds = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return needsByDate[dateStr] || [];
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h3 className="font-heading text-xl text-primary">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border/50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center">
            <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{day}</span>
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayNeeds = getDayNeeds(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const openNeeds = dayNeeds.filter(n => n.status === 'open');

          return (
            <button
              key={index}
              onClick={() => onSelectDate(day)}
              className={`
                relative p-2 min-h-[80px] sm:min-h-[100px] border-b border-r border-border/30 text-left transition-colors
                ${!isCurrentMonth ? 'opacity-30' : 'hover:bg-secondary/50'}
                ${isSelected ? 'bg-secondary ring-2 ring-accent ring-inset' : ''}
              `}
            >
              <span className={`
                font-body text-sm
                ${isToday ? 'bg-primary text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center' : ''}
                ${isSelected && !isToday ? 'font-semibold text-accent' : 'text-foreground'}
              `}>
                {format(day, 'd')}
              </span>
              {openNeeds.length > 0 && (
                <div className="mt-1">
                  <Badge className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-0 font-body">
                    {openNeeds.length} need{openNeeds.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}