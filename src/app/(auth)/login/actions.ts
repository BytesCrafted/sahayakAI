// src/app/(auth)/login/actions.ts
'use server';

import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { config } from 'dotenv';
config();

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY environment variable is not set.");
}

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set.");
}

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: projectId,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

export async function sessionLogin(idToken: string) {
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  try {
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
    cookies().set('__session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
    return { success: true };
  } catch (error) {
    console.error('Failed to create session cookie:', error);
    return { success: false, error: 'Failed to create session cookie.' };
  }
}
