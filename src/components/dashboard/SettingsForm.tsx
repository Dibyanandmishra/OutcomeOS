"use client";

import { useState } from "react";
import { User, Mail, Shield, Save, Key } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type SettingsFormProps = {
  user: {
    name: string;
    email: string;
    role: string;
    batchNumber?: string | null;
  };
};

export function SettingsForm({ user }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    batchNumber: user.batchNumber || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call for now since we are focusing on UI
    setTimeout(() => {
      toast.success("Settings updated successfully", {
        description: "Your profile information has been saved."
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="premium-surface rounded-2xl p-8 border border-white/5 space-y-8">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/20">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Profile Information</h3>
              <p className="text-sm text-zinc-500">Update your personal details and how others see you.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Your name"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-zinc-900/30 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-zinc-500 cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>
              <p className="text-[10px] text-zinc-600 px-1">Email cannot be changed for security reasons.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Batch Number
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="e.g. BATCH-2024"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">
                Account Role
              </label>
              <div className="flex items-center gap-2 bg-zinc-900/30 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-500">
                <Shield className="w-4 h-4 text-cyan-400/50" />
                <span className="capitalize font-medium">{user.role.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-white/5"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>

      <div className="premium-surface rounded-2xl p-8 border border-white/5 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Security & Password</h3>
            <p className="text-xs text-zinc-500">Manage your password and account security settings.</p>
          </div>
        </div>
        
        <button 
          type="button"
          onClick={() => toast.info("Password reset link sent", {
            description: "Check your email for instructions to reset your password."
          })}
          className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors flex items-center gap-2 px-1"
        >
          Reset Password
          <div className="h-px w-8 bg-zinc-800 group-hover:w-12 transition-all" />
        </button>
      </div>
    </div>
  );
}
