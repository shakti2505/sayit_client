import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../../components/ui/sheet";
import { Search, X } from "lucide-react";
import { Card, CardTitle, CardDescription } from "../../ui/card";
import { useState, useEffect, useCallback } from "react";
// import Loader from "../../common/Loader";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store"; // Import AppDispatch type
import { getMessgesBySearch } from "../services/groupChatsServices";
import { useParams } from "react-router-dom";
import { Button } from "../../ui/button";
import { debounce } from "../../../utils/resuableFunctions";

interface ChatSearchSheetProps {
  setSearchedMessageId: (id: string) => void;
  scrollToMessage: (id: string) => void;
}

const ChatSearchSheet: React.FC<ChatSearchSheetProps> = ({
  scrollToMessage,
}: ChatSearchSheetProps) => {
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  const { group_id } = useParams();

  const { queryMessages, loading } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getQueryMessages
  );

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

  useEffect(() => {
    debouncedFetchMessages(); // Call debounced function on query change
  }, [debouncedFetchMessages, query]);

  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Search className="hover:cursor-pointer" />
      </SheetTrigger>
      <SheetContent className="border-none">
        <SheetHeader>
          <SheetTitle>Search Messages</SheetTitle>
          <SheetDescription>
            <div className="rounded-lg flex p-2 bg-[#202C33] border-none">
              <Search />
              <input
                onChange={(e) => handleQuery(e.target.value)}
                value={query}
                type="text"
                className=" w-full bg-[#202C33] border-none outline-none text-muted-foreground pl-2 text-base font-semibold outline-0"
                placeholder=""
                id=""
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
              {/* showing Serched Messages */}
              {queryMessages.length > 0 ? (
                queryMessages.map((item) => (
                  <>
                    <Card className="mt-2 border-b rounded-none border-none cursor-pointer  hover:bg-gray-500 active:bg-[#2A3942] focus-card hover:cursor-pointer">
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
                  <p className="font-bold font-mono text">No messages found.</p>
                </div>
              )}
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
