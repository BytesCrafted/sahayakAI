// src/ai/flows/ask-sahayak.ts
'use server';

/**
 * @fileOverview A question answering AI agent that calls an external API.
 *
 * - askSahayak - A function that handles the question answering process.
 * - AskSahayakInput - The input type for the askSahayak function.
 * - AskSahayakOutput - The return type for the askSahayak function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const API_BASE_URL = 'http://146.148.56.108:8000';

const AskSahayakInputSchema = z.object({
  question: z.string().describe('The question to ask Sahayak.'),
  session_id: z.string().optional().describe("Session ID to continue a conversation."),
  user_id: z.string().optional().describe("User ID for tracking.")
});
export type AskSahayakInput = z.infer<typeof AskSahayakInputSchema>;

const AskSahayakOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  session_id: z.string().describe("The session ID for the conversation.")
});
export type AskSahayakOutput = z.infer<typeof AskSahayakOutputSchema>;

export async function askSahayak(input: AskSahayakInput): Promise<AskSahayakOutput> {
  return askSahayakFlow(input);
}

const askSahayakFlow = ai.defineFlow(
  {
    name: 'askSahayakFlow',
    inputSchema: AskSahayakInputSchema,
    outputSchema: AskSahayakOutputSchema,
  },
  async (input) => {
    const response = await fetch(`${API_BASE_URL}/ask_sahayak`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: input.question,
            session_id: input.session_id,
            user_id: input.user_id,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Ask Sahayak request failed:", errorBody);
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
        answer: result.answer,
        session_id: result.session_id,
    };
  }
);
