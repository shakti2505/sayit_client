import { z } from "zod";

// validation schema form signup form
export const createSignupSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Username must be minimum 4 characters long." }),
    email: z
      .string()
      .min(1, { message: "This field is required" })
      .email("This is not a valid email"),
    password: z
      .string()
      .min(8, { message: "Password must be 8 characters long." }),
  })
  .required();

export type SignupSchemaType = z.infer<typeof createSignupSchema>;
