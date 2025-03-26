import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { messages } from "../slices/types/groupMessagesTypes";

interface Props {
  // define your props here
  setIsReply: (value: boolean) => void;
  SetMessageReplyingOn: (value: messages) => void;
  message: messages;
}

const MessageDropDownOption: React.FC<Props> = ({
  setIsReply,
  message,
  SetMessageReplyingOn,
}) => {
  const handleMessageReply = () => {
    setIsReply(true);
    SetMessageReplyingOn(message);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <ChevronDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleMessageReply}>
            Reply
          </DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageDropDownOption;
