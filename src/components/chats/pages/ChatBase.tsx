import { lazy, Suspense } from "react";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { useSelector } from "react-redux";

import { SidebarProvider } from "../../../components/ui/sidebar";
import { AppSidebar } from "../../AppSidebar";

const GroupChatV2 = lazy(() => import("./GroupChatsV2"));
export const ChatBase = () => {
  // const [aesKey, setAesKey] = useState<CryptoKey>();

  // const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  // const group_id = searchParams.get("group"); // Extract the value of "group_id"

  // const useAppDispatch: () => AppDispatch = useDispatch;
  // const dispatch = useAppDispatch(); // Typed dispatch

  const { loadingGroupChats } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupChat
  );
  const { loadingChatGroup } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

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
    <SidebarProvider>
      <AppSidebar />

      {/* Show loading screen before rendering the main content */}
      {loadingGroupChats || loadingChatGroup ? (
        <div className="flex justify-center items-center w-full bg-background">
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-9xl text-muted-foreground">Sayit</p>
          </div>
        </div>
      ) : (
        <Suspense
          fallback={<p className="text-white text-3xl">Loading Chats</p>}
        >
          <GroupChatV2 />
        </Suspense>
      )}
    </SidebarProvider>
  );
};

export default ChatBase;
