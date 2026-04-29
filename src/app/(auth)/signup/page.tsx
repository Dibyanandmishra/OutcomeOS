import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | OutcomeOS",
  description: "Create your OutcomeOS account.",
};

export default function SignupPage() {
  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Join OutcomeOS and supercharge your productivity"
    >
      <SignupForm />
    </AuthLayout>
  );
}
