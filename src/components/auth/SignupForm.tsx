import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import GoogleAuthWrapper from "./GoogleAuthWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignupSchemaType,
  createSignupSchema,
} from "../../validations/authValidation/SignupformValidation";
import { signupWithEmail } from "./authServices";
import { useState } from "react";
import Loader from "../common/Loader";
export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(createSignupSchema),
  });

  const onSubmit = async (payload: SignupSchemaType) => {
    setLoading(true);
    try {
      const res = await signupWithEmail(payload);
      if (res) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to SayIt</CardTitle>
          <CardDescription>Signup with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <GoogleAuthWrapper />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input type="text" {...register("username")} required />
                  <span className="text-red-500">
                    {errors?.username?.message}
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" {...register("email")} required />
                  <span className="text-red-500">{errors?.email?.message}</span>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    required
                  />
                  <span className="text-red-500">
                    {errors?.password?.message}
                  </span>
                </div>
                <Button type="submit" className="w-full">
                  {loading ? <Loader /> : "Signup"}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  );
}
