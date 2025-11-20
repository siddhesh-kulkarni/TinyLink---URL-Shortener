import { NextRequest, NextResponse } from "next/server";
import { Link } from "@/app/models/Link";
import { initDB } from "@/app/lib/init";

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
}

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

    const currentClicks = (link.get("clicks") as number) || 0;
    await link.update({
      clicks: currentClicks + 1,
      lastClicked: new Date(),
    });

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

