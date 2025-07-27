// src/app/(pages)/classrooms/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { BookOpen, Users, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingAnimation } from "@/components/loading-animation";


interface Classroom {
  id: string;
  name: string;
  grade: string;
  subject: string;
  student_ids?: string[];
}

interface Content {
  id: string;
  add_to_library_ind: boolean;
  content_data: {
    classroomName: string;
    title: string;
    topic: string;
    url: string;
  };
  content_file_url: string;
  content_id: number;
  content_type: string;
  create_date: string;
  created_by: string;
  generated_by: string;
  grade: number;
  language: string;
  related_classroom_id: string;
  subject: string;
  topic: string;
  upload_file_url: string | null;
  user_prompt: string;
}

export default function ClassroomDetailPage() {
  const [user, authLoading] = useAuthState(auth);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const classroomId = params.id as string;

  useEffect(() => {
    const fetchData = async () => {
      if (user && classroomId) {
        setLoading(true);
        try {
          // Fetch classroom details
          const classroomRef = doc(db, "classrooms", classroomId);
          const classroomSnap = await getDoc(classroomRef);

          if (!classroomSnap.exists()) {
            setError("Classroom not found.");
            return;
          }
          const classroomData = { id: classroomSnap.id, ...classroomSnap.data() } as Classroom;
          setClassroom(classroomData);

          // Fetch assigned content
          const contentsQuery = query(
            collection(db, "contents"),
            where("related_classroom_id", "==", classroomId)
          );
          const contentsSnapshot = await getDocs(contentsQuery);
          const contentsData = contentsSnapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as Content)
          );
          setContents(contentsData);
        } catch (err: any) {
          console.error("Error fetching classroom data:", err);
          setError("Failed to fetch classroom data.");
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
         setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, classroomId]);

   // Helper to format content type titles
  const formatContentType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingAnimation />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!classroom) {
    return (
       <Card>
        <CardHeader>
           <Button asChild variant="outline">
              <Link href="/home">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Classroom data could not be loaded.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-12">
      <Card>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-3xl font-bold">{classroom.name}</CardTitle>
                    <CardDescription>
                        {classroom.subject} - Grade {classroom.grade}
                    </CardDescription>
                </div>
                 <Button asChild variant="outline">
                    <Link href="/home">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Link>
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4">
                <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-5 w-5" />
                    <span>{classroom.student_ids?.length || 0} Students</span>
                </div>
                <Button variant="secondary">View Students</Button>
            </div>
        </CardContent>
      </Card>

      <div>
        <PageHeader
          title="Content Feed"
          description="All materials assigned to this classroom."
        />
        {contents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{item.content_data?.title || item.topic || "Untitled"}</CardTitle>
                  <CardDescription>
                    {formatContentType(item.content_type)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
                  <Button asChild variant="outline" className="mt-auto">
                    <Link
                      href={item.content_data?.url || item.content_file_url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Content
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                No content has been assigned to this classroom yet.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
