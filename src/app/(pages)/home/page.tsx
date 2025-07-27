// src/app/(pages)/home/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, DocumentData, Timestamp } from "firebase/firestore";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logotype } from "@/components/icons";

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

type GroupedContent = {
  [key: string]: Content[];
};

export default function HomePage() {
  const [user, authLoading] = useAuthState(auth);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [contents, setContents] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch classrooms
          const classroomsQuery = query(collection(db, "classrooms"), where("teacher_id", "==", user.uid));
          const classroomsSnapshot = await getDocs(classroomsQuery);
          const classroomsData = classroomsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Classroom));
          setClassrooms(classroomsData);

          // Fetch contents
          const contentsQuery = query(collection(db, "contents"), where("created_by", "==", user.uid));
          const contentsSnapshot = await getDocs(contentsQuery);
          const contentsData = contentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Content));
          
          // Group contents by content_type
          const grouped = contentsData.reduce((acc: GroupedContent, content) => {
            const type = content.content_type || 'uncategorized';
            if (!acc[type]) {
              acc[type] = [];
            }
            acc[type].push(content);
            return acc;
          }, {});
          setContents(grouped);

        } catch (err: any) {
          console.error("Error fetching data:", err);
          setError("Failed to fetch data. Please try again later.");
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  // Helper to format content type titles
  const formatContentType = (type: string) => {
    return type
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Logotype className="h-8 w-auto" />
      </div>
      {loading || authLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12">
          {/* Classrooms Section */}
          <div>
            <PageHeader
              title="Your Classrooms"
              description="Here is a list of all your classrooms."
            />
            {classrooms.length > 0 ? (
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

          {/* Contents Section */}
          <div>
            <PageHeader
              title="My Content"
              description="All your generated materials in one place."
            />
            {Object.keys(contents).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(contents).map(([type, items]) => (
                  <div key={type}>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">{formatContentType(type)}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item) => (
                        <Card key={item.id} className="flex flex-col">
                          <CardHeader>
                            <CardTitle>{item.content_data?.title || item.topic || 'Untitled'}</CardTitle>
                             <CardDescription>
                              {item.subject} - Grade {item.grade}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow flex flex-col justify-end">
                            <Button asChild variant="outline" className="mt-auto">
                              <Link href={item.content_data?.url || item.content_file_url || '#'} target="_blank" rel="noopener noreferrer">
                                <BookOpen className="mr-2 h-4 w-4" />
                                View Content
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    You haven't generated any content yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface Classroom {
  id: string;
  name: string;
  grade: string;
}
