"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Sparkles, Link as LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { generateLessonPlan } from "@/ai/flows/generate-lesson-plan";

const FormSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  grade: z.string().min(1, {
    message: "Grade is required.",
  }),
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
});

export default function GenerateLessonPlanPage() {
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      grade: "",
      topic: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResultUrl("");
    try {
      const result = await generateLessonPlan(data);
      if (result.url) {
        setResultUrl(result.url);
        toast({
          title: "Success!",
          description: "Your lesson plan has been generated.",
        });
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Generate Lesson Plan"
        description="Design detailed lesson plans with objectives, activities, and assessments."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Lesson Plan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="e.g., History" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="e.g., 10th Grade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g., The American Revolution"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-accent hover:bg-accent/90">
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Lesson Plan
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="min-h-[200px]">
            <CardHeader>
              <CardTitle>Generated Lesson Plan</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {resultUrl && (
                <div className="flex flex-col items-start gap-4">
                  <p>Your lesson plan is ready! Click the link below to download.</p>
                  <Button asChild variant="outline">
                    <Link href={resultUrl} target="_blank" rel="noopener noreferrer">
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Download Lesson Plan (PDF)
                    </Link>
                  </Button>
                </div>
              )}
              {!loading && !resultUrl && (
                <p className="text-muted-foreground text-sm">
                  Your generated lesson plan link will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
