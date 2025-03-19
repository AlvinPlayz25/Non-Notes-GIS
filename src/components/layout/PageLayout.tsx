import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import SidebarToggle from "./SidebarToggle";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

interface PageLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showFooter?: boolean;
}

export default function PageLayout({
  children,
  showSidebar = true,
  showFooter = true,
}: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile on mount and when window resizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showSidebar && (
        <SidebarToggle isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      )}

      <div className="flex flex-1 relative">
        {/* Desktop sidebar - always visible on md+ screens */}
        {showSidebar && (
          <div className="hidden md:block">
            <Sidebar />
          </div>
        )}

        {/* Mobile sidebar - conditionally visible */}
        <AnimatePresence>
          {showSidebar && sidebarOpen && isMobile && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                className="w-[240px] h-full"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Sidebar />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}
