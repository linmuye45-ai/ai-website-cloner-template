import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORTED_LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      text?: string;
      lang?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
    };

    if (!body.text || !body.text.trim()) {
      return NextResponse.json(
        { ok: false, error: "text required" },
        { status: 400 }
      );
    }

    const langRaw = body.lang as string;
    const lang = SUPPORTED_LOCALES.includes(langRaw as (typeof SUPPORTED_LOCALES)[number])
      ? langRaw
      : "zh-CN";
    const rate = Math.min(Math.max(Number(body.rate ?? 1.0), 0.1), 2.0);
    const pitch = Math.min(Math.max(Number(body.pitch ?? 1.0), 0.1), 2.0);
    const volume = Math.min(Math.max(Number(body.volume ?? 1.0), 0.0), 1.0);

    // Server-side acknowledgement: client performs actual synthesis via
    // Web Speech API (window.speechSynthesis) so no external TTS provider
    // or API key is required — fully offline, zero-cost, WCAG-compliant.
    return NextResponse.json({
      ok: true,
      accepted: true,
      text: body.text.trim(),
      lang,
      rate,
      pitch,
      volume,
      engine: "browser-speech-synthesis",
      note:
        "Client synthesizes via window.speechSynthesis; server only validates input.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "TTS error" },
      { status: 500 }
    );
  }
}
