import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Upload, FileText, Info } from "lucide-react";
import PageLayout from "../layout/PageLayout";
import UploadGuidelines from "./UploadGuidelines";

export default function NoteUploader() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [grade, setGrade] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check if file is PDF
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are supported");
        return;
      }
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to upload notes");
      return;
    }

    if (!title || !description || !grade || !subject || !file) {
      setError("Please fill in all fields and upload a PDF file");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Generate a unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("notes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: "application/pdf",
        });

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("notes").getPublicUrl(filePath);

      // Create note record in database
      const { data: noteData, error: noteError } = await supabase
        .from("notes")
        .insert({
          title,
          description,
          grade: parseInt(grade),
          subject,
          file_url: publicUrl,
          user_id: user.id,
          likes: 0,
          views: 0,
          is_verified: false,
        })
        .select();

      if (noteError) throw noteError;

      // Redirect to the newly created note
      navigate(`/notes/${noteData[0].id}`);
    } catch (err) {
      console.error("Error uploading note:", err);
      if (err.message && err.message.includes("bucket")) {
        setError("Storage bucket not found. Please contact support.");
      } else if (err.message && err.message.includes("permission")) {
        setError(
          "You don't have permission to upload files. Please sign in again.",
        );
      } else {
        setError(`Upload failed: ${err.message || "Please try again"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign in required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to upload notes.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Upload a New Note
          </h1>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Form
              </TabsTrigger>
              <TabsTrigger
                value="guidelines"
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                Guidelines & Rules
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe what these notes cover. If uploading scanned images, please mention if they are clear and legible."
                      disabled={loading}
                      required
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade Level</Label>
                      <Select
                        value={grade}
                        onValueChange={setGrade}
                        disabled={loading}
                      >
                        <SelectTrigger id="grade">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                            <SelectItem key={g} value={g.toString()}>
                              Grade {g}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={subject}
                        onValueChange={setSubject}
                        disabled={loading}
                      >
                        <SelectTrigger id="subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Math",
                            "Science",
                            "English",
                            "History",
                            "Biology",
                            "Chemistry",
                            "Physics",
                          ].map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">PDF File</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {file ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="h-6 w-6 text-blue-600" />
                          <span className="font-medium text-gray-900">
                            {file.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFile(null)}
                            disabled={loading}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-500 mb-2">
                            Drag and drop your PDF file here, or click to browse
                          </p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                            disabled={loading}
                          >
                            Select PDF
                          </Button>
                        </div>
                      )}
                      <input
                        id="file-upload"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Only PDF files. Maximum size: 10MB.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" text="Uploading..." />
                    ) : (
                      "Upload Note"
                    )}
                  </Button>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="guidelines" className="mt-0">
              <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
                <UploadGuidelines />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
}
