import { supabase } from "./supabase";

export type StorageBucket = "product-images" | "seller-assets" | "profile-avatars" | "chat-attachments";

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Supabase Storage.
 * Returns the public URL and storage path.
 */
export const uploadFile = async (
  bucket: StorageBucket,
  file: File,
  folder?: string
): Promise<UploadResult> => {
  const ext = file.name.split(".").pop() ?? "bin";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = folder ? `${folder}/${name}` : name;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
};

export const uploadProductImage = (file: File, sellerId: string) =>
  uploadFile("product-images", file, sellerId);

export const uploadSellerLogo = (file: File, sellerId: string) =>
  uploadFile("seller-assets", file, `${sellerId}/logos`);

export const uploadSellerBanner = (file: File, sellerId: string) =>
  uploadFile("seller-assets", file, `${sellerId}/banners`);

export const uploadAvatar = (file: File, userId: string) =>
  uploadFile("profile-avatars", file, userId);

export const uploadChatAttachment = (file: File, conversationId: string) =>
  uploadFile("chat-attachments", file, conversationId);

export const deleteFile = async (bucket: StorageBucket, path: string): Promise<void> => {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
};
