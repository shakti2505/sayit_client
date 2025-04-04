import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

import { Button } from "../ui/button";
import {
  addNewUserToGroup,
  getAllGroupUsers,
} from "./services/chatGroupServices";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store"; // Import AppDispatch type

import { Input } from "../ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ChatUserDialog: React.FC<Props> = ({ open, setOpen }: Props) => {
  const { group_id } = useParams();
  const [newUser, setNewUser] = useState({
    name: "",
    passcode: "",
  });
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [loggedInUserKey, setLoggedInUserKey] = useState("");
  const navigate = useNavigate();

  const { chatGroups } = useSelector(
    (ChatGroups: RootState) => ChatGroups.getGroupByID
  );

  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch

  // const logged_in_user = JSON.parse(localStorage.getItem("user") || "");

  // this function when hitting will check if the local store has data added User stored if not then it will store the new user,if passcode matched
  const onSubmit = async () => {
    const localData = localStorage.getItem(group_id as string);
    if (!localData || localData == null) {
      try {
        if (!group_id) {
          toast.error("Group ID is missing");
          return;
        }
        let payload = {
          user_id: loggedInUserId,
          name: newUser.name,
          group_id: group_id as string,
          chatgroup: chatGroups?._id?.toString() || "",
          key: loggedInUserKey,
        };

        const res = await dispatch(addNewUserToGroup(payload));
        if (res.message === "User added Successfully in group.") {
          setOpen(false);
          dispatch(getAllGroupUsers(group_id));
        }
        localStorage.setItem(group_id as string, JSON.stringify(res.data));
      } catch (error) {
        toast.error("Something went wrong please try again");
      }
    }

    // checing if passcode matches with the entered passcode;

    if (chatGroups?.passcode !== newUser.passcode) {
      toast.error("Please enter correct passcode");
    } else {
      setOpen(false);
    }
  };

  // checking if user is already in added in the group then dialog to add a new user to group will not appear

  useEffect(() => {
    const checkGroupData = () => {
      // Check if group_id exists in localStorage
      const localGroupData = localStorage.getItem(group_id as string);
      if (localGroupData) {
        try {
          const parsedGroupData = JSON.parse(localGroupData);
          if (parsedGroupData.chatgroup) {
            setOpen(false);
          }
        } catch (error) {
          console.error("Error parsing group data:", error);
        }
      }
    };

    const handleUserCheck = () => {
      // Check if user is logged in
      const loggedInUser = localStorage.getItem("user");
      if (!loggedInUser) {
        navigate(`/?group_id=${group_id}`);
      } else {
        try {
          const user = JSON.parse(loggedInUser);
          setLoggedInUserId(user.id);
          setLoggedInUserKey(user.public_key);
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };

    if (group_id) {
      checkGroupData();
      handleUserCheck();
    }
  }, [group_id, navigate]);

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Name and Passcode</DialogTitle>
          <DialogDescription>
            Add your name and passcode to join in room
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <Input
            placeholder="Enter your name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
        </div>
        <div className="mt-2">
          <Input
            placeholder="Enter your passcode"
            value={newUser.passcode}
            onChange={(e) =>
              setNewUser({ ...newUser, passcode: e.target.value })
            }
          />
        </div>
        <div className="mt-2">
          <Button className="w-full" onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatUserDialog;
