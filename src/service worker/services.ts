import notificationIcon from "../../public/message-circle-white.svg";
export const showNotification = async (title: string, body: string) => {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.error("Notifications not supported.");
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  registration.showNotification(title, {
    body: body,
    icon: notificationIcon,
  });
};
