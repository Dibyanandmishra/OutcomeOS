import React from "react";
import { Badge } from "@/components/ui/Badge";

export const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black p-4 font-sans">
      <div className="absolute top-8 left-8 flex items-center space-x-2">
        <span className="text-white font-bold tracking-tight text-lg">OutcomeOS</span>
      </div>
      
      <div className="w-full max-w-md flex flex-col items-center">
        <Badge className="mb-6">SaaS Platform</Badge>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{title}</h1>
          <p className="text-zinc-400 text-sm">{subtitle}</p>
        </div>
        
        {children}
      </div>
    </div>
  );
};
