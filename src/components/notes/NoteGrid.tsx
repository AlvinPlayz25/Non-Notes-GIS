import { useState, useEffect } from "react";
import NoteCard from "./NoteCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "../../../supabase/supabase";
import { LoadingSpinner } from "../ui/loading-spinner";
import { useAuth } from "../../../supabase/auth";
import { motion } from "framer-motion";

interface Note {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  is_verified: boolean;
  likes: number;
  views: number;
  file_url: string;
  created_at: string;
}

interface NoteGridProps {
  showFilters?: boolean;
  showVerifiedOnly?: boolean;
  limit?: number;
  userOnly?: boolean;
  savedOnly?: boolean;
}

export default function NoteGrid({
  showFilters = true,
  showVerifiedOnly = false,
  limit,
  userOnly = false,
  savedOnly = false,
}: NoteGridProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        let query = supabase.from("notes").select("*");

        // Apply filters
        if (showVerifiedOnly) {
          query = query.eq("is_verified", true);
        }

        if (userOnly && user) {
          query = query.eq("user_id", user.id);
        }

        if (savedOnly && user) {
          const { data: savedNotes } = await supabase
            .from("saved_notes")
            .select("note_id")
            .eq("user_id", user.id);

          if (savedNotes && savedNotes.length > 0) {
            const savedNoteIds = savedNotes.map((item) => item.note_id);
            query = query.in("id", savedNoteIds);
          } else {
            // No saved notes, return empty array
            setNotes([]);
            setLoading(false);
            return;
          }
        }

        // Apply grade filter if selected
        if (selectedGrade !== "all") {
          query = query.eq("grade", parseInt(selectedGrade));
        }

        // Apply subject filter if selected
        if (selectedSubject !== "all") {
          query = query.eq("subject", selectedSubject);
        }

        // Apply limit if provided
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (data) {
          // Transform data to match component props
          const transformedData = data.map((note) => ({
            ...note,
            isVerified: note.is_verified,
          }));
          setNotes(transformedData);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [
    showVerifiedOnly,
    userOnly,
    savedOnly,
    selectedGrade,
    selectedSubject,
    limit,
    user,
  ]);

  // Filter notes based on selections (client-side filtering for tabs)
  const getFilteredNotes = (sortType: string) => {
    let sortedNotes = [...notes];

    switch (sortType) {
      case "new":
        // Sort by creation date (newest first)
        sortedNotes.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "top":
        // Sort by views
        sortedNotes.sort((a, b) => b.views - a.views);
        break;
      case "hot":
      default:
        // Sort by likes
        sortedNotes.sort((a, b) => b.likes - a.likes);
        break;
    }

    return sortedNotes;
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading notes..." />
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {userOnly
              ? "You haven't uploaded any notes yet"
              : savedOnly
                ? "You haven't saved any notes yet"
                : "No notes found"}
          </h3>
          <p className="text-gray-600 mb-6">
            {userOnly
              ? "Share your knowledge by uploading your first note"
              : savedOnly
                ? "Browse notes and save them to access them later"
                : "Try adjusting your filters or check back later"}
          </p>
          {userOnly && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => (window.location.href = "/notes/create")}
            >
              Upload Note
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showFilters && (
        <div className="mb-6">
          <Tabs defaultValue="hot" className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="hot">Hot</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="top">Top Today</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    {[5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {[
                      "Math",
                      "Science",
                      "English",
                      "Social Science",
                      "Biology",
                      "Chemistry",
                      "Physics",
                    ].map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="hot" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {getFilteredNotes("hot").map((note) => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    description={note.description}
                    grade={note.grade}
                    subject={note.subject}
                    isVerified={note.is_verified}
                    likes={note.likes}
                    views={note.views}
                    file_url={note.file_url}
                  />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {getFilteredNotes("new").map((note) => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    description={note.description}
                    grade={note.grade}
                    subject={note.subject}
                    isVerified={note.is_verified}
                    likes={note.likes}
                    views={note.views}
                    file_url={note.file_url}
                  />
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="top" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {getFilteredNotes("top").map((note) => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    description={note.description}
                    grade={note.grade}
                    subject={note.subject}
                    isVerified={note.is_verified}
                    likes={note.likes}
                    views={note.views}
                    file_url={note.file_url}
                  />
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {!showFilters && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              description={note.description}
              grade={note.grade}
              subject={note.subject}
              isVerified={note.is_verified}
              likes={note.likes}
              views={note.views}
              file_url={note.file_url}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
