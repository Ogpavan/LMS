import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  const { data, error } = await supabase.from("test").select("*").limit(1);
  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
  return Response.json({ success: true, data });
}
