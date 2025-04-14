import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { SidebarProvider } from "../../../components/ui/sidebar";
import { AppSidebar } from "../../AppSidebar";
import ProgressBar from "../../common/ProgressBar";
import GroupChatV2 from "./GroupChatsV2";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store"; // Import AppDispatch type
import { getGroups } from "../../groupChat/services/groupChatServices";
import { getUsersContacts } from "../../Contacts/services/AddNewUserServices";

export const ChatBase = () => {
  const [progress, setProgress] = useState(0);
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  // group data
  const { loadingChatGroup } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  // group chats
  const { loadingGroupChats } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );
  // All group of user
  // const { data } = useSelector(
  //   (ChatGroups: RootState) => ChatGroups.getChatGroup
  // );
  // group chats

  // decrypting AES key
  // const getDecryptedAesKey = useCallback(async () => {
  //   try {
  //     const user = localStorage.getItem("user");
  //     const loggedInUser = user ? JSON.parse(user) : null;
  //     if (loggedInUser && chatGroups) {
  //       const res = chatGroups?.encryptAESKeyForGroup.find(
  //         (item:any) => item.user_id === loggedInUser.id
  //       )?.encryptedAESKey;
  //       if (res?.length !== 0) {
  //         const key = await decryptAESKey(res as string);
  //         setAesKey(key);
  //         return key;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [chatGroups, aesKey]);

  // 2- decrypting aes key when group chats fetched and redux states updated
  // useEffect(() => {

  //   if (chatGroups) {
  //     getDecryptedAesKey();
  //   }
  // }, [chatGroups]);

  useEffect(() => {
    dispatch(getGroups());
    dispatch(getUsersContacts());
  }, []);

  useEffect(() => {
    const time = setInterval(() => {
      if (progress < 100) {
        setProgress((p) => p + 1);
      }
    }, 1);

    return () => {
      clearTimeout(time);
    };
  }, [progress]);

  if (progress !== 100) {
    return <ProgressBar progress={progress} bgcolor="cyan" />;
  } else {
    return (
      <SidebarProvider>
        <AppSidebar />
        {!loadingChatGroup && !loadingGroupChats && <GroupChatV2 />}
        {loadingChatGroup && loadingGroupChats && <LoadingScreen />}
      </SidebarProvider>
    );
  }
};

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center w-full bg-background">
      <div className="flex flex-col justify-center items-center gap-5">
        <p className="text-9xl text-muted-foreground">SayIt</p>
        <div className="flex flex-row justify-between items-center gap-2">
          <Lock strokeWidth={1.2} />
          <p className="text-xl text-muted-foreground">
            Your Personal messages are end-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBase;
