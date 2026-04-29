import React from "react";

export const Badge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-2.5 py-0.5 text-xs font-medium text-zinc-300 ${className}`}>
      {children}
    </div>
  );
};
