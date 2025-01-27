import { toast } from "sonner";
import { useTheme } from "../components/theme-provider";
import { Switch } from "./ui/switch";
import { useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme === "dark");

  const handleToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    setTheme(checked ? "dark" : "light");
    toast.success(
      checked ? "Switched to Dark Mode" : "Switched to Light mode."
    );
  };
  return <Switch checked={isDarkMode} onCheckedChange={handleToggle} />;
}
