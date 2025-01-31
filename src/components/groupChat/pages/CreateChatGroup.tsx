import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createChatSchema,
  createChatSchemaType,
} from "../../../validations/groupChatValidation";
import { Button } from "../../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { createChatGroup } from "../services/groupChatServices";
import type { AppDispatch, RootState } from "../../../store/store"; // Import AppDispatch type
import { useUser } from "../../../utils/criticalState";
import Loader from "../../common/Loader";
import { Check, Camera, ArrowLeft } from "lucide-react";

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

const CreateChatGroup: React.FC = () => {
  const { token } = useUser();
  const [selectedUsers, setSelectedUsers] = React.useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [openGroupPicAndNameComponent, setOpenGroupPicAndNameComponent] =
    useState(false);
  // using the state from coponent slice
  const { loading } = useSelector(
    (creteChatGroupState: RootState) => creteChatGroupState.createChatGroupApi
  );
  const { userContacts } = useSelector(
    (UserContact: RootState) => UserContact.getUserContacts
  );

  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createChatSchemaType>({
    resolver: zodResolver(createChatSchema),
  });

  const onSubmit = async (payload: createChatSchemaType) => {
    if (token) {
      const res = await dispatch(createChatGroup(payload, token));
      if (res.message === "Group created successfully") {
        setOpen(false);
        localStorage.setItem(
          res.data._id as string,
          JSON.stringify({
            user_id: res.data.group_admin,
            name: res.data.name,
            chatgroup: res.data._id,
          })
        );
      }
    } else {
      console.error("Token is undefined");
    }
  };

  // const handleGroupNameAndPicComponent = () => {};

  return (
    <>
      {/* <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[hsl(var(--muted))] text-foreground"
          onClick={() => setOpen(true)}
        >
          New group
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="bg-background text-foreground"
      >
        <DialogHeader>
          <DialogTitle>Create Your new chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="mt-4 flex flex-col">
            <input
              placeholder="Enter Chat title "
              {...register("name")}
              className="px-2 border rounded-full h-8 bg-background text-foreground "
            />
            <span className="text-red-500">{errors?.name?.message}</span>
          </div>
          <div className="mt-4 flex flex-col">
            <input
              type="number"
              placeholder="Enter Passcode "
              className="px-2 border rounded-full h-8 bg-background text-foreground"
              {...register("passcode")}
            />
            <span className="text-red-500">{errors?.passcode?.message}</span>
          </div>
          <div className="mt-4 flex flex-col">
            <Button
              className="w-full bg-background text-foreground"
              variant="outline"
              disabled={loading}
            >
              {loading ? <Loader /> : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="bg-[hsl(var(--muted))] text-foreground"
            onClick={() => setOpen(true)}
          >
            New group
          </Button>
        </DialogTrigger>
        <DialogContent
          className="gap-0 p-0 outline-none"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader
            className={
              openGroupPicAndNameComponent ? " hidden" : "px-4 pb-4 pt-5"
            }
          >
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Invite a user to this thread. This will create a new group
              message.
            </DialogDescription>
          </DialogHeader>
          <Command
            className={
              openGroupPicAndNameComponent
                ? "hidden"
                : "overflow-hidden rounded-t-none border-t bg-transparent"
            }
          >
            <CommandInput placeholder="Search user..." />
            <CommandList>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className="p-2">
                {userContacts.map((user) => (
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
          <DialogFooter
            className={
              openGroupPicAndNameComponent
                ? "hidden"
                : "flex items-center border-t p-4 sm:justify-between"
            }
          >
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
              onClick={() => {
                setOpenGroupPicAndNameComponent(true);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
          <div
            className={`flex flex-col items-center ${
              !openGroupPicAndNameComponent ? "hidden" : ""
            }`}
          >
            <div className="w-full p-3">
              <ArrowLeft 
              onClick={()=>setOpenGroupPicAndNameComponent(false)}
              className="rounded-xl hover:cursor-pointer"  />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="w-96">
              <div className="mt-2 flex flex-col items-center">
                <label
                  htmlFor="file"
                  className="w-48 h-48 bg-muted rounded-full border flex items-center  justify-center hover:cursor-pointer"
                >
                  <Camera />
                </label>
                <input type="file" id="file" className="hidden" />
              </div>
              <div className="mt-2 flex flex-col">
                <input
                  placeholder="Enter group title"
                  {...register("name")}
                  className="px-2 border-b  h-8 bg-background text-foreground outline-none "
                />
                <span className="text-red-500">{errors?.name?.message}</span>
              </div>
              <div className="mt-2 flex flex-col">
                <input
                  type="number"
                  placeholder="Enter Passcode "
                  className="px-2 border-b  h-8 bg-background text-foreground outline-none "
                  {...register("passcode")}
                />
                <span className="text-red-500">
                  {errors?.passcode?.message}
                </span>
              </div>
              <div className="mt-4 flex flex-col">
                <Button
                  className="w-full bg-background text-foreground"
                  variant="outline"
                  disabled={loading}
                >
                  {loading ? <Loader /> : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChatGroup;
