import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | OutcomeOS",
  description: "Sign in to your OutcomeOS account.",
};

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your credentials to access your workspace"
    >
      <LoginForm />
    </AuthLayout>
  );
}
