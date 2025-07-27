// src/app/page.tsx
"use client";
import { Button } from '@/components/ui/button';
import { Logotype } from '@/components/icons';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { LoadingAnimation } from '@/components/loading-animation';

export default function Home() {
  const [user, loading] = useAuthState(auth);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center justify-center" aria-label="SahayakAI Home">
          <Logotype className="h-6 w-auto" />
        </Link>
        <nav>
          {loading ? (
             <LoadingAnimation />
          ) : user ? (
            <UserNav />
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Revolutionizing Education with AI
                  </h1>
                  <p className="max-w-[700px] text-muted-foreground md:text-xl">
                    SahayakAI is an AI-powered platform designed to assist educators and students with a suite of tools including lesson plan generation, quiz creation, and study material summarization.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/dashboard">Get Started</Link>
                  </Button>
                  <Button asChild variant="secondary">
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <img
                src="/sahayak_logo.png"
                width="300"
                height="300"
                alt="SahayakAI Logo"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-contain sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
