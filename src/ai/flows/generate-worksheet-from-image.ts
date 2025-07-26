// src/ai/flows/generate-worksheet-from-image.ts
'use server';
/**
 * @fileOverview A worksheet generator AI agent that takes an image.
 *
 * - generateWorksheetFromImage - A function that handles the worksheet generation process.
 * - GenerateWorksheetFromImageInput - The input type for the generateWorksheetFromImage function.
 * - GenerateWorksheetFromImageOutput - The return type for the generateWorksheetFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const API_BASE_URL = 'http://146.148.56.108:8000';

const GenerateWorksheetFromImageInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image to generate a worksheet from, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateWorksheetFromImageInput = z.infer<
  typeof GenerateWorksheetFromImageInputSchema
>;

const GenerateWorksheetFromImageOutputSchema = z.object({
  url: z.string().url(),
});
export type GenerateWorksheetFromImageOutput = z.infer<
  typeof GenerateWorksheetFromImageOutputSchema
>;

export async function generateWorksheetFromImage(
  input: GenerateWorksheetFromImageInput
): Promise<GenerateWorksheetFromImageOutput> {
  return generateWorksheetFromImageFlow(input);
}

const generateWorksheetFromImageFlow = ai.defineFlow(
  {
    name: 'generateWorksheetFromImageFlow',
    inputSchema: GenerateWorksheetFromImageInputSchema,
    outputSchema: GenerateWorksheetFromImageOutputSchema,
  },
  async input => {
    const response = await fetch(`${API_BASE_URL}/generate_worksheet_from_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_data_uri: input.imageDataUri }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const result = await response.json();
    return { url: result.url };
  }
);
