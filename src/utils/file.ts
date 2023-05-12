import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { file_details } from "~/types/file";

export async function getSignedUrls(
    files: file_details[] | null,
    supabase: SupabaseClient
  ) {
    if (!files) return null;
  
    const { data: signedURLs } = (await supabase.storage
      .from("uploaded-files")
      .createSignedUrls(
        files?.map((file) => file?.path ?? "") ?? [],
        60 * 60 * 24 * 365 // One year (in seconds)
      )) as { data: { signedUrl: string }[] | null };
  
    return signedURLs;
  }

export async function uploadFile(
    file: File,
    filePath: string,
    supabase: SupabaseClient,
  ) {
    return (await supabase.storage
        .from("uploaded-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        })) as { data: { path: string }; error: unknown };
  }