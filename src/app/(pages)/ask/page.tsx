"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { askSahayak } from "@/ai/flows/ask-sahayak";

const FormSchema = z.object({
  question: z.string().min(10, {
    message: "Question must be at least 10 characters.",
  }),
});

export default function AskSahayakPage() {
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setAnswer("");
    try {
      const result = await askSahayak({
        question: data.question,
        session_id: sessionId,
      });
      setAnswer(result.answer);
      setSessionId(result.session_id);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get an answer. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Ask Sahayak"
        description="Have a question? Ask our AI assistant for help on any topic."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Question</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What would you like to ask?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Explain the theory of relativity in simple terms."
                            className="resize-none"
                            rows={5}
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
                    Ask Sahayak
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="min-h-[200px]">
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {answer && (
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap font-body">
                  {answer}
                </div>
              )}
              {!loading && !answer && (
                <p className="text-muted-foreground text-sm">
                  The answer from Sahayak will appear here once you ask a question.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
