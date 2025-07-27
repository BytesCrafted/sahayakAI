import { config } from 'dotenv';
config({ path: '.env' });

import '@/ai/flows/ask-sahayak.ts';
import '@/ai/flows/generate-study-material.ts';
import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/generate-lesson-plan.ts';
import '@/ai/flows/generate-worksheet-from-image.ts';
import '@/ai/flows/generate-visual-aid.ts';
