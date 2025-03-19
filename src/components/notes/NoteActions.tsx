import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2 } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NoteActionsProps {
  note: {
    id: string;
    title: string;
    description: string;
    grade: number;
    subject: string;
    file_url: string;
  };
  isOwner: boolean;
  onUpdate?: () => void;
}

export default function NoteActions({
  note,
  isOwner,
  onUpdate,
}: NoteActionsProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: note.title,
    description: note.description,
    grade: note.grade.toString(),
    subject: note.subject,
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isOwner) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: formData.title,
          description: formData.description,
          grade: parseInt(formData.grade),
          subject: formData.subject,
          updated_at: new Date().toISOString(),
        })
        .eq("id", note.id);

      if (error) throw error;

      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      });

      setEditDialogOpen(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      // Get the file path from the URL
      const fileUrl = note.file_url;
      const filePath = fileUrl.includes("storage/v1/object/public/")
        ? fileUrl.split("storage/v1/object/public/")[1]
        : null;

      // Delete the note from the database
      const { error: deleteError } = await supabase
        .from("notes")
        .delete()
        .eq("id", note.id);

      if (deleteError) throw deleteError;

      // If we have a file path and it's in our storage, move it to trash
      if (filePath) {
        // Extract bucket and path
        const [bucket, ...pathParts] = filePath.split("/");
        const path = pathParts.join("/");

        if (bucket === "notes" && path) {
          try {
            // Download the file from notes bucket
            const { data: fileData, error: downloadError } =
              await supabase.storage.from("notes").download(path);

            if (downloadError) throw downloadError;

            if (fileData) {
              // Upload to trash bucket with original note ID as folder
              const { error: uploadError } = await supabase.storage
                .from("trash")
                .upload(`${note.id}/${path}`, fileData);

              if (uploadError) throw uploadError;
            }
          } catch (fileError) {
            console.error("Error handling file:", fileError);
            // Continue with deletion even if file handling fails
          }
        }
      }

      toast({
        title: "Note deleted",
        description: "Your note has been moved to the trash bin.",
      });

      // Redirect to notes page
      navigate("/notes");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
          onClick={() => setEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50"
          onClick={() => setDeleteDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your note details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) => handleSelectChange("grade", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    handleSelectChange("subject", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move your note to the trash bin. You can restore it
              later from your profile page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
