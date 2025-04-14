import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

interface Props {
  // define your props here
}

const EmojiPicker: React.FC<Props> = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button onClick={(e)=>e.stopPropagation()}>➕</button>
      </PopoverTrigger>
      <PopoverContent> 
        <Picker data={data} onEmojiSelect={console.log} />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
