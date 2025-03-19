import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Trash2, RefreshCw, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface DeletedNote {
  id: string;
  original_id: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  file_url: string;
  created_at: string;
  deleted_at: string;
}

export default function TrashBin() {
  const [deletedNotes, setDeletedNotes] = useState<DeletedNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [permanentlyDeleting, setPermanentlyDeleting] = useState<string | null>(
    null,
  );
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchDeletedNotes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("deleted_notes")
          .select("*")
          .eq("user_id", user.id)
          .order("deleted_at", { ascending: false });

        if (error) throw error;
        setDeletedNotes(data || []);
      } catch (error) {
        console.error("Error fetching deleted notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedNotes();
  }, [user]);

  const handleRestore = async (note: DeletedNote) => {
    if (!user) return;
    setRestoring(note.id);

    try {
      // Insert the note back into the notes table
      const { data: restoredNote, error: insertError } = await supabase
        .from("notes")
        .insert({
          id: note.original_id, // Use the original ID if possible
          title: note.title,
          description: note.description,
          grade: note.grade,
          subject: note.subject,
          file_url: note.file_url,
          user_id: user.id,
          created_at: note.created_at,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Delete from deleted_notes
      const { error: deleteError } = await supabase
        .from("deleted_notes")
        .delete()
        .eq("id", note.id);

      if (deleteError) throw deleteError;

      // Update the UI
      setDeletedNotes(deletedNotes.filter((n) => n.id !== note.id));

      toast({
        title: "Note restored",
        description: "Your note has been successfully restored.",
      });
    } catch (error) {
      console.error("Error restoring note:", error);
      toast({
        title: "Restore failed",
        description:
          "There was an error restoring your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRestoring(null);
    }
  };

  const handlePermanentDelete = async (note: DeletedNote) => {
    if (!user) return;
    setPermanentlyDeleting(note.id);

    try {
      // Delete from deleted_notes
      const { error: deleteError } = await supabase
        .from("deleted_notes")
        .delete()
        .eq("id", note.id);

      if (deleteError) throw deleteError;

      // Try to delete the file from trash storage if it exists
      try {
        const fileName = note.file_url.split("/").pop();
        if (fileName) {
          await supabase.storage
            .from("trash")
            .remove([`${note.original_id}/${fileName}`]);
        }
      } catch (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue even if storage deletion fails
      }

      // Update the UI
      setDeletedNotes(deletedNotes.filter((n) => n.id !== note.id));

      toast({
        title: "Note permanently deleted",
        description: "Your note has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error permanently deleting note:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setPermanentlyDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading trash bin..." />
      </div>
    );
  }

  if (deletedNotes.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Trash bin is empty
          </h3>
          <p className="text-gray-600 mb-6">
            Notes you delete will appear here for 30 days before being
            permanently removed.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Trash Bin
          </CardTitle>
          <CardDescription>
            Notes you've deleted in the last 30 days. You can restore them or
            delete them permanently.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deletedNotes.map((note) => (
              <motion.div
                key={note.id}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900 truncate">
                    {note.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-800 border-red-200"
                  >
                    Deleted
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {note.description}
                </p>
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>
                    Grade {note.grade} · {note.subject}
                  </span>
                  <span>Deleted on {formatDate(note.deleted_at)}</span>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => handleRestore(note)}
                    disabled={!!restoring}
                  >
                    {restoring === note.id ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Restoring...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3" />
                        Restore
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handlePermanentDelete(note)}
                    disabled={!!permanentlyDeleting}
                  >
                    {permanentlyDeleting === note.id ? (
                      <>
                        <Trash2 className="h-3 w-3 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3 w-3" />
                        Delete Permanently
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
