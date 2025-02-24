import React, { SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useNavigate } from "react-router-dom";

import { logout } from "./authSlices";
import { useDispatch } from "react-redux";

interface LogoutProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const Logout: React.FC<LogoutProps> = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You’re one click away from freedom! 🚀
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;
