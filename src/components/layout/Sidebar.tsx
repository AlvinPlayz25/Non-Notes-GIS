import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  BookOpen,
  FileText,
  User,
  Settings,
  HelpCircle,
  Upload,
  CheckCircle,
  Star,
} from "lucide-react";
import { useAuth } from "../../../supabase/auth";

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string, query?: Record<string, string>) => {
    const isPathActive = location.pathname === path;

    // If no query params to check, just return path match
    if (!query) return isPathActive;

    // If path doesn't match, return false immediately
    if (!isPathActive) return false;

    // Check if query params match
    const searchParams = new URLSearchParams(location.search);
    return Object.entries(query).every(
      ([key, value]) => searchParams.get(key) === value,
    );
  };

  return (
    <div className="hidden md:block w-[240px] h-full bg-white/80 backdrop-blur-md border-r border-gray-200 flex-shrink-0">
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="bg-blue-600 p-1 rounded-md">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <span className="font-medium text-xl text-blue-900">NonNotes</span>
        </Link>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="space-y-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/notes">
              <Button
                variant={isActive("/notes") ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Browse Notes
              </Button>
            </Link>
            <Link to="/notes/create">
              <Button
                variant={isActive("/notes/create") ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
              >
                <Upload className="h-4 w-4" />
                Upload Note
              </Button>
            </Link>

            {user && (
              <>
                <Separator className="my-3" />
                <p className="text-xs font-medium px-3 py-1 text-gray-500 uppercase tracking-wider">
                  My Account
                </p>
                <Link to="/profile">
                  <Button
                    variant={isActive("/profile") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                {/* Settings page temporarily disabled
                <Link to="/settings">
                  <Button
                    variant={isActive("/settings") ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Button>
                </Link> */}
              </>
            )}

            <Separator className="my-3" />
            <p className="text-xs font-medium px-3 py-1 text-gray-500 uppercase tracking-wider">
              Categories
            </p>
            <Link to="/notes?tab=verified">
              <Button
                variant={
                  isActive("/notes", { tab: "verified" })
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
                Verified Content
              </Button>
            </Link>
            <Link to="/notes?grade=9">
              <Button
                variant={
                  isActive("/notes", { grade: "9" }) ? "secondary" : "ghost"
                }
                className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
              >
                <Star className="h-4 w-4 text-blue-600" />
                Grade 9
              </Button>
            </Link>
            <Link to="/notes?subject=Math">
              <Button
                variant={
                  isActive("/notes", { subject: "Math" })
                    ? "secondary"
                    : "ghost"
                }
                className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
              >
                <Star className="h-4 w-4 text-purple-600" />
                Math
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Link to="/about">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 h-10 rounded-xl text-sm font-medium"
          >
            <HelpCircle className="h-4 w-4" />
            About NonNotes
          </Button>
        </Link>
      </div>
    </div>
  );
}
