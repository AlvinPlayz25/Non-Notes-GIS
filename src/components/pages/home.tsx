import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[1200px] mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl text-blue-600">
              NonNotes
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm hover:text-blue-600"
                  >
                    My Notes
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => navigate("/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero section */}
        <section className="py-20 text-center bg-gradient-to-b from-white to-blue-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-5xl font-bold tracking-tight mb-2 text-blue-900">
              NonNotes
            </h2>
            <h3 className="text-2xl font-medium text-gray-600 mb-6">
              Class notes sharing platform for students grades 6-12
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover, share, and access class notes organized by subject and
              grade level. Collaborate with peers and find verified content to
              help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <Link to="/signup">
                <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6 h-auto">
                  Start Sharing Notes
                </Button>
              </Link>
              <Link to="/notes">
                <Button
                  variant="outline"
                  className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-8 py-6 h-auto"
                >
                  Browse Notes
                </Button>
              </Link>
            </div>
            <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=80"
                alt="Students collaborating"
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-white text-center">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-4xl font-bold tracking-tight mb-2 text-blue-900">
              How It Works
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-12">
              Simple, intuitive, and designed for students
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Discover Notes
                </h4>
                <p className="text-gray-600">
                  Browse through our clean feed interface with filtering options
                  like Hot, New, and Top today. Find notes organized by grade
                  level and subject.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Share Your Notes
                </h4>
                <p className="text-gray-600">
                  Upload your class notes with Google Drive integration. Add a
                  title, description, and categorize by grade and subject for
                  others to find.
                </p>
              </div>

              <div className="bg-blue-50 p-8 rounded-2xl shadow-sm text-left">
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold mb-3 text-blue-900">
                  Verified Content
                </h4>
                <p className="text-gray-600">
                  Access admin-approved notes in our verified content section
                  for quality assurance. Read notes directly in our embedded
                  file viewer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Note Cards Preview */}
        <section className="py-20 bg-blue-50">
          <div className="max-w-[1200px] mx-auto px-4">
            <h2 className="text-4xl font-bold tracking-tight mb-2 text-blue-900 text-center">
              Featured Notes
            </h2>
            <h3 className="text-xl font-medium text-gray-600 mb-12 text-center">
              Popular content from our community
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Note Card 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Verified
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">
                      Grade 9
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">
                      Biology
                    </span>
                  </div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-1">
                    Cell Structure and Function
                  </h5>
                  <p className="text-gray-600 text-sm mb-4">
                    Comprehensive notes on cell organelles, their functions, and
                    cellular processes.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      245
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      1.2k
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Note Card 2 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Grade 11
                    </span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">
                      Chemistry
                    </span>
                  </div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-1">
                    Periodic Table Trends
                  </h5>
                  <p className="text-gray-600 text-sm mb-4">
                    Detailed notes on periodic trends including
                    electronegativity, atomic radius, and ionization energy.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      178
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      856
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Note Card 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Verified
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">
                      Grade 8
                    </span>
                    <span className="bg-red-100 text-red-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded-full">
                      Math
                    </span>
                  </div>
                  <h5 className="text-xl font-semibold text-gray-900 mb-1">
                    Algebra Fundamentals
                  </h5>
                  <p className="text-gray-600 text-sm mb-4">
                    Core concepts of algebra including equations, inequalities,
                    and graphing linear functions.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      312
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      1.5k
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link to="/notes">
                <Button className="rounded-full bg-blue-600 text-white hover:bg-blue-700 text-md px-6 py-2">
                  Browse All Notes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-[1200px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* File Viewer Feature */}
              <div className="bg-blue-50 rounded-2xl p-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight mb-3 text-blue-900">
                  Embedded File Viewer
                </h2>
                <p className="text-gray-600 mb-6">
                  Read notes directly in our app without downloading. Our
                  embedded viewer supports various file formats for seamless
                  studying.
                </p>
                <div className="bg-white rounded-xl shadow-md p-4 overflow-hidden">
                  <div className="bg-gray-100 h-8 w-full rounded-md mb-3 flex items-center px-3">
                    <div className="h-3 w-3 rounded-full bg-red-400 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                    <div className="h-4 w-40 bg-gray-200 rounded-sm ml-auto"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded-sm w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-4/6"></div>
                    <div className="h-20 bg-gray-200 rounded-sm w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-sm w-3/6"></div>
                  </div>
                </div>
              </div>

              {/* Google Drive Integration */}
              <div className="bg-blue-50 rounded-2xl p-8 text-left">
                <h2 className="text-3xl font-bold tracking-tight mb-3 text-blue-900">
                  Google Drive Integration
                </h2>
                <p className="text-gray-600 mb-6">
                  Seamlessly connect with Google Drive to upload and share your
                  notes. Reliable file hosting with direct download options.
                </p>
                <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
                  <div className="flex items-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 87.3 78"
                      className="h-10 w-10 mr-3"
                    >
                      <path
                        d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
                        fill="#0066da"
                      />
                      <path
                        d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
                        fill="#00ac47"
                      />
                      <path
                        d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
                        fill="#ea4335"
                      />
                      <path
                        d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
                        fill="#00832d"
                      />
                      <path
                        d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
                        fill="#2684fc"
                      />
                      <path
                        d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
                        fill="#ffba00"
                      />
                    </svg>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Google Drive
                      </h4>
                      <p className="text-sm text-gray-500">
                        Connected and ready
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                      <div className="h-8 w-8 bg-red-100 rounded-md flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Biology_Notes.pdf
                        </p>
                        <p className="text-xs text-gray-500">2.4 MB</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                      <div className="h-8 w-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Math_Formulas.docx
                        </p>
                        <p className="text-xs text-gray-500">1.8 MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 py-12 text-white">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="border-b border-blue-800 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg mb-4">NonNotes</h4>
              <p className="text-blue-200 text-sm mb-4">
                A collaborative platform where students can discover, share, and
                access class notes.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white">
                    Browse Notes
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Verified Content
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Upload Notes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Resources</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link to="/" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Legal</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link to="/" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Copyright Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white">
                    Academic Integrity
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4 text-blue-200 text-sm">
            <p>
              © 2025 NonNotes. All rights reserved. Made for students, by
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
