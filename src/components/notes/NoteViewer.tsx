import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Eye, Heart, Share2, Menu } from "lucide-react";
import { supabase } from "../../../supabase/supabase";
import { LoadingSpinner } from "../ui/loading-spinner";
import VerifiedBadge from "./VerifiedBadge";
import { useAuth } from "../../../supabase/auth";
import PageLayout from "../layout/PageLayout";
import NoteActions from "./NoteActions";

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

export default function NoteViewer() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (!id) return;

        // Increment view count
        if (id) {
          try {
            await supabase.rpc("increment_note_views", { note_uuid: id });
          } catch (error) {
            console.error("Error incrementing views:", error);
          }
        }

        // Fetch note data
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setNote(data);
          // Check if current user is the owner of this note
          if (user && data.user_id === user.id) {
            setIsOwner(true);
          }
        }
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to load note. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleLike = async () => {
    if (!user) return;
    if (!note) return;

    try {
      // Check if user already liked this note
      const { data: existingLike } = await supabase
        .from("note_likes")
        .select("*")
        .eq("note_id", note.id)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from("note_likes")
          .delete()
          .eq("note_id", note.id)
          .eq("user_id", user.id);

        // Update note likes count
        await supabase
          .from("notes")
          .update({ likes: note.likes - 1 })
          .eq("id", note.id);

        setNote({ ...note, likes: note.likes - 1 });
      } else {
        // Like
        await supabase.from("note_likes").insert({
          note_id: note.id,
          user_id: user.id,
        });

        // Update note likes count
        await supabase
          .from("notes")
          .update({ likes: note.likes + 1 })
          .eq("id", note.id);

        setNote({ ...note, likes: note.likes + 1 });
      }
    } catch (error) {
      console.error("Error liking/unliking note:", error);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading note..." />
        </div>
      </PageLayout>
    );
  }

  if (error || !note) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Note not found"}
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the note you're looking for. It may have been
              removed or the link might be incorrect.
            </p>
            <Link to="/notes">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Browse Other Notes
              </Button>
            </Link>
          </div>
        </div>
      </PageLayout>
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
    <PageLayout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/notes">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-blue-900 line-clamp-1">
              {note.title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              onClick={() => window.open(note.file_url, "_blank")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {isOwner && (
              <NoteActions
                note={note}
                isOwner={isOwner}
                onUpdate={() => window.location.reload()}
              />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Note Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {note.is_verified && <VerifiedBadge />}
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                >
                  Grade {note.grade}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
                >
                  {note.subject}
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {note.title}
              </h2>
              <p className="text-gray-600 mb-6">{note.description}</p>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 ${user ? "cursor-pointer hover:text-blue-600" : "cursor-not-allowed opacity-70"}`}
                    disabled={!user}
                    title={user ? "Like this note" : "Sign in to like notes"}
                  >
                    <Heart
                      className={`h-5 w-5 ${user ? "hover:fill-blue-600 hover:text-blue-600" : ""}`}
                    />
                    <span>{note.likes}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <Eye className="h-5 w-5" />
                    <span>{note.views}</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Added {formatDate(note.created_at)}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  onClick={() => window.open(note.file_url, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                {!user && (
                  <div className="text-center text-sm text-gray-500">
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Sign in
                    </Link>{" "}
                    to like or save this note
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-4 h-[800px] overflow-hidden">
              <iframe
                src={
                  note.file_url.includes("supabase.co")
                    ? note.file_url
                    : `https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(note.file_url)}`
                }
                className="w-full h-full rounded-lg"
                title={note.title}
                frameBorder="0"
                allow="autoplay; fullscreen"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
