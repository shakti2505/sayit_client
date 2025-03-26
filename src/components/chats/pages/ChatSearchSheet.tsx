import { Sheet, SheetContent } from "../../../components/ui/sheet";
// import { Card, CardTitle, CardDescription } from "../../ui/card";
import Loader from "../../common/Loader";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store"; // Import AppDispatch type
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "../../ui/separator";
import { CardTitle, CardDescription } from "../../ui/card";
import { Badge } from "../../ui/badge";
import AddContactToGroup from "./AddContactsToGroup";
import {
  Camera,
  Check,
  CheckCheck,
  CheckIcon,
  HandHelping,
  Pencil,
} from "lucide-react";
import { useState } from "react";
import {
  changeGroupName,
  changeGroupPicutre,
} from "../services/chatGroupServices";
import { handleUploadGroupPicture } from "../../groupChat/services/groupChatServices";
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
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch

  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  const { updatedGroupDetails } = useSelector(
    (ChatGroups: RootState) => ChatGroups.updateChatGroupDetails
  );

  const [editGroupName, setEditGroupName] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>(
    chatGroups?.name ? chatGroups.name : ""
  );
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const handleChange = (name: string) => {
    setGroupName(name);
  };

  const [groupPicture, setGroupPicture] = useState<File | null>(null);
  const [groupPicturePreview, setGroupPicturePreview] = useState<string>("");
  const [isHover, setIshover] = useState(false);

  const handleUpdateName = async () => {
    setLoading(true);
    if (chatGroups?._id) {
      dispatch(changeGroupName(groupName, chatGroups._id));
      setEditGroupName(false);
      setLoading(false);
    }
  };

  const handleAddgroupPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const picture = e.target.files[0];
      setGroupPicture(picture);
      const groupPicturePreviewUrl = URL.createObjectURL(picture);
      setGroupPicturePreview(groupPicturePreviewUrl);
    }
  };

  const handleUpdateGroupImage = async () => {
    setLoadingImage(true);
    let uploade_image_url: string = "";
    if (groupPicture) {
      uploade_image_url = await handleUploadGroupPicture(groupPicture);
    }
    if (chatGroups?._id && groupPicture) {
      dispatch(changeGroupPicutre(uploade_image_url, chatGroups._id));
      setEditGroupName(false);
      setLoadingImage(false);
      setGroupPicturePreview("");
    }
  };

  const admin = chatGroups?.members?.filter((item) => item.isAdmin === true);

  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent
        className="border-none px-0 py-1 h-screen overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          {/* <Avatar>
            <AvatarImage
              className="rounded-full w-52 mt-10"
              src="https://github.com/shadcn.png"
              alt="@shadcn"
            />
          </Avatar> */}
          <div className="mt-2 flex flex-col items-center relative">
            <label
              onMouseLeave={() => setIshover(false)}
              htmlFor="file"
              className={`w-48 h-48 bg-muted rounded-full border flex items-center justify-center hover:cursor-pointer ${
                isHover ? "z-10 opacity-70" : ""
              }`}
            >
              <Camera size={50} strokeWidth={0.5} />
            </label>
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={handleAddgroupPicture}
            />

            <div className="absolute">
              {groupPicturePreview.length > 0 && (
                <button
                  disabled={loadingImage ? true : false}
                  onClick={handleUpdateGroupImage}
                  className="absolute bottom-0 right-0 rounded-full bg-cyan-600  p-2 z-40"
                >
                  {loadingImage ? <Loader /> : <Check />}
                </button>
              )}

              <img
                onMouseEnter={() => setIshover(true)}
                src={
                  groupPicturePreview
                    ? groupPicturePreview
                    : updatedGroupDetails?.group_picture
                    ? updatedGroupDetails?.group_picture
                    : chatGroups?.group_picture
                    ? chatGroups.group_picture
                    : "https://github.com/shadcn.png"
                }
                className="w-48 h-48 bg-muted rounded-full border"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-row gap-2">
              {editGroupName ? (
                <div className="flex border-b  border-b-cyan-600  w-80">
                  <input
                    className="bg-background outline-none w-full p-2 text-2xl"
                    type="text"
                    placeholder="Enter name"
                    value={groupName}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                  {}
                  <button
                    disabled={loading ? true : false}
                    onClick={handleUpdateName}
                    className="bg-background text-foreground"
                  >
                    {loading ? <Loader /> : <CheckIcon />}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-3xl text-muted-foreground">
                    {updatedGroupDetails?.name
                      ? updatedGroupDetails.name
                      : chatGroups?.name}
                  </p>
                  <button onClick={() => setEditGroupName(true)}>
                    <Pencil />
                  </button>
                </>
              )}
            </div>
            <p className="text-md text-muted-foreground">
              Group. {chatGroups?.members.length} members
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
            key={chatGroups._id}
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
