"use server";
import { z } from "zod";

const passwordRegex = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
  )

const checkUsername = (username: string) => !username.includes(" potato");

const checkPasswords = ({password, confirm_password}:{password: string, confirm_password: string}) => password === confirm_password;

const formSchema = z.object({
  username: z.string().min(3, "Way too short!").max(20, "That is too long!").toLowerCase().trim().transform((username) => `🔥 ${username} 🔥`).refine(checkUsername, "No potatoes allowed!"),
  email: z.string().email().toLowerCase(),
  password: z.string().min(4).regex(passwordRegex, "A password must have lowercase, UPPERCASE, a number and a special characters."),
  confirm_password: z.string().min(4)
}).refine(checkPasswords, {
  message: "Both passwords must to be same!",
  path: ["confirm_password"],
});

export async function createAccount(prevState:any, formData:FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password")
  }
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data)
  }
}