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
  createLoginSchema,
  LoginSchemaType,
} from "../../validations/authValidation/loginFormValidation";
import { loginWithEmail } from "./authServices";
import { useNavigate } from "react-router-dom";



export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(createLoginSchema),
  });


  const onSubmit = async (payload: LoginSchemaType) => {
    try {
      const res = await loginWithEmail(payload);
      const { name, email, image, _id, public_key } = res.loggedInUser;
      if (res.message === "logged in successfully") {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name,
            email,
            image,
            id: _id,
            public_key,
          })
        );
        navigate("/chats");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to SayIt</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4" >
              <GoogleAuthWrapper  />
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="text">Email</Label>
                  <Input
                    autoFocus
                    id="email"
                    type="text"
                    required
                    placeholder="xyz@gmail.com"
                    {...register("email")}
                  />
                  <span className="text-red-500">{errors?.email?.message}</span>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    autoFocus
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
                  Login
                </Button>
              </div>
            </form>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
