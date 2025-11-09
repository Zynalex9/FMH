import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



export async function uploadProofs({
  files,
  requestId,
}: {
  files: File[];
  requestId: string;
}) {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${ext}`;
    const filePath = `requests/${requestId}/${fileName}`;

    const { error } = await supabase.storage
      .from("fmh_storage")
      .upload(filePath, file, { upsert: false });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("fmh_storage")
      .getPublicUrl(filePath);

    uploadedUrls.push(urlData.publicUrl);
  }

  return uploadedUrls;
}