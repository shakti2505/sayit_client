self.addEventListener("push", (event) => {
    const options = {
      body: "You have a new notification!",
      icon: "/icon.png",
    };
  
    event.waitUntil(self.registration.showNotification("Notification", options));
  });
  