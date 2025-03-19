import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";

export default function VerifiedBadge() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 flex items-center gap-1"
          >
            <CheckCircle className="h-3 w-3" />
            Verified
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            This content has been verified by administrators for quality and
            accuracy
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
