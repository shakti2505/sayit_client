import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LoginForm } from "../auth/LoginForm";
import { SignupForm } from "../auth/SignupForm";
import { ArrowLeftCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QrReader from "../Link device/QrReader";
interface Props {
  // define your props here
}

const LoginSignupPage: React.FC<Props> = () => {
  const navigate = useNavigate();
  const [openQrReader, setOpenQrReader] = useState(false);

  return (
    <>
      <div className="flex items-start justify-start bg-background">
        <button className="p-1" onClick={() => navigate("/")}>
          <ArrowLeftCircleIcon size={45} strokeWidth={1} />
        </button>
      </div>
      <div className="flex flex-row items-start justify-center bg-background text-muted-foreground gap-6 p-6 md:p-10 ">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Tabs defaultValue="signup" className="">
            <TabsList className="w-full">
              <TabsTrigger value="login" className="w-full">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="w-full">
                Signup
              </TabsTrigger>
              <TabsTrigger value="linkDevice" className="w-full">
                Link Device
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="w-full ">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="w-full">
              <SignupForm />
            </TabsContent>
            <TabsContent value="linkDevice" className="w-full">
              <div className="flex flex-row justify-center items-center w-full h-96 border rounded-xl p-2">
                <QrReader
                  openQrReader={openQrReader}
                  setOpenQrReader={setOpenQrReader}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default LoginSignupPage;
