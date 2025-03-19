import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import VerifiedBadge from "./VerifiedBadge";
import { motion } from "framer-motion";

interface NoteCardProps {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  isVerified: boolean;
  likes: number;
  views: number;
  file_url?: string;
}

export default function NoteCard({
  id,
  title,
  description,
  grade,
  subject,
  isVerified,
  likes,
  views,
  file_url,
}: NoteCardProps) {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {isVerified && <VerifiedBadge />}
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
          >
            Grade {grade}
          </Badge>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200"
          >
            {subject}
          </Badge>
        </div>
        <h5 className="text-xl font-semibold text-gray-900 mb-1">{title}</h5>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Heart className="h-4 w-4 mr-1" />
            {likes}
            <Eye className="h-4 w-4 ml-3 mr-1" />
            {views}
          </div>
          <Link to={`/notes/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
