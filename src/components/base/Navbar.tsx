import React from "react";
// import { Button } from "../ui/button";

import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className="border-grid sticky top-0 z-50 w-full border-b border-gray-500 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 px-2">
        <nav className="container-wrapper">
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
                <Button
                  onClick={() => navigate("/login-or-signup")}
                  className="text-foreground bg-background hover:bg-background/60"
                >
                  Getting start
                </Button>
              </nav>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
