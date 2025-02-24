import { z } from "zod";

// validation schema form signup form
export const createLoginSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "This field is required" })
      .email("This is not a valid email"),
    password: z
      .string()
      .min(8, { message: "Password must be 8 characters long." }),
  })
  .required();

export type LoginSchemaType = z.infer<typeof createLoginSchema>;
