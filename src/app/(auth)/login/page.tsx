// src/app/(auth)/login/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { GoogleIcon } from "@/components/icons";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to login. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create user profile in Firestore if it doesn't exist
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        role: "teacher",
        createdAt: new Date(),
        lastLogin: new Date(),
      }, { merge: true });

      toast({
        title: "Success",
        description: "Logged in with Google successfully!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <PageHeader
          title="Login to SahayakAI"
          description="Access your dashboard and tools."
        />
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-accent hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-5 w-5" />}
          Google
        </Button>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {"Don't have an account? "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
