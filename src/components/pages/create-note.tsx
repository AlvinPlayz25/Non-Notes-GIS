import NoteUploader from "../notes/NoteUploader";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function CreateNotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/notes" className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1 rounded-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-xl text-blue-900">
                NonNotes
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-900 ml-4 hidden md:block">
              Create Note
            </h1>
          </div>
        </div>
      </header>

      <main>
        <NoteUploader />
      </main>
    </div>
  );
}
