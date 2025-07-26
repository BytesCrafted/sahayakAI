// src/app/(pages)/home/page.tsx
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Welcome to Sahayak AI"
        description="Empowering teachers in multi-grade, under-resourced classrooms with the power of Google AI."
      />
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <p className="text-lg text-muted-foreground">
            Sahayak AI is your smart partner in education. Effortlessly
            generate worksheets, lesson plans, study materials, and quizzes
            tailored to the needs of your diverse classroom.
          </p>
          <p className="text-lg text-muted-foreground">
            Our goal is to help under-resourced schools across India, where one
            teacher often handles multiple grades. We provide multilingual AI
            tools to make teaching and learning more effective and engaging.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90"
          >
            <Link href="/dashboard">Start Teaching Smarter</Link>
          </Button>
        </div>
        <div>
          <Image
            src="https://placehold.co/600x400.png"
            alt="Indian Classroom"
            width={600}
            height={400}
            data-ai-hint="indian classroom students"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
