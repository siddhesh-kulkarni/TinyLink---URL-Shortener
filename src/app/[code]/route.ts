import { NextRequest, NextResponse } from "next/server";
import { Link } from "@/app/models/Link";
import { initDB } from "@/app/lib/init";

// Initialize database connection
let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
}

/**
 * GET /:code - Redirect to original URL
 * Returns 302 redirect if link exists, 404 if not
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await ensureDB();
    const { code } = await params;

    const link = await Link.findByPk(code);

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 });
    }

    // Increment click count and update last clicked time
    const currentClicks = (link.get("clicks") as number) || 0;
    await link.update({
      clicks: currentClicks + 1,
      lastClicked: new Date(),
    });

    // Return 302 redirect
    const url = link.get("url") as string;
    return NextResponse.redirect(url, { status: 302 });
  } catch (error) {
    console.error("Error redirecting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

