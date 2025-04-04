import React from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import UsersContacts from "./Contacts/pages/UsersContacts";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../store/store"; // Import AppDispatch type
// import { getUsersContacts } from "./Contacts/services/AddNewUserServices";
import LinkDevice from "./Link device/LinkDevice";
import DropdownMenus from "./DropDownMenus";

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
  // const useAppDispatch: () => AppDispatch = useDispatch;
  // const dispatch = useAppDispatch(); // Typed dispatch
  // fetching logged in user
  // const logged_in_user = JSON.parse(localStorage.getItem("user") || "{}");

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
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r bg-background"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarTrigger />
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
      <Sidebar
        collapsible="none"
        className="hidden flex-1 md:flex bg-background"
      >
        <SidebarHeader>
          <div className="flex flex-row justify-between items-center relative mt-2">
            <p className="text-foreground text-2xl px-2">Chats</p>
            <DropdownMenus />
          </div>

          <div className="rounded-lg flex p-2 border outline-none bg-background mt-2">
            <Search />
            <input
              type="text"
              className="px-2 w-full bg-background border-none outline-none text-muted-foreground text-base font-semibold"
              placeholder="Search"
              id=""
            />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {activeItem.title === "Chats" && (
              <SidebarGroupContent>
                <Tabs defaultValue="groups" className="">
                  <TabsList className="flex justify-start sticky top-0 w-full z-20 py-5 gap-2 bg-auto">
                    <TabsTrigger
                      className="rounded-full font-thin  text-lg"
                      value="all"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-full font-thin  text-lg"
                      value="unread"
                    >
                      Unread
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-full font-thin  text-lg"
                      value="Contacts"
                    >
                      Contacts
                    </TabsTrigger>
                    <TabsTrigger
                      className="rounded-full font-thin  text-lg"
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
