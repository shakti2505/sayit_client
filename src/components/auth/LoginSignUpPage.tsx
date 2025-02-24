import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LoginForm } from "../auth/LoginForm";
import { SignupForm } from "../auth/SignupForm";
import { ArrowLeftCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface Props {
  // define your props here
}

const LoginSignupPage: React.FC<Props> = () => {
  const navigate = useNavigate();
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
            </TabsList>
            <TabsContent value="login" className="w-full ">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="w-full">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default LoginSignupPage;
