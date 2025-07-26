// src/ai/flows/ask-sahayak.ts
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { config } from 'dotenv';
config();

const API_BASE_URL = 'http://146.148.56.108:8000';

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY environment variable is not set.");
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.");
}

// ✅ Initialize Firebase Admin once
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

const AskSahayakInputSchema = z.object({
  question: z.string().describe('The question to ask Sahayak.')
});
export type AskSahayakInput = z.infer<typeof AskSahayakInputSchema>;

const AskSahayakOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
  session_id: z.string().describe('The session ID for the conversation.')
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
    const cookieStore = cookies();
    const token = cookieStore.get('__session')?.value;

    if (!token) {
      throw new Error('User not authenticated');
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const requestBody: { question: string; user_id: string; session_id?: string | null } = {
      question: input.question,
      user_id: userId,
      session_id: null,
    };

    const response = await fetch(`${API_BASE_URL}/ask_sahayak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Ask Sahayak request failed:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      answer: result.response,
      session_id: result.session_id,
    };
  }
);
