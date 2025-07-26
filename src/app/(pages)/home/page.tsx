// src/app/(pages)/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, DocumentData } from "firebase/firestore";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface Classroom {
  id: string;
  name: string;
  grade: string;
}

export default function HomePage() {
  const [user, authLoading] = useAuthState(auth);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      if (user) {
        try {
          const q = query(collection(db, "classrooms"), where("teacher_id", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const classroomsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Classroom));
          setClassrooms(classroomsData);
        } catch (err: any) {
          console.error("Error fetching classrooms:", err);
          setError("Failed to fetch classrooms. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [user, authLoading]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Your Classrooms"
        description="Here is a list of all your classrooms."
      />
      
      {loading || authLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : classrooms.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card key={classroom.id}>
              <CardHeader>
                <CardTitle>{classroom.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Grade: {classroom.grade}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              You haven't been assigned any classrooms yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
