// src/ai/flows/ask-sahayak.ts
'use server';

/**
 * @fileOverview A question answering AI agent.
 *
 * - askSahayak - A function that handles the question answering process.
 * - AskSahayakInput - The input type for the askSahayak function.
 * - AskSahayakOutput - The return type for the askSahayak function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskSahayakInputSchema = z.object({
  question: z.string().describe('The question to ask Sahayak.'),
});
export type AskSahayakInput = z.infer<typeof AskSahayakInputSchema>;

const AskSahayakOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AskSahayakOutput = z.infer<typeof AskSahayakOutputSchema>;

export async function askSahayak(input: AskSahayakInput): Promise<AskSahayakOutput> {
  return askSahayakFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askSahayakPrompt',
  input: {schema: AskSahayakInputSchema},
  output: {schema: AskSahayakOutputSchema},
  prompt: `You are Sahayak, a helpful AI assistant. Please answer the following question to the best of your ability.\n\nQuestion: {{{question}}}`,
});

const askSahayakFlow = ai.defineFlow(
  {
    name: 'askSahayakFlow',
    inputSchema: AskSahayakInputSchema,
    outputSchema: AskSahayakOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
