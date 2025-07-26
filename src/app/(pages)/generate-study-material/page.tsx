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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useToast } from "@/hooks/use-toast";
import { generateStudyMaterial } from "@/ai/flows/generate-study-material";

const FormSchema = z.object({
  subject: z.string().min(3, {
    message: "Subject must be at least 3 characters.",
  }),
  topic: z.string().min(3, {
    message: "Topic must be at least 3 characters.",
  }),
});

export default function GenerateStudyMaterialPage() {
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState("");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      subject: "",
      topic: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setMaterial("");
    try {
      const result = await generateStudyMaterial(data);
      setMaterial(result.studyMaterial);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate study material. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Generate Study Material"
        description="Instantly create comprehensive study guides on any subject and topic."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Study Material Details</CardTitle>
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
                          <Input placeholder="e.g., Biology" {...field} />
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
                          <Input placeholder="e.g., Cell Structure" {...field} />
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
                    Generate Material
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="min-h-[200px]">
            <CardHeader>
              <CardTitle>Generated Study Material</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {material && (
                <div
                  className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap font-body"
                  dangerouslySetInnerHTML={{ __html: material.replace(/(\r\n|\n|\r)/gm, "<br>") }}
                />
              )}
              {!loading && !material && (
                <p className="text-muted-foreground text-sm">
                  Your generated study material will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
