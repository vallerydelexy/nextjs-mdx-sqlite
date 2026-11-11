import "server-only";
import { auth } from "@/auth";

export async function getAdminSession() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase();

  if (!email || email !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    return null;
  }

  return session;
}
