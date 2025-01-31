import { lazy, Suspense, useEffect, useMemo } from "react";
import { getSocket } from "../../../lib/socket.config";
import { useSearchParams } from "react-router-dom";
import ChatSidebar from "../ChatSideBar";
// import { useNavigate } from "react-router-dom";
import { getGroupsByID } from "../services/chatGroupServices";
import type { AppDispatch } from "../../../store/store"; // Import AppDispatch type
import { useDispatch } from "react-redux";
import { getGroupChatsByID } from "../services/groupChatsServices";
// import ChatNav from "../ChatNav";
// import ChatUserDialog from "../ChatUserDialog";
// const ChatUserDialog = lazy(() => import("../ChatUserDialog"));

// import GroupChats from "./GroupChats";
// import { GroupChatV2 } from "./GroupChatsV2";

import {
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import { AppSidebar } from "../../AppSidebar";

const GroupChatV2 = lazy(() => import("./GroupChatsV2"));
export const ChatBase = () => {
  // const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group_id"); // Extract the value of "group_id"

  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  // fetching groups chat by id  const { group_id } = useParams();
  // const [openAddNewUserDialog, setopenAddNewUserDialog] = useState(true);
  // const [searchMessage, setSearchMessage] = useState("");

  let socket = useMemo(() => {
    const socket = getSocket();
    // adding parameters in room,  a group ID
    socket.auth = {
      room: group_id,
    };
    return socket.connect();
  }, []);

  useEffect(() => {
    // listening to the event
    socket.on("connect", () => {
      console.log("The socket is connected");
    });

    socket.on("message", (data) => {
      console.log("The socket message", data);
    });

    // clearing the socket connection when the component is unmounted
    return () => {
      socket.close();
    };
  }, [socket]);

  // useEffect(() => {
  //   if (!group_id) {
  //     navigate("/not-found");
  //   }
  // }, [group_id, navigate]);

  useEffect(() => {
    if (group_id) {
      dispatch(getGroupsByID(group_id));
      dispatch(getGroupChatsByID(group_id));
    }
  }, [group_id]);

  // const handleClick = () => {
  //   socket.emit("message", { name: "shakti" });
  // };

  return (
    // <div className="flex bg-background">
    //   <Suspense fallback={<div>Loading...</div>}>
    //     <GroupChatV2 />
    //   </Suspense>
    //   {/* {openAddNewUserDialog && (
    //     <Suspense fallback={<div>Loading...</div>}>
    //       <ChatUserDialog
    //         open={openAddNewUserDialog}
    //         setOpen={setopenAddNewUserDialog}
    //       />
    //     </Suspense>
    //   )} */}
    //   {/* <GroupChats searchMessage={searchMessage} /> */}
    // </div>
    <>
      <SidebarProvider>
        <AppSidebar />
        <GroupChatV2 />
      </SidebarProvider>
    </>
  );
};

export default ChatBase;
