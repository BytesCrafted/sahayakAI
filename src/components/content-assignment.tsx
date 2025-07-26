// src/components/content-assignment.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, DocumentData, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { PageHeader } from "./page-header";

export interface ContentDetails {
  pdfUrl: string;
  title: string;
  topic: string;
  subject: string;
  grade: string;
  contentType: string;
  userPrompt: string;
}

interface Classroom {
  id: string;
  name: string;
}

interface ContentAssignmentProps {
  content: ContentDetails;
  onBack: () => void;
}

export function ContentAssignment({ content, onBack }: ContentAssignmentProps) {
  const [user, authLoading] = useAuthState(auth);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const [addToLibrary, setAddToLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
        } catch (error) {
          console.error("Error fetching classrooms:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch classrooms.",
          });
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [user, authLoading, toast]);

  const handleClassroomToggle = (classroomId: string) => {
    setSelectedClassrooms((prev) =>
      prev.includes(classroomId)
        ? prev.filter((id) => id !== classroomId)
        : [...prev, classroomId]
    );
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to save content.",
      });
      return;
    }
    setSaving(true);
    try {
      const saveContent = async (classroomId: string, classroomName: string) => {
        const contentDoc = {
          contentId: Date.now(),
          contentType: content.contentType,
          language: 'english',
          grade: parseInt(content.grade, 10) || 1,
          subject: content.subject,
          topic: content.topic,
          userPrompt: content.userPrompt,
          generatedBy: 'gemini',
          createdBy: user.uid,
          relatedClassroomId: classroomId,
          uploadFileUrl: null,
          contentFileUrl: content.pdfUrl,
          addToLibraryInd: addToLibrary,
          contentData: {
            title: content.title,
            classroomName: classroomName,
            topic: content.topic,
            url: content.pdfUrl,
          },
          createDate: serverTimestamp(),
        };
        await addDoc(collection(db, "contents"), contentDoc);
      };

      if (selectedClassrooms.length > 0) {
        const classroomPromises = selectedClassrooms.map((classroomId) => {
          const classroom = classrooms.find((c) => c.id === classroomId);
          return saveContent(classroomId, classroom?.name || "");
        });
        await Promise.all(classroomPromises);
      } else {
        await saveContent("", "");
      }

      toast({
        title: "Content Saved!",
        description: "Your content has been saved and assigned.",
      });
      router.push("/home");
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save content.",
      });
    } finally {
      setSaving(false);
    }
  };


  return (
    <>
    <PageHeader title="Content Generated" description="Your content is ready. Assign it to your classrooms or save it for later."/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{content.title}</CardTitle>
            <CardDescription>
              {content.subject} - Grade {content.grade}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href={content.pdfUrl} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="mr-2 h-4 w-4" />
                View Content
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign & Save</CardTitle>
            <CardDescription>
              Select classrooms to assign this content to and choose whether to add it to your resource library.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="font-semibold">Assign to Classrooms</Label>
              <div className="mt-2 space-y-2">
                {loading || authLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading classrooms...</span>
                  </div>
                ) : classrooms.length > 0 ? (
                  classrooms.map((classroom) => (
                    <div key={classroom.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`classroom-${classroom.id}`}
                        onCheckedChange={() => handleClassroomToggle(classroom.id)}
                        checked={selectedClassrooms.includes(classroom.id)}
                      />
                      <Label htmlFor={`classroom-${classroom.id}`}>
                        {classroom.name}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    You have no classrooms to assign to.
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="addToLibrary"
                checked={addToLibrary}
                onCheckedChange={(checked) => setAddToLibrary(!!checked)}
              />
              <Label htmlFor="addToLibrary">Add to my Resource Library</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
             <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save & Finish
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
