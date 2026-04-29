import React from "react";

export const Badge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`inline-flex items-center rounded-full border border-slate-700 bg-slate-800/50 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-50 ${className}`}>
      {children}
    </div>
  );
};
