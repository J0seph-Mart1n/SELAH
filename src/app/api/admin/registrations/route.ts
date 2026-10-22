import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";

export async function GET() {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Please log in as admin." },
        { status: 401 }
      );
    }

    let registrations: any[] = [];
    let source = "firestore";
    let firestoreConnected = false;

    // 1. Fetch from Firebase Firestore
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId) {
        const { db } = await import("@/lib/firebase");
        const { collection, getDocs } = await import("firebase/firestore");
        const querySnapshot = await getDocs(collection(db, "registrations"));

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          registrations.push({
            ...data,
            id: docSnap.id,
            registrationId: data.registrationId || docSnap.id,
          });
        });

        firestoreConnected = true;
      }
    } catch (fbErr: any) {
      console.warn("[Admin API] Failed to fetch from Firestore:", fbErr?.message || fbErr);
      source = "local-fallback";
    }

    // 2. If Firestore yielded no results or encountered an error, fallback / merge with local backup
    if (registrations.length === 0) {
      try {
        const filePath = path.join(process.cwd(), "data", "registrations.json");
        const raw = await fs.readFile(filePath, "utf-8");
        const localData = JSON.parse(raw);
        if (Array.isArray(localData)) {
          registrations = localData;
          source = "local-backup";
        }
      } catch {
        // file doesn't exist yet or is empty
      }
    }

    // Sort registrations by timestamp descending (newest first)
    registrations.sort((a, b) => {
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({
      success: true,
      count: registrations.length,
      firestoreConnected,
      source,
      registrations,
    });
  } catch (error: any) {
    console.error("[Admin API Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch registrations." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const { registrationId } = await request.json();
    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: "registrationId is required." },
        { status: 400 }
      );
    }

    // 1. Delete from Firestore
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId) {
        const { db } = await import("@/lib/firebase");
        const { doc, deleteDoc } = await import("firebase/firestore");
        await deleteDoc(doc(db, "registrations", registrationId));
      }
    } catch (fbErr: any) {
      console.warn("[Admin API] Could not delete from Firestore:", fbErr?.message);
    }

    // 2. Delete from local JSON backup
    try {
      const filePath = path.join(process.cwd(), "data", "registrations.json");
      const raw = await fs.readFile(filePath, "utf-8");
      const localData = JSON.parse(raw);
      if (Array.isArray(localData)) {
        const filtered = localData.filter((item) => item.registrationId !== registrationId);
        await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${registrationId} deleted successfully.`,
    });
  } catch (error: any) {
    console.error("[Admin Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete registration." },
      { status: 500 }
    );
  }
}
