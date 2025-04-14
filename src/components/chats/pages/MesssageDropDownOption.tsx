import React, { useState } from "react";
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
import { ChevronDown, X } from "lucide-react";
import { messages } from "../slices/types/groupMessagesTypes";
import { copyToClipboard } from "../../../utilities/utilitiesFunctions";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

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
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  const handleMessageReply = () => {
    setIsReply(true);
    SetMessageReplyingOn(message);
  };

  const handleCopy = (e: React.MouseEvent, str: string) => {
    e.stopPropagation();
    copyToClipboard(str);
  };

  const emojiArray = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

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

  const handleEmoji = (emoji: any) => {
    handleReactionToMessage(
      message._id,
      message.group_id,
      emoji.native,
      sender_id
    );
    setIsEmojiPickerOpen(false);
  };


  return (
    <>
      <Popover open={isEmojiPickerOpen}>
        <PopoverTrigger asChild>
          <button></button>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <div className="flex flex-col items-start w-full">
            <div className="flex fle-row justify-end w-full">
              <button onClick={() => setIsEmojiPickerOpen(false)}>
                <X size={15} />
              </button>
            </div>
            <Picker
              data={data}
              onEmojiSelect={handleEmoji}
              previewPosition="top"
            />
          </div>
        </PopoverContent>
      </Popover>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button onClick={(e) => e.stopPropagation()}>
            <ChevronDown size={20} />
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
              <DropdownMenuSubTrigger>React</DropdownMenuSubTrigger>
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
                      className="text-2xl focus:bg-transparent hover:scale-150 transition delay-150 duration-150 ease-in-out"
                    >
                      {emoji}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem
                    onClick={() => setIsEmojiPickerOpen(true)}
                    className="text-2xl focus:bg-transparent"
                  >
                    ➕
                  </DropdownMenuItem>
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
    </>
  );
};

export default MessageDropDownOption;
