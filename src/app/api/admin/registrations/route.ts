import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAuthenticatedAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
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

export async function PUT(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Please log in as admin." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { registrationId, id, parishDetails, events, totalFee } = body || {};

    const targetId = (registrationId || id || "").trim();
    if (!targetId) {
      return NextResponse.json(
        { success: false, error: "registrationId is required." },
        { status: 400 }
      );
    }

    if (
      !parishDetails?.parishName?.trim() ||
      !parishDetails?.representativeName?.trim() ||
      !parishDetails?.contactNumber?.trim() ||
      !parishDetails?.email?.trim()
    ) {
      return NextResponse.json(
        { success: false, error: "All parish and representative details are required." },
        { status: 400 }
      );
    }

    const cleanedParishDetails = {
      parishName: parishDetails.parishName.trim(),
      representativeName: parishDetails.representativeName.trim(),
      contactNumber: parishDetails.contactNumber.trim(),
      email: parishDetails.email.trim(),
    };

    const rawEvents = events && typeof events === "object" ? events : {};
    const eventKeys = Object.keys(rawEvents);
    const cleanedEvents: Record<string, any> = {};
    let totalParticipants = 0;
    let computedTotalFee = 0;

    for (const key of eventKeys) {
      const ev = rawEvents[key];
      if (!ev) continue;

      const participantsList = Array.isArray(ev.participants) ? ev.participants : [];
      if (participantsList.length === 0) {
        return NextResponse.json(
          { success: false, error: `Event "${ev.title || key}" must have at least one participant.` },
          { status: 400 }
        );
      }

      const cleanedParticipants = [];
      for (const p of participantsList) {
        if (!p?.name?.trim()) {
          return NextResponse.json(
            { success: false, error: `Participant name cannot be blank in "${ev.title || key}".` },
            { status: 400 }
          );
        }
        if (!p.gender || (p.gender !== "Male" && p.gender !== "Female")) {
          return NextResponse.json(
            {
              success: false,
              error: `Please select gender (Male or Female) for all participants in "${ev.title || key}".`,
            },
            { status: 400 }
          );
        }
        cleanedParticipants.push({
          id: p.id || `${key}-p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: p.name.trim(),
          gender: p.gender,
          role: (p.role || "Participant").trim(),
          notes: (p.notes || "").trim(),
        });
      }

      const evType = ev.type === "individual" ? "individual" : "group";
      const evFee =
        typeof ev.fee === "number" && !isNaN(ev.fee)
          ? ev.fee
          : evType === "group"
          ? 500
          : cleanedParticipants.length * 200;

      totalParticipants += cleanedParticipants.length;
      computedTotalFee += evFee;

      const eventId = ev.eventId || key;
      cleanedEvents[eventId] = {
        eventId,
        title: ev.title || eventId,
        ...(ev.category ? { category: ev.category } : {}),
        type: evType,
        fee: evFee,
        participants: cleanedParticipants,
      };
    }

    const finalTotalFee =
      typeof totalFee === "number" && !isNaN(totalFee) ? totalFee : computedTotalFee;
    const eventsCount = Object.keys(cleanedEvents).length;

    const updatedFields = {
      parishDetails: cleanedParishDetails,
      events: cleanedEvents,
      eventsCount,
      totalParticipants,
      totalFee: finalTotalFee,
    };

    let updatedInFirestore = false;
    let firestoreError: string | null = null;

    // 1. Update in Firebase Cloud Firestore
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId) {
        const { db } = await import("@/lib/firebase");
        const { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } = await import(
          "firebase/firestore"
        );

        const updatedRefs = new Set<string>();

        // 1a. Check direct doc by targetId
        try {
          const directRef = doc(db, "registrations", targetId);
          const directSnap = await getDoc(directRef);
          if (directSnap.exists()) {
            await updateDoc(directRef, updatedFields);
            updatedRefs.add(directRef.path);
            updatedInFirestore = true;
          }
        } catch (e: any) {
          console.warn("[Admin API] Direct update by targetId failed:", e?.message);
        }

        // 1b. Check direct doc by id if different
        if (id && id.trim() !== targetId) {
          try {
            const idRef = doc(db, "registrations", id.trim());
            if (!updatedRefs.has(idRef.path)) {
              const idSnap = await getDoc(idRef);
              if (idSnap.exists()) {
                await updateDoc(idRef, updatedFields);
                updatedRefs.add(idRef.path);
                updatedInFirestore = true;
              }
            }
          } catch (e: any) {
            console.warn("[Admin API] Direct update by id failed:", e?.message);
          }
        }

        // 1c. Query where registrationId == targetId
        try {
          const q = query(collection(db, "registrations"), where("registrationId", "==", targetId));
          const querySnap = await getDocs(q);
          for (const docSnap of querySnap.docs) {
            if (!updatedRefs.has(docSnap.ref.path)) {
              await updateDoc(docSnap.ref, updatedFields);
              updatedRefs.add(docSnap.ref.path);
              updatedInFirestore = true;
            }
          }
        } catch (qErr: any) {
          console.warn("[Admin API] Query update by registrationId field failed:", qErr?.message);
        }

        // 1d. If document wasn't found via getDoc/query, create/set it directly
        if (!updatedInFirestore) {
          const fallbackRef = doc(db, "registrations", id?.trim() || targetId);
          await setDoc(
            fallbackRef,
            {
              registrationId: targetId,
              timestamp: body.timestamp || new Date().toISOString(),
              ...updatedFields,
            },
            { merge: true }
          );
          updatedInFirestore = true;
        }
      }
    } catch (fbErr: any) {
      firestoreError = fbErr?.message || String(fbErr);
      console.warn("[Admin API] Could not update in Firestore:", firestoreError);
    }

    // 2. Update local JSON backup
    let updatedInLocal = false;
    let updatedRecord: any = {
      ...(id ? { id } : {}),
      registrationId: targetId,
      timestamp: body.timestamp || new Date().toISOString(),
      ...updatedFields,
    };

    try {
      const dataDir = path.join(process.cwd(), "data");
      await fs.mkdir(dataDir, { recursive: true });
      const filePath = path.join(dataDir, "registrations.json");

      let localData: any[] = [];
      try {
        const raw = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          localData = parsed;
        }
      } catch {
        localData = [];
      }

      let matched = false;
      const updatedList = localData.map((item) => {
        const itemRegId = (item.registrationId || "").trim();
        const itemId = (item.id || "").trim();
        const isMatch =
          (targetId && (itemRegId === targetId || itemId === targetId)) ||
          (id && (itemRegId === id.trim() || itemId === id.trim()));

        if (isMatch) {
          matched = true;
          updatedRecord = {
            ...item,
            ...updatedFields,
            registrationId: item.registrationId || targetId,
          };
          return updatedRecord;
        }
        return item;
      });

      if (!matched) {
        updatedList.push(updatedRecord);
      }

      await fs.writeFile(filePath, JSON.stringify(updatedList, null, 2), "utf-8");
      updatedInLocal = true;
    } catch (fsErr: any) {
      console.warn("[Admin API] Failed to update local JSON backup:", fsErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: `Registration ${targetId} updated successfully.`,
      registration: updatedRecord,
      updatedInFirestore,
      updatedInLocal,
      firestoreError,
    });
  } catch (error: any) {
    console.error("[Admin Update Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update registration." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin(request);
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
