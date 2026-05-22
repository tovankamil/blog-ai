"use server";

import { redirect } from "next/navigation";
import { createAdminSession } from "../../lib/admin-session";
import { loginAdmin } from "../../lib/api";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await loginAdmin(email, password);
  if (!result.ok) {
    const params = new URLSearchParams({ error: result.error });
    redirect(`/login?${params.toString()}`);
  }

  await createAdminSession(
    result.data.user.email,
    result.data.user.display_name,
    result.data.token,
  );
  redirect("/admin");
}
