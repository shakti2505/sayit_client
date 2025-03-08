import React, { useEffect } from "react";
import {
  ArchiveX,
  MonitorSmartphone,
  Inbox,
  Send,
  Trash2,
  Search,
} from "lucide-react";
import { NavUser } from "../components/NavUser";
// import { Label } from "../components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../components/ui/sidebar";
import GroupChatCard from "./groupChat/pages/GroupChatCard";
// import ChatSidebar from "./chats/ChatSideBar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import AddNewContact from "./Contacts/pages/AddNewContact";
import UsersContacts from "./Contacts/pages/UsersContacts";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store/store"; // Import AppDispatch type
import { getUsersContacts } from "./Contacts/services/AddNewUserServices";
import LinkDevice from "./Link device/LinkDevice";

// Menu items.
// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Chats",
      url: "#",
      icon: Inbox,
      isActive: false,
    },
    {
      title: "Link Device",
      url: "#",
      icon: MonitorSmartphone,
      isActive: false,
    },
    {
      title: "Sent",
      url: "#",
      icon: Send,
      isActive: false,
    },
    {
      title: "Junk",
      url: "#",
      icon: ArchiveX,
      isActive: false,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
      isActive: false,
    },
  ],
};

export function AppSidebar() {
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  const useAppDispatch: () => AppDispatch = useDispatch;
  const dispatch = useAppDispatch(); // Typed dispatch
  // fetching logged in user
  // const logged_in_user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    dispatch(getUsersContacts());
  }, []);

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r "
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <SidebarTrigger />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Collapse</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b">
          <div className="rounded-lg flex p-2 border-none outline-none bg-background">
            <Search />
            <input
              type="text"
              className=" w-full bg-background border-none outline-none text-muted-foreground text-base font-semibold"
              placeholder=""
              id=""
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {activeItem.title === "Chats" && (
              <SidebarGroupContent>
                <Tabs defaultValue="groups">
                  <TabsList className="gap-1 sticky top-0 w-full z-20">
                    <TabsTrigger
                      className="rounded-full font-thin bg-muted"
                      value="all"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-full font-thin bg-muted"
                      value="unread"
                    >
                      Unread
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-full font-thin bg-muted"
                      value="Contacts"
                    >
                      Contacts
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-full font-thin bg-muted"
                      value="groups"
                    >
                      Groups
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="account">
                    Make changes to your account here.
                  </TabsContent>
                  <TabsContent value="password"></TabsContent>
                  <TabsContent value="Contacts">
                    <AddNewContact />
                    <UsersContacts />
                  </TabsContent>
                  <TabsContent value="groups">
                    {" "}
                    <GroupChatCard />
                  </TabsContent>
                </Tabs>
              </SidebarGroupContent>
            )}
            {activeItem.title === "Link Device" && (
              <SidebarGroupContent>
                <LinkDevice />
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
