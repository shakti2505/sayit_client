import { lazy, useEffect, useCallback, useState } from "react";
// import { getSocket } from "../../../lib/socket.config";
import { useSearchParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { getGroupsByID } from "../services/chatGroupServices";
import type { AppDispatch, RootState } from "../../../store/store"; // Import AppDispatch type
import { useDispatch, useSelector } from "react-redux";
import { getGroupChatsByID } from "../services/groupChatsServices";

import { SidebarProvider } from "../../../components/ui/sidebar";
import { AppSidebar } from "../../AppSidebar";
import { decryptAESKey } from "../../../crypto/decrypt";
// import { getSocket } from "../../../lib/socket.config";
// import ChatSearchSheet from "./ChatSearchSheet";

// import { AppSidebar2 } from "../../app-sidebar";

const GroupChatV2 = lazy(() => import("./GroupChatsV2"));
export const ChatBase = () => {
  const [aesKey, setAesKey] = useState<CryptoKey>();
  // const [_, setSearchedMessageId] = useState("");
  // const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group"); // Extract the value of "group_id"

  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch

  const { chatGroups, loading } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  // const [progress, setProgress] = useState(0);

  // const scrollToMessage = (id: string) => {
  //   const element = document.getElementById(id);
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth", block: "center" }); // Smoothly scroll to the element
  //     element.style.backgroundColor = "grey";
  //     setTimeout(() => {
  //       element.style.backgroundColor = "";
  //     }, 2000);
  //   }
  // };
  // decrypting AES key
  const getDecryptedAesKey = useCallback(async () => {
    try {
      const user = localStorage.getItem("user");
      const loggedInUser = user ? JSON.parse(user) : null;
      if (loggedInUser && chatGroups) {
        const res = chatGroups?.encryptAESKeyForGroup.find(
          (item) => item.user_id === loggedInUser.id
        )?.encryptedAESKey;
        if (res?.length !== 0) {
          const key = await decryptAESKey(res as string);
          setAesKey(key);
          return key;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [chatGroups]);

  //1 fetching chats and group by ID
  useEffect(() => {
    if (group_id) {
      dispatch(getGroupsByID(group_id));
      dispatch(getGroupChatsByID(group_id));
    }
  }, [group_id]);

  // 2- decrypting aes key when group chats fetched and redux states updated
  useEffect(() => {
    if (chatGroups) {
      getDecryptedAesKey();
    }
  }, [chatGroups]);

  useEffect(()=>{
    console.log("aesKey", aesKey);
  },[aesKey]);

  // useEffect(() => {
  //   const time = setInterval(() => {
  //     if (progress < 100) {
  //       setProgress((p) => p + 1);
  //     }
  //   }, 20);

  //   return () => {
  //     clearTimeout(time);
  //   };
  // }, [progress]);

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
        {aesKey && !loading ? (
          <GroupChatV2 aesKey={aesKey} />
        ) : (
          <div className="flex justify-center items-center w-full bg-background">
            <div className="flex flex-col justify-center items-center gap-5">
              <p className="text-9xl text-muted-foreground gap-5">Sayit</p>
            </div>
          </div>
        )}
      </SidebarProvider>
      {/* <ProgressBar progress={progress} bgcolor={"red"} /> */}
    </>
  );
};

export default ChatBase;
