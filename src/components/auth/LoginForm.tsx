"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <Card className="w-full bg-zinc-950 border-zinc-800">
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

          <Button type="submit" isLoading={isLoading} className="mt-2">
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
  );
};
