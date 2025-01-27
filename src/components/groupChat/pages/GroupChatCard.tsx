import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store"; // Import AppDispatch type
import { getGroups } from "../services/groupChatServices";
import { Loader } from "lucide-react";
// import { Button } from "../../ui/button";
// import { toast } from "sonner";
import EditGroup from "./EditGroup";
import { useNavigate } from "react-router-dom";
import CreateChatGroup from "./CreateChatGroup";
import {
  Card,
  CardDescription,
  
  CardTitle,
} from "../../../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

// import arrowSvg from "../../assets/arrow_upright.svg";

interface GroupChatCardProps {
  // LastMessgesOfGroup: {
  //   message: string;
  //   date: string;
  // };
}

const GroupChatCard: React.FC<GroupChatCardProps> = ({
}) => {
  const navigate = useNavigate();
  const [openEditDialog, setOpenEditDiolog] = useState(false);
  const [openGroupToEditId] = useState("");
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  const [searchQuery] = useState("");

  // gro
  const { data } = useSelector(
    (getChatGroup: RootState) => getChatGroup.getChatGroup
  );

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

  useEffect(() => {
    dispatch(getGroups());
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap gap-5 mt-5  mx-7 items-center ">
        <div className="flex-1">
          <CreateChatGroup />
        </div>
        {/* <div className="flex-2">
          <input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            className="outline-none bg-[#F4F4F5] rounded-full p-1 px-2 text-md w-48 transform transition-all duration-150 hover:w-96 focus:w-96 focus:ring-2 focus:ring-blue-500 ease-in-out"
            placeholder="Search group by name"
          />
        </div> */}
      </div>
      <div className="flex flex-col gap-2 mt-2 px-2">
        {data ? (
          data
            .filter((group) => group.name.toLowerCase().includes(searchQuery))
            .map((item) => {
              return (
                <React.Fragment key={item._id}>
                  {item ? (
                    <React.Fragment key={item.group_id}>
                      {/* <div className="shadow-md card font-sans  rounded-lg overflow-hidden w-96 transform transition duration-500 hover:shadow-xl">
                        <div className="p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
                          <div className="flex">
                            <div className="flex-1 text-lg font-montserrat font-bold">
                              {item.name}
                            </div>
                            <div className="flex-3 space-x-4">
                              <div className="flex gap-0.5">
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
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6 font-montserrat">
                          <div className="text-black text-xl font-bold mb-2">
                            Group Bio
                          </div>
                        </div>
                      </div> */}
                      <Card
                        onClick={() => navigate(`/chats?group_id=${item._id}`)}
                        className="mt-2 border-b rounded-none border-none cursor-pointer  hover:bg-gray-500 active:bg-[#2A3942] focus-card"
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
                        <div className="flex flex-row items-center gap-3 p-2  border-b border-b-gray-800">
                          <Avatar>
                            <AvatarImage
                              className="rounded-full w-16"
                              src="https://github.com/shadcn.png"
                              alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>{" "}
                          <div className="flex flex-col gap-1  w-full p-2 ">
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription>
                              {/* {LastMessgesOfGroup.message.slice(0, 10)} */}
                            </CardDescription>
                          </div>
                        </div>
                      </Card>
                    </React.Fragment>
                  ) : (
                    <p>No group found</p>
                  )}
                </React.Fragment>
              );
            })
        ) : (
          <Loader />
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
