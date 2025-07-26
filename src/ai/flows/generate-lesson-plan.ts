// src/ai/flows/generate-lesson-plan.ts
'use server';
/**
 * @fileOverview A lesson plan generator AI agent.
 *
 * - generateLessonPlan - A function that handles the lesson plan generation process.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const API_BASE_URL = 'http://146.148.56.108:8000';

const GenerateLessonPlanInputSchema = z.object({
  subject: z.string().min(3, {
    message: 'Subject must be at least 3 characters.',
  }),
  grade: z.string().min(1, {
    message: 'Grade is required.',
  }),
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
});
export type GenerateLessonPlanInput = z.infer<
  typeof GenerateLessonPlanInputSchema
>;

const GenerateLessonPlanOutputSchema = z.object({
  url: z.string().url(),
});
export type GenerateLessonPlanOutput = z.infer<
  typeof GenerateLessonPlanOutputSchema
>;

export async function generateLessonPlan(
  input: GenerateLessonPlanInput
): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async input => {
    const response = await fetch(`${API_BASE_URL}/generate_lesson_plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { url: result.url };
  }
);
