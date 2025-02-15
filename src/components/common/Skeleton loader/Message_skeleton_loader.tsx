import React from "react";
import { Skeleton } from "../../ui/skeleton";

const Message_skeleton_Loader: React.FC = () => {
  return (
    <div className="flex flex-col gap-1 p-2">
      <Skeleton className="h-2 w-36" />
      <Skeleton className="h-10 w-60" />
      <Skeleton className="h-2 w-16" />
    </div>
  );
};

export default Message_skeleton_Loader;
