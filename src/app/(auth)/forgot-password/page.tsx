// src/app/(auth)/forgot-password/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setSent(true);
      toast({
        title: "Password Reset Email Sent",
        description: "Please check your inbox for password reset instructions.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <PageHeader
          title="Forgot Password"
          description={sent ? "Check your email." : "Enter your email to receive a password reset link."}
        />
        {sent ? (
          <div className="text-center">
             <p className="text-muted-foreground">
              An email has been sent to your registered address with instructions on how to reset your password.
             </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
        )}
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-accent hover:underline"
          >
            <ArrowLeft className="inline-block w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
