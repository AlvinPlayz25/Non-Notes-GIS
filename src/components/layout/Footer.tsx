import { Link } from "react-router-dom";

export default function Footer() {
  return (
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
                <Link to="/notes" className="hover:text-white">
                  Browse Notes
                </Link>
              </li>
              <li>
                <Link to="/notes?tab=verified" className="hover:text-white">
                  Verified Content
                </Link>
              </li>
              <li>
                <Link to="/notes/create" className="hover:text-white">
                  Upload Notes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-4">Resources</h4>
            <ul className="space-y-2 text-blue-200 text-sm">
              <li>
                <Link to="/about" className="hover:text-white">
                  About Us
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
        <div className="py-4 text-blue-200 text-sm flex justify-between items-center">
          <p>
            © 2025 NonNotes. All rights reserved. Made for students, by
            students.
          </p>
          <Link
            to="/debug"
            className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded text-white text-xs"
          >
            Debug
          </Link>
        </div>
      </div>
    </footer>
  );
}
