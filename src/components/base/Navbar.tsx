import React from "react";
// import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import GoogleLogin from "../auth/GoogleLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

// import { ModeToggle } from "../mode-toggle";

const Navbar: React.FC = () => {
  const GoogleAuthWrapper = () => {
    // Access the Google Client ID from the environment variable
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    return (
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin></GoogleLogin>
      </GoogleOAuthProvider>
    );
  };

  return (
    <>
      {/* <nav className="p-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl md:text-2xl font-extrabold">SayIt</h1>
        <div className="flex items-center space-x-2 md:space-x-6 text-gray-700">
          <a href="/">Home</a>
          <a href="#features">Features</a>
          <ModeToggle />
          <Dialog>
            <DialogTrigger asChild>
              <Button>Getting start</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Welcome to QuickChat
                </DialogTitle>
                <DialogDescription>
                  QuickChat makes it effortless to create secure chat links and
                  start conversations in seconds.
                </DialogDescription>
              </DialogHeader>
              <GoogleAuthWrapper />
            </DialogContent>
          </Dialog>
        </div>
      </nav> */}
      <header className="border-grid sticky top-0 z-50 w-full border-b border-gray-500 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 px-2">
        <div className="container-wrapper">
          <div className="flex h-14 items-center">
            <div className="mr-4 hidden md:flex">
              <a href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
                <span className="hidden text-3xl font-extrabold lg:inline-block text-foreground">
                  SayIt
                </span>
              </a>
            </div>
            <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
              <nav className="flex items-center gap-2">
                <ModeToggle />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="text-foreground bg-background hover:bg-background/60">
                      Getting start
                    </Button>
                  </DialogTrigger>
                  <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader className="text-foreground">
                      <DialogTitle className="text-2xl">
                        Welcome to QuickChat
                      </DialogTitle>
                      <DialogDescription>
                        QuickChat makes it effortless to create secure chat
                        links and start conversations in seconds.
                      </DialogDescription>
                    </DialogHeader>
                    <GoogleAuthWrapper />
                  </DialogContent>
                </Dialog>
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
