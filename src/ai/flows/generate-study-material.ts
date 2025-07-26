// A Genkit flow for generating study material for a specific subject and topic.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @fileOverview Study material generator AI agent.
 *
 * - generateStudyMaterial - A function that handles the generation of study material.
 * - GenerateStudyMaterialInput - The input type for the generateStudyMaterial function.
 * - GenerateStudyMaterialOutput - The return type for the generateStudyMaterial function.
 */

const GenerateStudyMaterialInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate study material.'),
  topic: z.string().describe('The topic for which to generate study material.'),
});
export type GenerateStudyMaterialInput = z.infer<
  typeof GenerateStudyMaterialInputSchema
>;

const GenerateStudyMaterialOutputSchema = z.object({
  studyMaterial: z
    .string()
    .describe('The generated study material in markdown format.'),
});

export type GenerateStudyMaterialOutput = z.infer<
  typeof GenerateStudyMaterialOutputSchema
>;

export async function generateStudyMaterial(
  input: GenerateStudyMaterialInput
): Promise<GenerateStudyMaterialOutput> {
  return generateStudyMaterialFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyMaterialPrompt',
  input: {schema: GenerateStudyMaterialInputSchema},
  output: {schema: GenerateStudyMaterialOutputSchema},
  prompt: `You are an expert teacher creating study material for students.

  Subject: {{{subject}}}
  Topic: {{{topic}}}

  Create study material that covers the topic for students to study. Return the study material in markdown format. Use headings, subheadings, bullet points, and numbered lists to organize the content.`,
});

const generateStudyMaterialFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialFlow',
    inputSchema: GenerateStudyMaterialInputSchema,
    outputSchema: GenerateStudyMaterialOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
