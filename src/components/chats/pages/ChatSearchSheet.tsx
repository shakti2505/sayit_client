import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../../../components/ui/sheet";
import { Search, X } from "lucide-react";
// import { Card, CardTitle, CardDescription } from "../../ui/card";
import { useState, useEffect, useCallback } from "react";
// import Loader from "../../common/Loader";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store"; // Import AppDispatch type
import { getMessgesBySearch } from "../services/groupChatsServices";
import { useSearchParams } from "react-router-dom";
import { Button } from "../../ui/button";
import { debounce } from "../../../utils/resuableFunctions";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "../../ui/separator";
import { CardTitle, CardDescription } from "../../ui/card";
import { Badge } from "../../ui/badge";
import AddContactToGroup from "./AddContactsToGroup";
interface ChatSearchSheetProps {
  setSearchedMessageId: (id: string) => void;
  scrollToMessage: (id: string) => void;
  setOpenGroupDetails: (openGroupDetails: boolean) => void;
  handleGroupDetailsSheet: () => void;
  setOpenSheet: (openSheet: boolean) => void;
  handleSearchSheet: () => void;
  openGroupDetails: boolean;
  searchSheet: boolean;
  openSheet: boolean;
  aeskey: CryptoKey;
}

const ChatSearchSheet: React.FC<ChatSearchSheetProps> = ({
  // scrollToMessage,
  openGroupDetails,
  searchSheet,
  openSheet,
  setOpenSheet,
  aeskey,
}: ChatSearchSheetProps) => {
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group"); // Extract the value of "group_id"

  const { queryMessages, loading } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getQueryMessages
  );
  // const [messageQueryResult, setMessageQueryResult] = useState(queryMessages);
  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  const admin = chatGroups?.members?.filter((item) => item.isAdmin === true);

  const [query, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async () => {
    if (!query) {
      return;
    }
    if (group_id) {
      await dispatch(getMessgesBySearch(group_id, query, page, 20));
      if (!loading || queryMessages.length > 0) {
        setHasMore(queryMessages.length > 0);
      }
    }
  };

  // Debounce fetchMessages and include required dependencies
  const debouncedFetchMessages = useCallback(
    debounce(() => fetchMessages(), 500),
    [query, page, group_id, dispatch]
  );
  // scroll event handler
  const handleQuery = (message: string) => {
    setSearchQuery(message);
    setPage(1);
  };

  // const handleDecryptQueryMessage = async () => {
  //   if (queryMessages.length > 0 && !loading) {
  //     const decryptedMessage = await decryptMessage(q);
  //     const decryptedMessagesTemp = await Promise.all(
  //       queryMessages.map(async (item) => {
  //         return await decryptMessage(item.message, item.iv, aeskey);
  //       })
  //     );
  //     console.log(decryptedMessagesTemp);
  //     if (decryptedMessagesTemp) {
  //       setMessageQueryResult(decryptedMessagesTemp);
  //     }
  //   }
  // };

  useEffect(() => {
    debouncedFetchMessages(); // Call debounced function on query change
    if (queryMessages.length > 0 && !loading) {
      // handleDecryptQueryMessage();
    }
  }, [debouncedFetchMessages, query]);

  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      {/* <SheetTrigger asChild>
        <Search className="hover:cursor-pointer" />
      </SheetTrigger> */}
      <SheetContent
        className="border-none px-0 py-2"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>{searchSheet && "Search Messages"}</SheetTitle>
          <SheetDescription className="overflow-y-auto h-screen py-5">
            {searchSheet && (
              <>
                <div className="rounded-lg flex p-2 bg-[#202C33] border-none">
                  <Search />
                  <input
                    onChange={(e) => handleQuery(e.target.value)}
                    value={query}
                    type="text"
                    className=" w-full bg-[#202C33] border-none outline-none text-muted-foreground pl-2 text-base font-semibold outline-0"
                    placeholder="Search messages"
                  />
                  {loading ? (
                    <div className="w-5 h-6 border-4 border-transparent text-red-[#A1A1AA] text-2xl animate-spin flex items-center justify-center border-b-[#A1A1AA] rounded-full"></div>
                  ) : (
                    <X
                      className="hover:cursor-pointer"
                      onClick={() => setSearchQuery("")}
                    />
                  )}
                </div>
                <div>
                  {/* {messageQueryResult.length > 0 ? (
                    messageQueryResult.map((item) => (
                      <>
                        <Card
                          key={item._id}
                          className="mt-2 border-b rounded-none border-none cursor-pointer  hover:bg-gray-500 active:bg-[#2A3942] focus-card hover:cursor-pointer"
                        >
                          <div className="flex flex-row items-center gap-3 p-2  border-b border-b-gray-800">
                            <div
                              className="flex flex-col gap-1  w-full p-2 "
                              onClick={() => scrollToMessage(item._id)}
                            >
                              <CardDescription>
                                {new Date(item.createdAt).toLocaleString()}
                              </CardDescription>
                              <CardTitle className="text-lg">
                                {item.message}
                              </CardTitle>
                            </div>
                          </div>
                        </Card>
                      </>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-7">
                      <p className="font-bold font-mono text">
                        No messages found.
                      </p>
                    </div>
                  )} */}
                  {hasMore && queryMessages.length > 0 && (
                    <div className="flex justify-center items-center">
                      <Button
                        onClick={loadMore}
                        className="mt-4 px-4 py-2 bg-background text-muted-foreground "
                      >
                        Load More
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            {openGroupDetails && (
              <>
                <div className="flex flex-col items-center justify-center gap-3">
                  <Avatar>
                    <AvatarImage
                      className="rounded-full w-52 mt-10"
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                  </Avatar>{" "}
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-3xl text-muted-foreground">
                      {chatGroups?.name}
                    </p>
                    <p className="text-md text-muted-foreground">
                      Group {chatGroups?.members.length} members
                    </p>
                  </div>
                </div>
                <Separator className="h-2 mt-2" />

                <div className="flex flex-col justify-center gap-2 p-3 mt-2">
                  {admin?.map((item) => (
                    <p className="text-sm text-muted-foreground">
                      Group created by {item.member_name}, on{" "}
                      {new Date(
                        chatGroups?.createdAt ? chatGroups?.createdAt : ""
                      ).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(
                        chatGroups?.createdAt ? chatGroups?.createdAt : ""
                      ).toLocaleTimeString()}
                    </p>
                  ))}
                </div>
                <Separator className="h-2 mt-2" />

                {/* Button to open add members component */}
                <AddContactToGroup aeskey={aeskey} />
                {/* Button to add members comppnent */}

                {chatGroups?.members.map((item) => (
                  <div className="flex flex-row items-center gap-3 p-2 hover:bg-black/40 ">
                    <Avatar>
                      <AvatarImage
                        className="rounded-full w-12"
                        src={item.member_image}
                        alt="@shadcn"
                      />
                      <AvatarFallback className="rounded-full p-3 text-md border">
                        CN
                      </AvatarFallback>
                    </Avatar>{" "}
                    <div className="flex flex-col gap-1 w-full p-2">
                      <CardTitle>{item.member_name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        status
                      </CardDescription>
                    </div>
                    {item.isAdmin && (
                      <Badge
                        variant="outline"
                        className="bg-background text-muted-foreground"
                      >
                        Admin
                      </Badge>
                    )}
                  </div>
                ))}
              </>
            )}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild></SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSearchSheet;
