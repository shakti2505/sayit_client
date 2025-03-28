import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
} from "../../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { messages } from "../slices/types/groupMessagesTypes";
import { copyToClipboard } from "../../../utilities/utilitiesFunctions";
interface Props {
  // define your props here
  message: messages;
  sender_id: string;
  setIsReply: (value: boolean) => void;
  SetMessageReplyingOn: (value: messages) => void;
  handleReactionToMessage: (
    messageId: string,
    groupId: string,
    type: string,
    user_id: string
  ) => void;
}

const MessageDropDownOption: React.FC<Props> = ({
  message,
  sender_id,
  setIsReply,
  SetMessageReplyingOn,
  handleReactionToMessage,
}) => {
  const handleMessageReply = () => {
    setIsReply(true);
    SetMessageReplyingOn(message);
  };

  const handleCopy = (e: React.MouseEvent, str: string) => {
    e.stopPropagation();
    copyToClipboard(str);
  };

  const emojiArray = ["👍", "❤️", "😂", "😮", "😢", "🙏", "➕"]; // ➕ = U+2795 = &#10133;]

  const handleReaction = (
    e: React.MouseEvent,
    messageId: string,
    group_id: string,
    type: string,
    sender_id: string
  ) => {
    e.stopPropagation();
    handleReactionToMessage(messageId, group_id, type, sender_id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <ChevronDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="right">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleMessageReply}>
            Reply
          </DropdownMenuItem>
          <DropdownMenuItem>Reply Privately</DropdownMenuItem>
          <DropdownMenuItem>Message {message.name}</DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleCopy(e, message.message)}>
            Copy
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger onClick={(e) => e.stopPropagation()}>
              React
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="flex flex-col w-auto">
                {emojiArray.map((emoji) => (
                  <DropdownMenuItem
                    onClick={(e) =>
                      handleReaction(
                        e,
                        message._id,
                        message.group_id,
                        emoji,
                        sender_id
                      )
                    }
                    className="text-2xl focus:bg-transparent "
                  >
                    {emoji}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>Forward</DropdownMenuItem>
          <DropdownMenuItem>Pin</DropdownMenuItem>
          <DropdownMenuItem>Star</DropdownMenuItem>
          <DropdownMenuItem>Report</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageDropDownOption;
