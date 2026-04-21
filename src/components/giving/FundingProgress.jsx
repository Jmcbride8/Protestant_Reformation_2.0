import React from 'react';
import { Progress } from "@/components/ui/progress";

export default function FundingProgress({ label, current, goal, color }) {
  const percentage = Math.min(Math.round((current / goal) * 100), 100);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <p className="font-body text-sm text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl text-primary">
            ${current.toLocaleString()} <span className="text-base text-muted-foreground font-body">of ${goal.toLocaleString()}</span>
          </p>
        </div>
        <span className="font-heading text-3xl text-primary">{percentage}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color || 'hsl(224, 52%, 23%)' }}
        />
      </div>
    </div>
  );
}