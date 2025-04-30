import { Pin } from "lucide-react";
import React, { useState } from "react";

interface Props {
  // define your props here
}

const PinnedMessages: React.FC<Props> = () => {
  const pinnedMessasges = [
    {
      senderName: "shakti kashyap",
      message: "hello!",
      _id: 1,
    },
    {
      senderName: "John  Doe",
      message: "welcome!",
      _id: 2,
    },
    {
      senderName: "Jane doe",
      message: "How are you!",
      _id: 3,
    },
  ];
  const [pinnedMessasge, setPinnedMessage] = useState(pinnedMessasges[0]);

  const handleShowingOnePinnedMessage = () => {
    const currentIndex = pinnedMessasges.findIndex(
      (msg) => msg._id === pinnedMessasge._id
    );
    const nextIndex = (currentIndex + 1) % pinnedMessasges.length;
    setPinnedMessage(pinnedMessasges[nextIndex]);
  };

  return (
    <button
      onClick={handleShowingOnePinnedMessage}
      className="sticky flex flex-row justify-between items-center z-40 top-0 bg-background text-foreground p-2 hover:bg-muted"
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-col space-y-1">
          {pinnedMessasges.map((item) => (
            <div
              key={item._id}
              className={`h-2.5 w-[1.5px] ${
                item._id === pinnedMessasge._id ? "bg-cyan-300" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="border bg-muted p-1 rounded-lg">                
          <Pin color="#8d9599" />
        </div>
        <div className="flex flex-row items-center gap-1">
          <p className="text-cyan-300 ">{pinnedMessasge.senderName}</p>
          <p className="font-thin">{pinnedMessasge.message}</p>
        </div>
      </div>
    </button>
  );
};

export default PinnedMessages;
