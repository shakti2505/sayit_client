import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info } from "lucide-react";

interface Props {
  content: string;
}

const ToolTipInfo: React.FC<Props> = ({ content }) => {
  return (
    <TooltipProvider >
      <Tooltip >
        <TooltipTrigger asChild>
        <Info className="text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent side="right" >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolTipInfo;
