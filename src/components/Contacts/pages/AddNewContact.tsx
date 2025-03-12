import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { MessageCirclePlus, Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { ScrollArea } from "../../../components/ui/scroll-area";

import { addNewContact, searchNewUser } from "../services/AddNewUserServices";
import type { AppDispatch, RootState } from "../../../store/store"; // Import AppDispatch type
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "../../../utils/resuableFunctions";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "../../ui/separator";
import User_skeleton_loader from "../../common/Skeleton loader/User_skeleton_loader";
import Loader from "../../common/Loader";

const AddNewContact: React.FC = () => {
  const [openAddNewContactDialog, setOpenAddNewContactDialog] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState({
    queryCriteria: "",
    query: "",
  });
  const [IsContactAdded, SetIsContactAdded] = useState(false);
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch

  const { newUser, loading } = useSelector(
    (getChatGroup: RootState) => getChatGroup.SearchNewUserReducer
  );

  // handle Add contact to contact list
  const handleAddContact = async (
    contact_id: string,
    contact_name: string,
    contact_image: string,
    contact_email: string,
    contact_public_key: string
  ) => {
    SetIsContactAdded(true);
    const res = await addNewContact(
      contact_id,
      contact_name,
      contact_image,
      contact_email,
      contact_public_key
    );
    if (res === "Contact saved successfully") {
      SetIsContactAdded(false);
    }
  };

  // handle Input for new contact search
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setSearchUserQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchNewUser = async (query: string) => {
    await dispatch(searchNewUser(query));
  };

  // calling the debouncing function with useMemo to cache the result of the HOF(debounc) to call it once and stop re-renders
  const debouncedFetchNewContact = useMemo(
    () => debounce((query: string) => fetchNewUser(query), 1000),
    []
  );

  // calling debounce function when query changes
  useEffect(() => {
    if (searchUserQuery.query.length > 0) {
      debouncedFetchNewContact(searchUserQuery.query);
    }
  }, [searchUserQuery.query]);
  return (
    <>
      <div className="flex flex-row justify-between items-center">
          <Button
            onClick={() => setOpenAddNewContactDialog(true)}
            className="bg-background text-foreground hover:text-black w-full"
          >
            <MessageCirclePlus />
            New contact
          </Button>
        </div>
      <Dialog
        open={openAddNewContactDialog}
        onOpenChange={setOpenAddNewContactDialog}
      >
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="gap-2">
            <DialogTitle>Add a new contact</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group
              message.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col">
            <div className="flex flex-row bg-muted p-1 rounded gap-1 items-center w-full ">
              <Search className="text-muted-foreground" />
              <input
                name="query"
                value={searchUserQuery.query}
                onChange={handleInputChange}
                type="text"
                placeholder={`Search contact by email or name`}
                className="bg-muted text-foreground outline-none px-1 py-1 rounded w-full"
              />
            </div>
            {searchUserQuery.query.length > 0 && loading ? (
              <div className="h-72 w-full rounded-md border mt-1">
                <User_skeleton_loader />
              </div>
            ) : (
              <ScrollArea className="h-72 w-full rounded-md border mt-1">
                <div className="p-4">
                  {newUser.map((item:any) => (
                    <>
                      <div
                        key={item._id}
                        className="text-sm flex flex-row items-center justify-between gap-5 "
                      >
                        <div className="flex flex-row items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              className="rounded-full w-10"
                              src={item.image}
                              alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>{" "}
                          <div className="flex flex-col">
                            <p>{item.name}</p>
                            <p>{item.email}</p>
                          </div>
                        </div>

                        <div>
                          <Button
                            onClick={() =>
                              handleAddContact(
                                item._id,
                                item.name,
                                item.image,
                                item.email,
                                item.public_key
                              )
                            }
                            className="bg-muted text-muted-foreground hover:text-black"
                          >
                            {IsContactAdded ? <Loader /> : <Plus />}
                          </Button>
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddNewContact;
