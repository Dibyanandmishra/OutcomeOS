import React from "react";

export const Card = ({ className = "", children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-800 shadow-xl ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ className = "", children }: { className?: string, children: React.ReactNode }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

export const CardTitle = ({ className = "", children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight text-slate-50 ${className}`}>{children}</h3>
);

export const CardDescription = ({ className = "", children }: { className?: string, children: React.ReactNode }) => (
  <p className={`text-sm text-slate-400 ${className}`}>{children}</p>
);

export const CardContent = ({ className = "", children }: { className?: string, children: React.ReactNode }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export const CardFooter = ({ className = "", children }: { className?: string, children: React.ReactNode }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);
