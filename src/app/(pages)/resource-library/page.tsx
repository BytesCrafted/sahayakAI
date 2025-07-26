
// src/app/(pages)/resource-library/page.tsx
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

export default function ResourceLibraryPage() {
  const [user, authLoading] = useAuthState(auth);
  const [contents, setContents] = useState<GroupedContent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const contentsQuery = query(
            collection(db, "contents"), 
            where("created_by", "==", user.uid),
            where("add_to_library_ind", "==", true)
          );
          const contentsSnapshot = await getDocs(contentsQuery);
          const contentsData = contentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Content));
          
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
       <PageHeader
            title="Resource Library"
            description="All your saved materials in one place."
        />
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
                    You haven't added any content to your library yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
      )}
    </div>
  );
}

