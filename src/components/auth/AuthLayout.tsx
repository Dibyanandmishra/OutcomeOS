import React from "react";
import { Badge } from "@/components/ui/Badge";

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <div className="h-6 w-6 rounded-md bg-indigo-500 flex items-center justify-center">
          <span className="text-slate-50 font-bold text-xs">O</span>
        </div>
        <span className="text-slate-50 font-semibold tracking-tight">OutcomeOS</span>
      </div>
      
      <div className="w-full max-w-md flex flex-col items-center">
        <Badge className="mb-6">SaaS Platform</Badge>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-2">{title}</h1>
          <p className="text-slate-400 text-sm">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
};
