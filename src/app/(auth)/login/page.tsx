import { redirect } from "next/navigation";
import { getCurrentUser, getRedirectUrl } from "@/lib/auth";
import LoginForm from "./loginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    const redirectUrl = getRedirectUrl(user);
    redirect(redirectUrl);
  }

  return <LoginForm />;
}