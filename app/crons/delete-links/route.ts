import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  // Fetch all links (include created_at)
  const { data: links, error: linksError } = await supabase
    .from("links")
    .select("id, created_at");

  if (linksError) {
    return NextResponse.json({ error: linksError.message }, { status: 500 });
  }

 // const THIRTY_DAYS_AGO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

 const THIRTY_DAYS_AGO = new Date(Date.now() - 1000 * 60 * 60 * 24 * 1);

  let deletedCount = 0;
  const failed = [];

  for (const link of links || []) {
    const createdAt = new Date(link.created_at);
    if (createdAt > THIRTY_DAYS_AGO) {
      // Link is less than 30 days old, skip it
      continue;
    }

    // Check if there are any clicks in the last 30 days
    const { count, error: clicksError } = await supabase
      .from("clicks")
      .select("id", { count: "exact", head: true })
      .eq("link_id", link.id)
      .gte("created_at", THIRTY_DAYS_AGO.toISOString());

    if (clicksError) {
      failed.push({ linkId: link.id, error: clicksError.message });
      continue;
    }

    if ((count || 0) === 0) {
      // No clicks in the last 30 days, delete the link
      const { error: deleteError } = await supabase
        .from("links")
        .delete()
        .eq("id", link.id);
      if (deleteError) {
        failed.push({ linkId: link.id, error: deleteError.message });
      } else {
        deletedCount++;
      }
    }
  }

  return NextResponse.json({ deleted: deletedCount, failed }, { status: 200 });
}
