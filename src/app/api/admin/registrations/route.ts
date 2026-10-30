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

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "registrations.json");

    // 2. Clear local storage and add the records from Firebase into local storage
    if (firestoreConnected) {
      try {
        await fs.mkdir(dataDir, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(registrations, null, 2), "utf-8");
        source = "firestore";
      } catch (fsErr: any) {
        console.warn("[Admin API] Could not sync records to local storage:", fsErr?.message);
      }
    } else {
      // 3. Fallback: If Firestore is offline or fails, read from local storage backup
      try {
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
        { success: false, error: "Unauthorized access. Please log in as admin." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { registrationId, id } = body || {};

    const targetId = (registrationId || id || "").trim();
    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "registrationId is required." },
        { status: 400 }
      );
    }

    let deletedFromFirestore = false;
    let firestoreError: string | null = null;

    // 1. Delete from Firestore
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId) {
        const { db } = await import("@/lib/firebase");
        const { doc, deleteDoc, collection, query, where, getDocs } = await import("firebase/firestore");

        // 1a. Attempt direct doc deletion by targetId
        try {
          await deleteDoc(doc(db, "registrations", targetId));
          deletedFromFirestore = true;
        } catch (e: any) {
          console.warn("[Admin API] Direct delete by targetId failed:", e?.message);
        }

        // 1b. Attempt direct doc deletion by id if provided and different
        if (id && id.trim() !== targetId) {
          try {
            await deleteDoc(doc(db, "registrations", id.trim()));
            deletedFromFirestore = true;
          } catch (e: any) {
            console.warn("[Admin API] Direct delete by id failed:", e?.message);
          }
        }

        // 1c. Also query Firestore collection for documents where registrationId == targetId
        // This is crucial when documents were created with auto-generated document IDs!
        try {
          const q = query(collection(db, "registrations"), where("registrationId", "==", targetId));
          const querySnap = await getDocs(q);
          for (const docSnap of querySnap.docs) {
            await deleteDoc(docSnap.ref);
            deletedFromFirestore = true;
          }
        } catch (qErr: any) {
          console.warn("[Admin API] Query delete by registrationId field failed:", qErr?.message);
        }
      }
    } catch (fbErr: any) {
      firestoreError = fbErr?.message || String(fbErr);
      console.warn("[Admin API] Could not delete from Firestore:", firestoreError);
    }

    // 2. Delete from local JSON backup
    let deletedFromLocal = false;
    try {
      const filePath = path.join(process.cwd(), "data", "registrations.json");
      const raw = await fs.readFile(filePath, "utf-8");
      const localData = JSON.parse(raw);
      if (Array.isArray(localData)) {
        const initialCount = localData.length;
        const filtered = localData.filter((item) => {
          const itemRegId = (item.registrationId || "").trim();
          const itemId = (item.id || "").trim();
          if (targetId && (itemRegId === targetId || itemId === targetId)) return false;
          if (id && (itemRegId === id.trim() || itemId === id.trim())) return false;
          return true;
        });

        if (filtered.length !== initialCount) {
          deletedFromLocal = true;
          await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
        }
      }
    } catch (fsErr: any) {
      console.warn("[Admin API] Failed to update local JSON backup:", fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${targetId} deleted successfully.`,
      deletedFromFirestore,
      deletedFromLocal,
      firestoreError,
    });
  } catch (error: any) {
    console.error("[Admin Delete Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete registration." },
      { status: 500 }
    );
  }
}
