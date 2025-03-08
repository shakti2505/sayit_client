import { useEffect, useState } from "react";

const useNotification = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
      });
    }
  }, []);

  return permission;
};

export default useNotification;
