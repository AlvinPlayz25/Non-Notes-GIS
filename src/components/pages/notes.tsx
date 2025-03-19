import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NoteGrid from "../notes/NoteGrid";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import PageLayout from "../layout/PageLayout";

export default function NotesPage() {
  const { user } = useAuth();

  return (
    <PageLayout>
      {/* Header with navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 md:hidden">
              <div className="bg-blue-600 p-1 rounded-md">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-xl text-blue-900">
                NonNotes
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-blue-900 ml-4 hidden md:block">
              Browse Notes
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <Link to="/profile">
                <Button variant="ghost" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                      alt={user.email || ""}
                    />
                    <AvatarFallback>
                      {user.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
            )}
            <Link to={user ? "/notes/create" : "/login"}>
              <Button className="rounded-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Upload Note
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="verified">Verified Content</TabsTrigger>
            {user && <TabsTrigger value="my">My Uploads</TabsTrigger>}
            {user && <TabsTrigger value="saved">Saved Notes</TabsTrigger>}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <NoteGrid showFilters={true} />
          </TabsContent>

          <TabsContent value="verified" className="mt-0">
            <NoteGrid showFilters={true} showVerifiedOnly={true} />
          </TabsContent>

          {user && (
            <TabsContent value="my" className="mt-0">
              <NoteGrid showFilters={false} userOnly={true} />
            </TabsContent>
          )}

          {user && (
            <TabsContent value="saved" className="mt-0">
              <NoteGrid showFilters={false} savedOnly={true} />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </PageLayout>
  );
}
