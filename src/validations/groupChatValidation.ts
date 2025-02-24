import { z } from "zod";

// validation schema for groupchat
export const createChatSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "Chat title must be 4 characters long." }),
  })
  .required();

export type createChatSchemaType = z.infer<typeof createChatSchema>;

