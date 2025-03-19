import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-blue-100">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <Link to="/" className="font-medium text-xl text-blue-900">
              NonNotes
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-7 text-sm font-light">
            <Link to="/" className="hover:text-blue-600 text-gray-700">
              Home
            </Link>
            <Link to="/notes" className="hover:text-blue-600 text-gray-700">
              Browse Notes
            </Link>
            <Link to="/about" className="hover:text-blue-600 text-gray-700">
              About
            </Link>
            <Link to="/support" className="hover:text-blue-600 text-gray-700">
              Support
            </Link>
          </nav>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center pt-12">
        <div className="max-w-md w-full px-4">{children}</div>
      </div>
    </div>
  );
}
