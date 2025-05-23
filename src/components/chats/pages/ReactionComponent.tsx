import React, { useEffect, useState } from "react";
import { messages, reactionType } from "../slices/types/groupMessagesTypes";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { useSelector } from "react-redux";

interface Props {
  message: messages;
}

const ReactionComponent: React.FC<Props> = ({ message }) => {
  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  const [uniqueReaction, setUniqueReaction] = useState<
    { type: string; count: string }[]
  >([]);

  const [memberReacted, setMemberReacted] = useState<
    {
      member_name: string;
      member_image: string;
      member_id: string;
      reaction_imoji: string;
    }[]
  >([]);

  const sender = JSON.parse(localStorage.getItem("user") || "");

  const getUniqueReaction = (target: reactionType[]) => {
    // const uniqueTypes = Array.from(new Set(target.map((item) => item.type)));
    let reactionCounts = new Map();

    // count occurance
    target.forEach((item) => {
      reactionCounts.set(item.type, reactionCounts.get(item.type) || 0 + 1);
    });

    // creating a new array from the map
    let arr2 = Array.from(reactionCounts, ([type, count]) => ({ type, count }));
    setUniqueReaction(arr2);
  };

  useEffect(() => {
    getUniqueReaction(message.reactions);
    // extracting the member's name and image from the global state of chatGrpup using the member_id or user_id
    const res = chatGroups?.members
      .filter((obj1) =>
        message.reactions.some((obj2) => obj1.member_id === obj2.user_id)
      )
      .map((item) => {
        const reaction = message.reactions.find(
          (obj2) => obj2.user_id === item.member_id
        );

        return {
          member_name: item.member_name,
          member_image: item.member_image,
          member_id: item.member_id,
          reaction_imoji: reaction?.type || "",
        };
      });
    setMemberReacted(res ? res : []);
  }, [message]);

  // useEffect(() => {
  //   console.log(message);
  // }, [message]);

  return (
    <Popover>
      <PopoverTrigger
        className={` flex flex-row gap-1 px-1 border min-w-10  rounded-full ${
          message.name === sender.name ? "self-end" : "self-start"
        }`}
      >
        {uniqueReaction.map((item) => (
          <span  key={item.type}>{item.type}</span>
        ))}
        <span> {message.reactions.length}</span>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        {uniqueReaction.length > 0 && (
          <Tabs defaultValue="All" className="w-full overflow-auto">
            <TabsList className={`flex rounded-none`}>
              <TabsTrigger className="flex gap-1" key="All" value="All">
                All{" "}
                <span className="text-muted-foreground">
                  {message.reactions.length}
                </span>
              </TabsTrigger>
              {uniqueReaction.length > 0 &&
                uniqueReaction.map((emojis) => (
                  <>
                    <TabsTrigger
                      className="flex gap-1"
                      key={emojis.type}
                      value={emojis.type}
                    >
                      {emojis.type}
                      <span>{emojis.count}</span>
                    </TabsTrigger>
                  </>
                ))}
            </TabsList>
            <TabsContent value="All" >
              {memberReacted.length > 0 &&
                memberReacted.map((item) => {
                  return (
                    <div
                      key={item.member_id}
                      className="flex flex-row items-center gap-1 p-1"
                    >
                      <img
                        src={item.member_image ? item.member_image : ""}
                        alt={item.member_name.slice(0, 1)}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-full border"
                      />
                      <p>{item.member_name}</p>
                    </div>
                  );
                })}
            </TabsContent>
            {uniqueReaction.map((item) => (
              <TabsContent key={item.type} value={item.type}>
                {memberReacted
                  .filter((member) => member.reaction_imoji === item.type)
                  .map((item) => (
                    <div
                      key={item.member_id}
                      className="flex flex-row items-center gap-1 p-1"
                    >
                      <img
                        src={item.member_image ? item.member_image : ""}
                        alt={item.member_name.slice(0, 1)}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 object-cover rounded-full border"
                      />
                      <p>{item.member_name}</p>
                    </div>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ReactionComponent;
