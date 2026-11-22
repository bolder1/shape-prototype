import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { decodeShare, type DecodedShare } from "@/lib/share";
import { gradeByLetter } from "@/features/episode/grades";

// The share-card image for a grade. `?format=og` is the 1200×630 link preview; the default is a 1080×1350 card for posting.
// Rendered with Satori, so layout is flexbox only and every style is inline.

const MINT = "#2BC08A";

// Inter (the app's typeface), vendored in apps/web/assets/fonts (OFL). Satori only has a thin default font otherwise,
// so bold and black weights would silently render regular. Loaded once per server instance.
let fonts: Promise<{ name: string; data: ArrayBuffer; weight: 500 | 800 | 900; style: "normal" }[]> | null = null;
const loadFonts = () => (fonts ??= Promise.all(([500, 800, 900] as const).map(async weight => {
  const buf = await readFile(join(process.cwd(), "assets/fonts", `inter-latin-${weight}-normal.woff`));
  return { name: "Inter", data: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, weight, style: "normal" as const };
})));

function Stat({ value, label, big }: { value: string; label: string; big: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: big ? 64 : 44, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: big ? 26 : 20, opacity: 0.85, letterSpacing: 2 }}>{label.toUpperCase()}</div>
    </div>
  );
}

function Card({ d, og }: { d: DecodedShare; og: boolean }) {
  const g = gradeByLetter(d.g);
  const date = new Date(`${d.d}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const stats = (
    <div style={{ display: "flex", gap: og ? 56 : 80 }}>
      <Stat value={`${d.r}/${d.t}`} label="Right" big={!og} />
      <Stat value={`+${d.x}`} label="XP" big={!og} />
      <Stat value={`${d.s}d`} label="Streak" big={!og} />
    </div>
  );
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", padding: og ? 36 : 48, background: "#0B1020", color: "#fff", fontFamily: "Inter" }}>
      <div style={{ display: "flex", flexDirection: og ? "row" : "column", flex: 1, borderRadius: 40, padding: og ? 48 : 64, backgroundImage: `linear-gradient(135deg, ${g.colors[0]}, ${g.colors[1]})`, border: "4px solid rgba(255,255,255,0.35)", gap: og ? 48 : 0 }}>
        {/* the grade */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: og ? "center" : "flex-start", justifyContent: "center", width: og ? 360 : "auto" }}>
          {!og && <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 4, opacity: 0.9 }}>SHAPE · GRADE CARD</div>}
          <div style={{ fontSize: og ? 300 : 420, fontWeight: 900, lineHeight: 1, marginTop: og ? 0 : 24, textShadow: "0 12px 40px rgba(0,0,0,0.25)" }}>{d.g}</div>
          <div style={{ fontSize: og ? 40 : 56, fontWeight: 800, letterSpacing: 3 }}>{g.label.toUpperCase()}</div>
          <div style={{ fontSize: og ? 26 : 34, opacity: 0.9, marginTop: 6 }}>{`${d.p}% mastery`}</div>
        </div>
        {/* the lesson, stats and who */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, marginTop: og ? 0 : 56 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {og && <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, opacity: 0.9 }}>SHAPE · GRADE CARD</div>}
            <div style={{ fontSize: og ? 26 : 32, opacity: 0.9, marginTop: og ? 18 : 0 }}>{d.chapter}</div>
            <div style={{ fontSize: og ? 52 : 64, fontWeight: 800, lineHeight: 1.1, marginTop: 8 }}>{d.title}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: og ? 28 : 48, marginTop: og ? 24 : 56 }}>
            {stats}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: og ? 24 : 30, opacity: 0.95 }}>
              <div style={{ display: "flex" }}>{d.n}</div>
              <div style={{ display: "flex" }}>{date}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: og ? 22 : 28, fontWeight: 700 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: MINT }} />
              Learn product design by playing it
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function GET(request: Request, { params }: RouteContext<"/api/card/[code]">) {
  const { code } = await params;
  const d = decodeShare(code);
  if (!d) return new Response("Not a valid card", { status: 404 });
  const og = new URL(request.url).searchParams.get("format") === "og";
  return new ImageResponse(<Card d={d} og={og} />, {
    fonts: await loadFonts(),
    width: og ? 1200 : 1080,
    height: og ? 630 : 1350,
    // The card for a given code never changes, so it can be cached hard.
    headers: { "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
