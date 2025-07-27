// src/app/(pages)/content/lesson-plan/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Sparkles } from "lucide-react";

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
import { generateLessonPlan, GenerateLessonPlanInput } from "@/ai/flows/generate-lesson-plan";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContentAssignment, ContentDetails } from "@/components/content-assignment";
import { LoadingAnimation } from "@/components/loading-animation";

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
  description: z.string().optional(),
});

export default function GenerateLessonPlanPage() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentDetails | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      grade: "",
      topic: "",
      description: "",
    },
  });

  async function onSubmit(data: GenerateLessonPlanInput) {
    setLoading(true);
    setGeneratedContent(null);
    try {
      const result = await generateLessonPlan(data);
      if (result.url) {
        setGeneratedContent({
          pdfUrl: result.url,
          title: data.topic,
          topic: data.topic,
          subject: data.subject,
          grade: data.grade,
          contentType: "lesson_plan",
          userPrompt: data.description || "",
        });
        toast({
          title: "Success!",
          description: "Your lesson plan has been generated.",
        });
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate lesson plan. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (generatedContent) {
    return <ContentAssignment content={generatedContent} onBack={() => setGeneratedContent(null)} />;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingAnimation animationType="gemini"/>
      </div>
    );
  }


  return (
    <>
      <PageHeader
        title="Lesson Plan Generator"
        description="Create a comprehensive lesson plan for any subject and topic."
      />
      <Card>
        <CardHeader>
          <CardTitle>Lesson Details</CardTitle>
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
                      <Input placeholder="e.g., History" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a grade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            Grade {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        placeholder="e.g., The American Revolution"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                       <Textarea
                        placeholder="e.g., Include hands-on activities and a short video suggestion."
                        className="resize-none"
                        rows={3}
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
                className="w-full sm:w-auto bg-accent hover:bg-accent/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Lesson Plan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
