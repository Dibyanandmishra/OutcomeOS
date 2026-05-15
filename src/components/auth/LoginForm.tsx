"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Info, Copy, Check } from "lucide-react";

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="relative w-full">
      <Card className="w-full bg-zinc-950 border-zinc-800 relative z-10">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email address" 
              name="email" 
              type="email" 
              placeholder="name@company.com" 
              autoComplete="email"
              required 
            />
            <Input 
              label="Password" 
              name="password" 
              type="password" 
              placeholder="••••••••" 
              autoComplete="current-password"
              required 
            />
            
            {error && (
              <div className="text-sm font-medium text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20" role="alert">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={isLoading} className="mt-2 w-full">
              Sign In
            </Button>
            
            <div className="text-center text-sm text-zinc-400 mt-4">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-white hover:text-zinc-300 transition-colors focus:outline-none focus:underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Temporary Reviewer Credentials */}
      <div className="mt-8 xl:mt-0 xl:absolute xl:top-0 xl:-right-[300px] xl:w-64 glass border-cyan-500/20 rounded-xl p-5 overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
          <Info className="w-24 h-24 text-cyan-400" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyan-400">Reviewer Access</h4>
          </div>
          
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Temporary credentials for internship evaluation. (To be removed before production deployment).
          </p>

          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Email</p>
              <div 
                onClick={() => copyToClipboard('reviewer@outcomeos.com', 'email')}
                className="flex items-center justify-between bg-black/40 border border-white/5 rounded-lg px-3 py-2 cursor-pointer hover:bg-black/60 transition-colors"
              >
                <span className="text-sm font-mono text-zinc-300">reviewer@outcomeos.com</span>
                {copiedField === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              </div>
            </div>
            
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Password</p>
              <div 
                onClick={() => copyToClipboard('reviewer123', 'password')}
                className="flex items-center justify-between bg-black/40 border border-white/5 rounded-lg px-3 py-2 cursor-pointer hover:bg-black/60 transition-colors"
              >
                <span className="text-sm font-mono text-zinc-300">reviewer123</span>
                {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-500" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
