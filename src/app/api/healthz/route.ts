import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startTime) / 1000); 

  console.log("Health check passed!");
  return NextResponse.json({
    ok: true,
    version: "1.0",
    uptime,
  });
}

