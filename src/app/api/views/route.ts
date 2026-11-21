import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "views.json");

async function readLocalViews(): Promise<number> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return typeof parsed?.views === "number" ? parsed.views : 0;
  } catch {
    return 0;
  }
}

async function writeLocalViews(views: number): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({ views }, null, 2), "utf-8");
  } catch {
    // Ignore filesystem errors on read-only serverless environments (e.g. Vercel)
  }
}

function hasFirebaseConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  );
}

export async function GET() {
  try {
    if (hasFirebaseConfig()) {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, "analytics", "site_views"));
        const views = snap.exists() && typeof snap.data()?.views === "number" ? snap.data().views : 0;
        return NextResponse.json({ success: true, views });
      } catch (err) {
        console.warn("[Views API] Firestore GET failed, falling back to local:", err);
      }
    }

    const views = await readLocalViews();
    return NextResponse.json({ success: true, views });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch viewer count.";
    return NextResponse.json({ success: false, views: 0, error: message }, { status: 500 });
  }
}

export async function POST() {
  try {
    if (hasFirebaseConfig()) {
      try {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc, setDoc, increment } = await import("firebase/firestore");
        const docRef = doc(db, "analytics", "site_views");
        await setDoc(docRef, { views: increment(1) }, { merge: true });
        const snap = await getDoc(docRef);
        const views = snap.exists() && typeof snap.data()?.views === "number" ? snap.data().views : 1;
        await writeLocalViews(views);
        return NextResponse.json({ success: true, views });
      } catch (err) {
        console.warn("[Views API] Firestore POST failed, falling back to local:", err);
      }
    }

    const current = await readLocalViews();
    const views = current + 1;
    await writeLocalViews(views);
    return NextResponse.json({ success: true, views });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to increment viewer count.";
    return NextResponse.json({ success: false, views: 0, error: message }, { status: 500 });
  }
}
