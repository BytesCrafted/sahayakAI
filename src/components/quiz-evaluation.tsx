// src/components/quiz-evaluation.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/upload";
import { evaluateQuiz } from "@/ai/flows/evaluate-quiz";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "./page-header";
import { LoadingAnimation } from "./loading-animation";
import {
  ArrowLeft,
  Link as LinkIcon,
  UploadCloud,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const FormSchema = z.object({
  submission: z
    .any()
    .refine((files) => files?.length > 0, "File is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "Only JPG, PNG, or PDF files are accepted."
    ),
});

export interface QuizDetails {
  pdfUrl: string;
  evaluationJsonUrl: string;
  title: string;
  topic: string;
  subject: string;
  grade: string;
}

interface QuizEvaluationProps {
  quiz: QuizDetails;
  onBack: () => void;
}

export function QuizEvaluation({ quiz, onBack }: QuizEvaluationProps) {
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(FormSchema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = form;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("submission", event.target.files, { shouldValidate: true });
      setFileName(file.name);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setEvaluationResult(null);

    try {
      const submissionFile = data.submission[0];
      const uploadResponse = await uploadFile(submissionFile);

      if (!uploadResponse.url) {
        throw new Error("File upload failed.");
      }

      const result = await evaluateQuiz({
        student_submission_url: uploadResponse.url,
        evaluation_json_url: quiz.evaluationJsonUrl,
      });

      setEvaluationResult(result);
      toast({
        title: "Evaluation Complete!",
        description: "The student's submission has been evaluated.",
      });
    } catch (error: any) {
      console.error("Evaluation failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to evaluate the quiz.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Quiz Evaluation"
        description="Upload a student's submission to evaluate it against the generated quiz."
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
            <CardDescription>
              {quiz.subject} - Grade {quiz.grade}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href={quiz.pdfUrl} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="mr-2 h-4 w-4" />
                View Quiz PDF
              </Link>
            </Button>
          </CardContent>
        </Card>

        {!evaluationResult ? (
          <Card>
            <CardHeader>
              <CardTitle>Upload Submission</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <Controller
                  name="submission"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="dropzone-file">Student's Answer Sheet</Label>
                      <div className="flex flex-col items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                              {fileName || (
                                <>
                                  <span className="font-semibold text-accent">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG or PDF (MAX. 5MB)
                            </p>
                          </div>
                          <Input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept={ACCEPTED_FILE_TYPES.join(",")}
                          />
                        </label>
                      </div>
                      {errors.submission && (
                        <p className="text-sm font-medium text-destructive">
                          {errors.submission.message as string}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
                <Button type="submit" disabled={!isValid || loading}>
                  {loading && <LoadingAnimation />}
                  Evaluate Submission
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Results</CardTitle>
              <CardDescription>
                Detailed breakdown of the student's performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-lg font-semibold">Total Score</p>
                <p className="text-4xl font-bold text-primary">
                  {evaluationResult.overall_feedback?.total_marks_scored} / {" "}
                  {evaluationResult.overall_feedback?.total_marks_possible}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Overall Feedback:</h3>
                <p className="text-muted-foreground">
                   {evaluationResult.overall_feedback?.feedback}
                </p>
              </div>

              <div className="space-y-4">
                 <h3 className="font-semibold">Question Breakdown:</h3>
                 <div className="space-y-4">
                    {evaluationResult.results?.map((item: any, index: number) => (
                        <Card key={index}>
                            <CardHeader>
                               <CardTitle className="text-base">Question {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center">
                                    {item.is_correct ? (
                                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                    ) : (
                                        <XCircle className="h-5 w-5 mr-2 text-destructive" />
                                    )}
                                    <p className="font-medium">
                                        Score: {item.marks_scored} / {item.total_marks}
                                    </p>
                                </div>
                                 <p><span className="font-semibold">Feedback: </span>{item.feedback}</p>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
              </div>
            </CardContent>
             <CardFooter>
                <Button onClick={onBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Generator
                </Button>
              </CardFooter>
          </Card>
        )}
      </div>
    </>
  );
}
