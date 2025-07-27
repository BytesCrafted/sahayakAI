// src/ai/flows/generate-visual-aid.ts
'use server';
/**
 * @fileOverview A visual aid generator AI agent.
 *
 * - generateVisualAid - A function that handles the visual aid generation process.
 * - GenerateVisualAidInput - The input type for the generateVisualAid function.
 * - GenerateVisualAidOutput - The return type for the generateVisualAid function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const API_BASE_URL = 'http://146.148.56.108:8000';

const GenerateVisualAidInputSchema = z.object({
  subject: z.string().min(3, {
    message: 'Subject must be at least 3 characters.',
  }),
  grade: z.string().min(1, {
    message: 'Grade is required.',
  }),
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
  description: z.string().optional(),
});
export type GenerateVisualAidInput = z.infer<
  typeof GenerateVisualAidInputSchema
>;

const GenerateVisualAidOutputSchema = z.object({
  url: z.string().url(),
});
export type GenerateVisualAidOutput = z.infer<
  typeof GenerateVisualAidOutputSchema
>;

export async function generateVisualAid(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  return generateVisualAidFlow(input);
}

const generateVisualAidFlow = ai.defineFlow(
  {
    name: 'generateVisualAidFlow',
    inputSchema: GenerateVisualAidInputSchema,
    outputSchema: GenerateVisualAidOutputSchema,
  },
  async input => {
    const response = await fetch(`${API_BASE_URL}/generate_visual_aid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Visual aid generation failed:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { url: result.url };
  }
);
