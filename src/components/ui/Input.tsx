import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-zinc-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            flex h-11 w-full rounded-lg border bg-zinc-900 px-4 py-2.5 text-sm text-white
            transition-all duration-200 placeholder:text-zinc-500
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-0
            disabled:cursor-not-allowed disabled:opacity-50
            ${error ? "border-red-500/50 focus-visible:ring-red-500" : "border-zinc-800 hover:border-zinc-700"}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
