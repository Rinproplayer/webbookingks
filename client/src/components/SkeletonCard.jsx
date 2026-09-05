import React from 'react';

export function HotelCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 animate-pulse flex flex-col sm:flex-row gap-5">
      <div className="w-full sm:w-60 h-48 sm:h-44 bg-slate-200 dark:bg-slate-700 rounded-2xl shrink-0"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-xl w-28"></div>
        </div>
      </div>
    </div>
  );
}

export function GridCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 animate-pulse">
      <div className="h-52 bg-slate-200 dark:bg-slate-700 w-full"></div>
      <div className="p-5 space-y-3">
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-xl w-24"></div>
        </div>
      </div>
    </div>
  );
}
