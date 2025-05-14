import { redirect } from "next/navigation";
import { getCurrentUser, getRedirectUrl } from "@/lib/auth";
import RegisterForm from "./registerForm";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    const redirectUrl = getRedirectUrl(user);
    redirect(redirectUrl);
  }

  return <RegisterForm />;
}
