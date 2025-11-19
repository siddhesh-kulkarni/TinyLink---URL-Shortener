import { NextRequest, NextResponse } from "next/server";
import { Link } from "@/app/models/Link";
import { initDB } from "@/app/lib/init";
import { isValidUrl, generateCode, isValidCode } from "@/app/lib/utils";

let dbInitialized = false;
async function ensureDB() {
  if (!dbInitialized) {
    await initDB();
    dbInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureDB();
    const links = await Link.findAll({
      order: [["createdAt", "DESC"]],
    });

    const linksData = links?.map?.((link: any) => link.toJSON());
    return NextResponse.json(linksData);
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDB();
    const body = await request.json();
    const { url, code: customCode } = body;

    if (!url || typeof url !== "string" || !isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL. Must be a valid http:// or https:// URL" },
        { status: 400 }
      );
    }

    let code: string;

    if (customCode) {
      if (!isValidCode(customCode)) {
        return NextResponse.json(
          { error: "Custom code must be 6-8 alphanumeric characters" },
          { status: 400 }
        );
      }
      code = customCode;

      const existing = await Link.findByPk(code);
      if (existing) {
        return NextResponse.json(
          { error: "Code already exists" },
          { status: 409 }
        );
      }
    } else {
      let attempts = 0;
      do {
        code = generateCode();
        const existing = await Link.findByPk(code);
        if (!existing) break;
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { error: "Failed to generate unique code" },
            { status: 500 }
          );
        }
      } while (true);
    }

    const link = await Link.create({
      code,
      url,
      clicks: 0,
      lastClicked: null,
    });

    return NextResponse.json(link.toJSON(), { status: 201 });
  } catch (error: any) {
    console.error("Error creating link:", error);
    
    if (error.name === "SequelizeUniqueConstraintError") {
      return NextResponse.json(
        { error: "Code already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create link" },
      { status: 500 }
    );
  }
}

