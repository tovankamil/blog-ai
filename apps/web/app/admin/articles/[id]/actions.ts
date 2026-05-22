"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "../../../../lib/admin-session";
import {
  enqueueGenerateDraft,
  enqueuePlagiarismCheck,
  publishAdminArticle,
  scheduleAdminArticle,
  updateAdminArticle,
} from "../../../../lib/api";

function redirectWithMessage(id: string, kind: "error" | "success", message: string) {
  const params = new URLSearchParams({
    [kind]: message,
  });

  redirect(`/admin/articles/${id}?${params.toString()}`);
}

export async function saveArticleAction(id: string, formData: FormData) {
  await requireAdminSession();

  const payload = {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content_md: String(formData.get("content_md") ?? ""),
    content_html: String(formData.get("content_html") ?? ""),
    status: String(formData.get("status") ?? ""),
    category_slug: String(formData.get("category_slug") ?? ""),
    meta_title: String(formData.get("meta_title") ?? ""),
    meta_description: String(formData.get("meta_description") ?? ""),
    cover_image_url: String(formData.get("cover_image_url") ?? ""),
  };

  const result = await updateAdminArticle(id, payload);
  if (!result.ok) {
    redirectWithMessage(id, "error", result.error);
  }

  revalidatePath(`/admin/articles/${id}`);
  revalidatePath("/admin/articles");
  revalidatePath("/");
  redirectWithMessage(id, "success", "Article saved");
}

export async function triggerWorkflowAction(id: string, formData: FormData) {
  await requireAdminSession();

  const action = String(formData.get("workflow_action") ?? "");

  const result =
    action === "generate_draft"
      ? await enqueueGenerateDraft(id)
      : action === "plagiarism_check"
        ? await enqueuePlagiarismCheck(id)
        : action === "publish"
          ? await publishAdminArticle(id)
          : action === "schedule"
            ? await scheduleAdminArticle(id)
            : {
                ok: false as const,
                error: "unknown workflow action",
              };

  if (!result.ok) {
    redirectWithMessage(id, "error", result.error);
  }

  revalidatePath(`/admin/articles/${id}`);
  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/");
  redirectWithMessage(id, "success", `Action completed: ${action}`);
}
