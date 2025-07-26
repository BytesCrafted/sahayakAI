// src/app/(pages)/content/quiz/page.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateQuiz } from "@/ai/flows/generate-quiz";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

const FormSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  grade: z.string().min(1, {
    message: "Grade is required.",
  }),
  topic: z.string().optional(),
  description: z.string().optional(),
});

export default function QuizGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
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

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResultUrl("");
    try {
      const result = await generateQuiz(data);
       if (result.url) {
        setResultUrl(result.url);
        toast({
          title: "Success!",
          description: "Your quiz has been generated.",
        });
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to generate quiz. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Quiz Generator"
        description="Create a comprehensive quiz for any subject and topic."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
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
                          <Input
                            placeholder="e.g., Biology"
                            {...field}
                          />
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
                        <FormLabel>Topic (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Photosynthesis"
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
                            placeholder="e.g., Focus on the chemical reactions involved."
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
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Quiz
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="min-h-[200px]">
            <CardHeader>
              <CardTitle>Generated Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
               {resultUrl && (
                <div className="flex flex-col items-start gap-4">
                  <p>
                    Your quiz is ready! Click the link below to download.
                  </p>
                  <Button asChild variant="outline">
                    <Link
                      href={resultUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Download Quiz (PDF)
                    </Link>
                  </Button>
                </div>
              )}
              {!loading && !resultUrl && (
                <p className="text-muted-foreground text-sm">
                  Your generated quiz link will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
