import {
  Sheet,
  SheetContent,
} from "../../../components/ui/sheet";
// import { Card, CardTitle, CardDescription } from "../../ui/card";
// import Loader from "../../common/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "../../ui/separator";
import { CardTitle, CardDescription } from "../../ui/card";
import { Badge } from "../../ui/badge";
import AddContactToGroup from "./AddContactsToGroup";

interface ChatSearchSheetProps {
  setOpenSheet: (openSheet: boolean) => void;
  openSheet: boolean;
  aesKey?: CryptoKey;
}

const ChatSearchSheet: React.FC<ChatSearchSheetProps> = ({
  setOpenSheet,
  openSheet,
  aesKey,
}: ChatSearchSheetProps) => {
  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  const admin = chatGroups?.members?.filter((item) => item.isAdmin === true);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent
        className="border-none px-0 py-1 h-screen overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <Avatar>
            <AvatarImage
              className="rounded-full w-52 mt-10"
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
          </Avatar>{" "}
          <div className="flex flex-col items-center gap-2">
            <p className="text-3xl text-muted-foreground">{chatGroups?.name}</p>
            <p className="text-md text-muted-foreground">
              Group {chatGroups?.members.length} members
            </p>
          </div>
        </div>
        <Separator className="h-2 mt-2" />

        <div className="flex flex-col justify-center gap-2 p-3 mt-2">
          {admin?.map((item) => (
            <p key={item.member_id} className="text-sm text-muted-foreground">
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
        <AddContactToGroup aeskey={aesKey} />
        {/* Button to add members comppnent */}

        {chatGroups?.members.map((item) => (
          <div
            key={item.member_id}
            className="flex flex-row items-center gap-3 p-2 hover:bg-black/40 "
          >
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
      </SheetContent>
    </Sheet>
  );
};

export default ChatSearchSheet;
