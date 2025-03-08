// import { useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
// import { HamburgerMenuIcon } from "@radix-ui/react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
// import type { RootState } from "../../store/store"; // Import AppDispatch type
import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "../ui/sidebar";

export default function MobileChatSidebar() {

  // const { data } = useSelector(
  //   (ChatGroupUsers: RootState) => ChatGroupUsers.getAllGroupUsers
  // );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="bg-muted">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Users</SheetTitle>
        </SheetHeader>
        <SidebarProvider>
          <AppSidebar/>
        </SidebarProvider>
      </SheetContent>
    </Sheet>
   
  );
}
