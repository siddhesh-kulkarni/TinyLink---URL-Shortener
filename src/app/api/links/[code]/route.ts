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

    return NextResponse.json(link.toJSON());
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.json(
      { error: "Failed to fetch link" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await link.destroy();
    return NextResponse.json({ message: "Link deleted successfully" });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { error: "Failed to delete link" },
      { status: 500 }
    );
  }
}

//links/:[code]