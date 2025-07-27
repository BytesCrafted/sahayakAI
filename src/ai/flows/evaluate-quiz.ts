// src/ai/flows/evaluate-quiz.ts
'use server';
/**
 * @fileOverview A quiz evaluation AI agent.
 *
 * - evaluateQuiz - A function that handles the quiz evaluation process.
 * - EvaluateQuizInput - The input type for the evaluateQuiz function.
 * - EvaluateQuizOutput - The return type for the evaluateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const API_BASE_URL = 'http://146.148.56.108:8000';

const EvaluateQuizInputSchema = z.object({
  student_submission_url: z.string().url(),
  evaluation_json_url: z.string().url(),
});
export type EvaluateQuizInput = z.infer<typeof EvaluateQuizInputSchema>;

const EvaluateQuizOutputSchema = z.any();
export type EvaluateQuizOutput = z.infer<typeof EvaluateQuizOutputSchema>;

export async function evaluateQuiz(
  input: EvaluateQuizInput
): Promise<EvaluateQuizOutput> {
  return evaluateQuizFlow(input);
}

const evaluateQuizFlow = ai.defineFlow(
  {
    name: 'evaluateQuizFlow',
    inputSchema: EvaluateQuizInputSchema,
    outputSchema: EvaluateQuizOutputSchema,
  },
  async (input) => {
    const response = await fetch(`${API_BASE_URL}/evaluate_quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Quiz evaluation failed:", errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  }
);
