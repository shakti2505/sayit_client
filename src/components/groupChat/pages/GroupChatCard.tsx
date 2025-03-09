import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store"; // Import AppDispatch type
import { getGroups } from "../services/groupChatServices";
// import { Button } from "../../ui/button";
// import { toast } from "sonner";
import EditGroup from "./EditGroup";
import { useNavigate } from "react-router-dom";
import CreateChatGroup from "./CreateChatGroup";
import { Card, CardDescription, CardTitle } from "../../../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "../../ui/separator";
import { getGroupChatsByID } from "../../chats/services/groupChatsServices";
import User_skeleton_loader from "../../common/Skeleton loader/User_skeleton_loader";

// import arrowSvg from "../../assets/arrow_upright.svg";

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
  // gro
  const { data } = useSelector(
    (getChatGroup: RootState) => getChatGroup.getChatGroup
  );
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

 

  const handleGetGropChatById = (groupID: string) => {
    dispatch(getGroupChatsByID(groupID));
    navigate(`/chats?group=${groupID}`)

  };

  useEffect(() => {
    dispatch(getGroups());
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col ">
        <CreateChatGroup />
        {data ? (
          data
            .filter((group) => group.name.toLowerCase().includes(searchQuery))
            .map((item) => {
              return (
                <React.Fragment key={item._id}>
                  {item ? (
                    <React.Fragment key={item.group_id}>
                      <Card
                        onClick={() => handleGetGropChatById(item._id)}
                        className="border-b rounded-none border-none cursor-pointer bg-inherit  hover:bg-gray-500 active:bg-[#2A3942] focus-card"
                      >
                        {/* <CardHeader className="flex flex-row items-center justify-between gap-2">
                          <Avatar>
                            <AvatarImage
                              className="rounded-full w-10"
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>{" "}
                          <div>
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription>Show Last message</CardDescription>
                          </div>
                        </CardHeader> */}
                        {/* <CardFooter className="gap-2">
                          <Button
                            onClick={() => handleDelete(item._id)}
                            variant="destructive"
                            className="flex-1 hover:text-gray-200 hover:scale-75 transition-transform duration-300 ease-in-out hover"
                          >
                            <Trash2 />
                          </Button>
                          <Button
                            onClick={() => handleOpenEditGroup(item._id)}
                            variant="default"
                            className=" flex-1 hover:text-gray-200 hover:scale-75 transition-transform duration-300 ease-in-out hover"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="default"
                            className=" flex-1 hover:text-gray-200 hover:scale-75 transition-transform duration-300 ease-in-out hover"
                            onClick={() => navigate(`/chats/${item._id}`)}
                          >
                            <SquareArrowOutUpRight />
                          </Button>
                        </CardFooter> */}
                        <div className="flex flex-row items-center gap-3 p-2">
                          <Avatar>
                            <AvatarImage
                              className="rounded-full w-16"
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>{" "}
                          <div className="flex flex-col gap-1 w-full p-1 ">
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription className="text-foreground"></CardDescription>
                          </div>
                        </div>
                      </Card>
                      <Separator />
                    </React.Fragment>
                  ) : (
                    <p className="text-white">No group found</p>
                  )}
                </React.Fragment>
              );
            })
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
