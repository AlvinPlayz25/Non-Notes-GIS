import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { LoadingScreen } from "../ui/loading-spinner";
import { User, Settings, FileText, LogOut, Trash2 } from "lucide-react";
import PageLayout from "../layout/PageLayout";
import TrashBin from "../notes/TrashBin";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, signOut, loading } = useAuth();
  const [userNotes, setUserNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchUserNotes = async () => {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setUserNotes(data || []);
      } catch (err) {
        console.error("Error fetching user notes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserNotes();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || !user) {
    return (
      <PageLayout>
        <LoadingScreen text="Loading profile..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 flex items-end p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    {user.email?.split("@")[0] || "User"}
                  </h1>
                  <p className="text-blue-100">{user.email}</p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="profile" className="p-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notes" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  My Notes
                </TabsTrigger>
                <TabsTrigger value="trash" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Trash Bin
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Account Information
                    </CardTitle>
                    <CardDescription>
                      Your personal account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Account Created
                        </p>
                        <p className="text-gray-900">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {/* Settings page temporarily disabled
                    <Button
                      variant="outline"
                      onClick={() => navigate("/settings")}
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button> */}
                    <Button
                      variant="destructive"
                      onClick={handleSignOut}
                      className="flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      My Uploaded Notes
                    </CardTitle>
                    <CardDescription>
                      Notes you've shared with the community
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="py-8 text-center">
                        <LoadingScreen text="Loading your notes..." />
                      </div>
                    ) : userNotes.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userNotes.map((note) => (
                          <div
                            key={note.id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/notes/${note.id}`)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-blue-800 truncate">
                                {note.title}
                              </h3>
                              {note.is_verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                              {note.description}
                            </p>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                Grade {note.grade} · {note.subject}
                              </span>
                              <span>
                                {note.views} views · {note.likes} likes
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-gray-500 mb-4">
                          You haven't uploaded any notes yet
                        </p>
                        <Button
                          onClick={() => navigate("/notes/create")}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Upload Your First Note
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => navigate("/notes/create")}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Upload New Note
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="trash" className="mt-6">
                <TrashBin />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
