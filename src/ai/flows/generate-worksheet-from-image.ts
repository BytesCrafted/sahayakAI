// src/ai/flows/generate-worksheet-from-image.ts
'use server';

/**
 * @fileOverview A worksheet generator AI agent that takes an image and returns a downloadable PDF link.
 *
 * - generateWorksheetFromImage - A function that handles the worksheet generation process.
 * - GenerateWorksheetFromImageInput - The input type for the generateWorksheetFromImage function.
 * - GenerateWorksheetFromImageOutput - The return type for the generateWorksheetFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const API_BASE_URL = 'http://146.148.56.108:8000';

/**
 * Input schema for generating a worksheet from an image.
 */
const GenerateWorksheetFromImageInputSchema = z.object({
  image_base64: z
    .string()
    .describe(
      "An image as a Base64 data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image_filename: z.string().describe("Original name of the uploaded image"),
  grade: z.string().describe("Grade level for the worksheet (1-12)"),
  subject: z.string().describe("Subject area (e.g., Math, Science)"),
  topic: z.string().optional().describe("Specific topic (optional)"),
  description: z.string().optional().describe("Additional requirements (optional)"),
});
export type GenerateWorksheetFromImageInput = z.infer<typeof GenerateWorksheetFromImageInputSchema>;

/**
 * Output schema for the worksheet generation process.
 */
const GenerateWorksheetFromImageOutputSchema = z.object({
  url: z.string().url().describe("Firebase URL to the generated worksheet PDF"),
});
export type GenerateWorksheetFromImageOutput = z.infer<typeof GenerateWorksheetFromImageOutputSchema>;

/**
 * Public function to generate a worksheet from an image input.
 */
export async function generateWorksheetFromImage(
  input: GenerateWorksheetFromImageInput
): Promise<GenerateWorksheetFromImageOutput> {
  return generateWorksheetFromImageFlow(input);
}

/**
 * Flow that defines the AI operation for generating worksheets.
 */
const generateWorksheetFromImageFlow = ai.defineFlow(
  {
    name: 'generateWorksheetFromImageFlow',
    inputSchema: GenerateWorksheetFromImageInputSchema,
    outputSchema: GenerateWorksheetFromImageOutputSchema,
  },
  async (input) => {
    try {
      // Strip the Base64 prefix (data URI)
      const base64Data = input.image_base64.substring(
        input.image_base64.indexOf(',') + 1
      );

      const payload = {
        image_base64: base64Data,
        image_filename: input.image_filename,
        grade: input.grade,
        subject: input.subject,
        topic: input.topic ?? "", // ensure field exists
        description: input.description ?? "", // ensure field exists
      };

      const response = await fetch(`${API_BASE_URL}/generate_worksheet_from_image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorBody}`
        );
      }

      const result = await response.json();
      return { url: result.url };
    } catch (err: any) {
      console.error('Error generating worksheet:', err);
      throw new Error(`Failed to generate worksheet: ${err.message}`);
    }
  }
);
