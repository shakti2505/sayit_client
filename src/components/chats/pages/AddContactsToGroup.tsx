import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { useSelector } from "react-redux";

import type { RootState } from "../../../store/store"; // Import AppDispatch type
import { Check, UserPlus } from "lucide-react";
import { addContactsToGroup } from "../services/chatGroupServices";
import { useSearchParams } from "react-router-dom";
import { encryptedAESkeyWithUsersPublicKey } from "../../../crypto/encrypt";
import Loader from "../../common/Loader";

interface User {
  _id: string;
  user_id: string;
  contact_id: string;
  contact_name: string;
  contact_image: string;
  contact_email: string;
  contact_public_key: string;
  createdAt: string;
}

interface AddToContactsProps {
  aeskey?: CryptoKey;
}

const AddContactToGroup: React.FC<AddToContactsProps> = ({ aeskey }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchParams] = useSearchParams(); // Get the instance of URLSearchParams
  const group_id = searchParams.get("group"); // Extract the value of "group_id"

  const { userContacts } = useSelector(
    (UserContact: RootState) => UserContact.getUserContacts
  );

  const handleAddContactsToGroup = async () => {
    setLoading(true);
    try {
      if (aeskey) {
        const res = await encryptedAESkeyWithUsersPublicKey(
          aeskey,
          selectedUsers
        );
        // array of object holding new contacts encrypted aes key and user_id
        const encryptedAesKeyOfContacts = await Promise.all(res);
        if (
          selectedUsers.length > 0 &&
          group_id &&
          encryptedAesKeyOfContacts.length > 0
        ) {
          await addContactsToGroup(
            selectedUsers,
            group_id,
            encryptedAesKeyOfContacts
          );
          setLoading(false);
          setOpen(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          onClick={() => setOpen(true)}
          className="w-full flex flex-row items-center gap-4 p-2 hover:bg-black/40"
        >
          <UserPlus className="rounded-full bg-background p-2" size={40} /> Add
          members
        </DialogTrigger>
        <DialogContent
          className="gap-0 p-2 outline-none"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-4 pb-4 pt-5">
            <DialogTitle>Add Members</DialogTitle>
          </DialogHeader>
          <Command className="overflow-hidden rounded-t-none border-t bg-transparent">
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {userContacts.map((user: any) => (
                  <CommandItem
                    key={user._id}
                    className="flex items-center px-2"
                    onSelect={() => {
                      if (selectedUsers.includes(user)) {
                        return setSelectedUsers(
                          selectedUsers.filter(
                            (selectedUser) => selectedUser !== user
                          )
                        );
                      }

                      return setSelectedUsers([...selectedUsers, user]);
                    }}
                  >
                    <Avatar>
                      <AvatarImage src={user.contact_image} alt="Image" />
                      <AvatarFallback>{user.contact_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-2">
                      <p className="text-sm font-medium leading-none">
                        {user.contact_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.contact_email}
                      </p>
                    </div>
                    {selectedUsers.includes(user) ? (
                      <Check className="ml-auto flex h-5 w-5 text-primary" />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
            {selectedUsers.length > 0 ? (
              <div className="flex -space-x-2 overflow-hidden">
                {selectedUsers.map((user) => (
                  <Avatar
                    key={user.contact_email}
                    className="inline-block border-2 border-background"
                  >
                    <AvatarImage src={user.contact_image} />
                    <AvatarFallback>{user.contact_name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Select users to add to this thread.
              </p>
            )}
            <Button
              disabled={selectedUsers.length < 1}
              onClick={handleAddContactsToGroup}
            >
              {loading ? <Loader /> : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddContactToGroup;
