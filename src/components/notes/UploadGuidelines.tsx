import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle,
  FileWarning,
  Info,
  XCircle,
} from "lucide-react";

export default function UploadGuidelines() {
  return (
    <div className="space-y-6">
      <Alert className="bg-red-50 border-red-200">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <AlertTitle className="text-red-600 font-semibold">
          Important Rules
        </AlertTitle>
        <AlertDescription className="text-red-700">
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Do not upload copyrighted material you don't have rights to</li>
            <li>No inappropriate or offensive content</li>
            <li>No personal information of others</li>
            <li>Files must be clear and legible</li>
            <li>Maximum file size: 10MB</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-600 font-semibold">
          Guidelines for Quality Notes
        </AlertTitle>
        <AlertDescription className="text-blue-700">
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Ensure your notes are well-organized and structured</li>
            <li>Use clear headings and subheadings</li>
            <li>Include relevant diagrams or illustrations when helpful</li>
            <li>Proofread for spelling and grammar errors</li>
            <li>Provide accurate information based on curriculum</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-600 font-semibold">Do's</AlertTitle>
          <AlertDescription className="text-green-700">
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Upload clear, high-quality scans or PDFs</li>
              <li>Properly categorize by subject and grade</li>
              <li>Add descriptive titles and summaries</li>
              <li>Mention if content is from textbooks or class notes</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Alert className="bg-orange-50 border-orange-200">
          <XCircle className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-600 font-semibold">
            Don'ts
          </AlertTitle>
          <AlertDescription className="text-orange-700">
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Don't upload blurry or illegible content</li>
              <li>Don't submit incomplete notes</li>
              <li>Don't include test answers or exam materials</li>
              <li>Don't upload duplicate content</li>
            </ul>
          </AlertDescription>
        </Alert>
      </div>

      <Alert className="bg-yellow-50 border-yellow-200">
        <FileWarning className="h-5 w-5 text-yellow-600" />
        <AlertTitle className="text-yellow-600 font-semibold">
          Image Quality Notice
        </AlertTitle>
        <AlertDescription className="text-yellow-700">
          <p className="mt-2">
            If you're uploading scanned images or photos of handwritten notes,
            please indicate in the description whether the images are clear and
            legible. This helps other students decide if the notes will be
            useful for them.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
}
