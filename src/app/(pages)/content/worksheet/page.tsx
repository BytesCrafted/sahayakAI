
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Sparkles, UploadCloud } from "lucide-react";

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
import { generateWorksheetFromImage } from "@/ai/flows/generate-worksheet-from-image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContentAssignment, ContentDetails } from "@/components/content-assignment";
import { LoadingAnimation } from "@/components/loading-animation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const FormSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length > 0, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg and .png files are accepted."
    ),
  grade: z.string().min(1, { message: "Grade is required." }),
  subject: z.string().min(3, { message: "Subject is required." }),
  topic: z.string().min(3, { message: "Topic must be at least 3 characters." }),
  description: z.string().optional(),
});

export default function GenerateWorksheetPage() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentDetails | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: undefined,
      grade: "",
      subject: "",
      topic: "",
      description: "",
    },
  });

  const toDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", event.target.files, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setGeneratedContent(null);

    try {
      const imageFile = data.image[0];
      const imageDataUri = await toDataURL(imageFile);

      const result = await generateWorksheetFromImage({
        image_base64: imageDataUri,
        image_filename: imageFile.name,
        grade: data.grade,
        subject: data.subject,
        topic: data.topic,
        description: data.description,
      });

      if (result.url) {
        setGeneratedContent({
          pdfUrl: result.url,
          title: data.topic,
          topic: data.topic,
          subject: data.subject,
          grade: data.grade,
          contentType: "worksheet",
          userPrompt: data.description || `Worksheet from image: ${imageFile.name}`,
        });
        toast({
          title: "Success!",
          description: "Your worksheet has been generated.",
        });
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to generate worksheet. Please try again.",
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
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Sahayak - Worksheet from Image"
        description="Upload a textbook image to generate a worksheet in just one click."
      />
      <Card>
        <CardHeader>
          <CardTitle>Worksheet Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worksheet Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors"
                        >
                          {preview ? (
                            <img
                              src={preview}
                              alt="Image preview"
                              className="object-contain h-full w-full rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold text-accent">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG or JPG (MAX. 5MB)
                              </p>
                            </div>
                          )}
                          <Input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                          />
                        </label>
                      </div>
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Science" {...field} />
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
                        placeholder="e.g., The Solar System"
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
                        placeholder="e.g., Create 5 multiple-choice questions and 2 short-answer questions."
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
                disabled={!form.formState.isValid || loading}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Worksheet
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
