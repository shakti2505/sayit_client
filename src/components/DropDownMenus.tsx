import CreateChatGroup from "./groupChat/pages/CreateChatGroup";
import AddNewContact from "./Contacts/pages/AddNewContact";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
const DropdownMenus = () => {
  // Handle clicks outside the dropdown

  return (
    <div className="flex flex-row justify-between items-center gap-5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="rounded-full border p-2 active:bg-background focus:bg-background shadow">
              <CreateChatGroup />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>New group</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="rounded-full border p-2 active:bg-background focus:bg-background shadow">
              <AddNewContact />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>New contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default DropdownMenus;
