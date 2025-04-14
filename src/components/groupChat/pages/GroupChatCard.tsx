import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store"; // Import AppDispatch type
import EditGroup from "./EditGroup";
import { useNavigate } from "react-router-dom";
import { Card, CardDescription, CardTitle } from "../../../components/ui/card";
import { getGroupChatsByID } from "../../chats/services/groupChatsServices";
import User_skeleton_loader from "../../common/Skeleton loader/User_skeleton_loader";
import { getGroupsByID } from "../../chats/services/chatGroupServices";
import useChatSocket from "../../../hooks/useChatSocket";

interface GroupChatCardProps {
  // LastMessgesOfGroup: {
  //   message: string;
  //   date: string;
  // };
}

const GroupChatCard: React.FC<GroupChatCardProps> = ({}) => {
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDiolog] = useState(false);
  const [openGroupToEditId] = useState("");
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  const [searchQuery] = useState("");
  // const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  // const group_id = searchParams.get("group_id");
  const { allMessages } = useChatSocket();

  const { data } = useSelector(
    (getChatGroup: RootState) => getChatGroup.getChatGroup
  );

  // updated group details
  const { updatedGroupDetails } = useSelector(
    (ChatGroups: RootState) => ChatGroups.updateChatGroupDetails
  );
  // const { chatGroups } = useSelector(
  //   (ChatGroups: RootState) => ChatGroups.getGroupByID
  // );

  // gropchats data
  // const groupChats = useSelector(
  //   (ChatGroups: RootState) => ChatGroups.getGroupChat
  // );

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  // const handleDelete = async (id: string): Promise<void> => {
  //   const data = await deleteGroup(id);
  //   if (data.message === "Group Deleted successfully") {
  //     toast.success(data?.message);
  //     dispatch(getGroups());
  //   }
  // };

  // const handleOpenEditGroup = (id: string) => {
  //   setOpenGroupToEditId(id);
  //   setOpenEditDiolog(true);
  // };

  // create soket instance

  const handleGetGropChatById = async (groupID: string) => {
    await dispatch(getGroupsByID(groupID));
    await dispatch(getGroupChatsByID(groupID, 1, 10));
    navigate(`/chats?group=${groupID}`);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {data && data.length > 0 ? (
          data
            .filter((group: any) =>
              group.name.toLowerCase().includes(searchQuery)
            )
            .map((item: any) => (
              <React.Fragment key={item._id}>
                <Card
                  onClick={() => handleGetGropChatById(item._id)}
                  className="border-b rounded-none border-none cursor-pointer bg-inherit hover:bg-gray-500 active:bg-[#2A3942] focus-card"
                >
                  <div className="flex flex-row items-center gap-3 p-2">
                    {/* <Avatar>
                      <AvatarImage
                        className="rounded-full w-16 h-5 object-cover "
                        src={item.group_picture ? item.group_picture : 'https://github.com/shadcn.png'}
                        alt={item.name}
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar> */}
                    <img
                      src={
                        updatedGroupDetails?._id === item._id
                          ? updatedGroupDetails?.group_picture
                          : item.group_picture
                          ? item.group_picture
                          : "https://github.com/shadcn.png"
                      }
                      className="rounded-full w-14 h-14 border-0 object-cover"
                      alt={item.name.slice(0, 1)}
                    />
                    <div className="flex flex-col gap-1 w-full p-1">
                      <CardTitle>
                        {updatedGroupDetails?._id === item._id
                          ? updatedGroupDetails?.name
                          : item.name}
                      </CardTitle>
                      <CardDescription className="text-foreground">
                        Recent Message
                      </CardDescription>
                    </div>

                    {allMessages.length > 0 && (
                      <div className="bg-background text-foreground rounded-full w-8 h-7 p-1 flex justify-center items-center">
                        <p className="text-sm  font-bold ">
                          {allMessages.filter(
                            (msg) => msg.group_id === item._id
                          ).length > 0 &&
                            allMessages.filter(
                              (msg) => msg.group_id === item._id
                            ).length}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
                {/* <Separator /> */}
              </React.Fragment>
            ))
        ) : (
          <User_skeleton_loader />
        )}

        <EditGroup
          openEditDialog={openEditDialog}
          groupId={openGroupToEditId}
          passcode=""
          setOpenEditDiolog={setOpenEditDiolog}
        />
      </div>
    </div>
  );
};

export default GroupChatCard;
