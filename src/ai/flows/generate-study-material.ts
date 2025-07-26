// src/ai/flows/generate-study-material.ts
'use server';
/**
 * @fileOverview A study material generator AI agent.
 *
 * - generateStudyMaterial - A function that handles the study material generation process.
 * - GenerateStudyMaterialInput - The input type for the generateStudyMaterial function.
 * - GenerateStudyMaterialOutput - The return type for the generateStudyMaterial function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const API_BASE_URL = 'http://146.148.56.108:8000';

const GenerateStudyMaterialInputSchema = z.object({
  subject: z.string().min(3, {
    message: 'Subject must be at least 3 characters.',
  }),
  grade: z.string().min(1, {
    message: 'Grade is required.',
  }),
  topic: z.string().optional(),
  description: z.string().optional(),
});
export type GenerateStudyMaterialInput = z.infer<
  typeof GenerateStudyMaterialInputSchema
>;

const GenerateStudyMaterialOutputSchema = z.object({
  url: z.string().url(),
});
export type GenerateStudyMaterialOutput = z.infer<
  typeof GenerateStudyMaterialOutputSchema
>;

export async function generateStudyMaterial(
  input: GenerateStudyMaterialInput
): Promise<GenerateStudyMaterialOutput> {
  return generateStudyMaterialFlow(input);
}

const generateStudyMaterialFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialFlow',
    inputSchema: GenerateStudyMaterialInputSchema,
    outputSchema: GenerateStudyMaterialOutputSchema,
  },
  async (input) => {
    const response = await fetch(`${API_BASE_URL}/generate_study_material`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Study material generation failed:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { url: result.url };
  }
);
