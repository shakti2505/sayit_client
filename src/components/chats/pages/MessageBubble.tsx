import React from "react";
import { messages } from "../slices/types/groupMessagesTypes";
// import { CheckCheck } from "lucide-react";
interface Props {
  message: messages;
}

const MessageBubble: React.FC<Props> = ({ message }) => {
  return (
    <div className="max-w-xs sm:max-w-md bg-[# text-white rounded-lg p-3 shadow-lg">
      <div className="text-sm font-semibold text-blue-400">{message.name}</div>

      {/* Reply Box */}
      <div className="bg-[#1c262b] p-2 rounded-lg border-l-4 border-green-500 mt-1">
        <div className="text-green-400 font-semibold flex items-center">
          Kapil Pandel <span className="ml-1">🐷</span>
        </div>
        <div className="text-sm text-gray-300">
          message reply to 
        </div>
      </div>

      {/* Message Text */}
      <div className="mt-2 text-white">{message.message}</div>

      {/* Timestamp */}
      <div className="text-xs text-gray-400 text-right mt-1">4:32 pm</div>
    </div>
  );
};

export default MessageBubble;
