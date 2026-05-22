"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "../../../../lib/admin-session";
import {
  attachArticleSourceRecord,
  detachArticleSourceRecord,
} from "../../../../lib/api";

function redirectWithMessage(id: string, kind: "error" | "success", message: string) {
  const params = new URLSearchParams({
    [kind]: message,
  });

  redirect(`/admin/articles/${id}?${params.toString()}`);
}

export async function attachSourcePackAction(id: string, formData: FormData) {
  await requireAdminSession();

  const sourceRecordID = String(formData.get("source_record_id") ?? "");
  const note = String(formData.get("source_note") ?? "");

  const result = await attachArticleSourceRecord(id, {
    source_record_id: sourceRecordID,
    note,
  });
  if (!result.ok) {
    redirectWithMessage(id, "error", result.error);
  }

  revalidatePath(`/admin/articles/${id}`);
  redirectWithMessage(id, "success", "Source record attached");
}

export async function detachSourcePackAction(id: string, formData: FormData) {
  await requireAdminSession();

  const sourceRecordID = String(formData.get("source_record_id") ?? "");
  const result = await detachArticleSourceRecord(id, sourceRecordID);
  if (!result.ok) {
    redirectWithMessage(id, "error", result.error);
  }

  revalidatePath(`/admin/articles/${id}`);
  redirectWithMessage(id, "success", "Source record detached");
}
