import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parishDetails, registrations, totalFee } = body;

    // Basic validation
    if (!parishDetails?.email || !parishDetails?.parishName || !parishDetails?.representativeName || !parishDetails?.contactNumber) {
      return NextResponse.json(
        { success: false, error: "Please provide all required parish and representative details." },
        { status: 400 }
      );
    }

    const eventKeys = Object.keys(registrations || {});
    if (eventKeys.length === 0) {
      return NextResponse.json(
        { success: false, error: "Please select and register participants for at least one event." },
        { status: 400 }
      );
    }

    // Validate that all participants have a valid name and mandatory gender
    let totalParticipants = 0;
    for (const key of eventKeys) {
      const reg = registrations[key];
      if (!reg?.participants || reg.participants.length === 0) {
        return NextResponse.json(
          { success: false, error: `No participants added for ${reg?.title || key}.` },
          { status: 400 }
        );
      }
      totalParticipants += reg.participants.length;
      for (const p of reg.participants) {
        if (!p.name?.trim()) {
          return NextResponse.json(
            { success: false, error: `Participant name cannot be blank in ${reg.title || key}.` },
            { status: 400 }
          );
        }
        if (!p.gender || (p.gender !== "Male" && p.gender !== "Female")) {
          return NextResponse.json(
            { success: false, error: `Gender is mandatory for all participants in ${reg.title || key}. Please select Male or Female.` },
            { status: 400 }
          );
        }
      }
    }

    // Generate unique registration code
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const sanitizedParish = (parishDetails.parishName || "PARISH")
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 6)
      .toUpperCase();
    const registrationId = `SELAH26-${sanitizedParish}-${randomSuffix}`;
    const timestamp = new Date().toISOString();

    // Clean parish details to store exactly what was submitted in the form
    const cleanedParishDetails = {
      parishName: parishDetails.parishName?.trim() || "",
      representativeName: parishDetails.representativeName?.trim() || "",
      contactNumber: parishDetails.contactNumber?.trim() || "",
      email: parishDetails.email?.trim() || "",
    };

    // Firebase Firestore schema matching ONLY fields present in the form
    const record = {
      registrationId,
      timestamp,
      parishDetails: cleanedParishDetails,
      totalFee: typeof totalFee === "number" ? totalFee : Number(totalFee) || 0,
      eventsCount: eventKeys.length,
      totalParticipants,
      events: registrations,
    };

    // 1. Save to Firebase Cloud Firestore
    let savedToFirestore = false;
    let firestoreError: string | null = null;
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (projectId) {
        const { db } = await import("@/lib/firebase");
        const { doc, setDoc } = await import("firebase/firestore");
        await setDoc(doc(db, "registrations", registrationId), record);
        savedToFirestore = true;
        console.log(`[Firebase] Successfully stored registration ${registrationId} in Firestore collection 'registrations'.`);
      } else {
        console.warn("[Firebase] Firestore save skipped: No FIREBASE_PROJECT_ID configured in environment.");
      }
    } catch (fbErr: any) {
      firestoreError = fbErr?.message || String(fbErr);
      console.error(`[Firebase] Failed to save registration ${registrationId} to Firestore:`, fbErr);
    }

    // 2. Save record to local JSON database file (as fallback / local backup)
    const dataDir = path.join(process.cwd(), "data");
    await fs.mkdir(dataDir, { recursive: true });
    const filePath = path.join(dataDir, "registrations.json");

    let currentRegistrations: any[] = [];
    try {
      const fileData = await fs.readFile(filePath, "utf-8");
      currentRegistrations = JSON.parse(fileData);
      if (!Array.isArray(currentRegistrations)) {
        currentRegistrations = [];
      }
    } catch {
      currentRegistrations = [];
    }

    currentRegistrations.push(record);
    await fs.writeFile(filePath, JSON.stringify(currentRegistrations, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      registrationId,
      timestamp,
      savedToFirestore,
      firestoreError: firestoreError || null,
      message: "Registration submitted successfully!",
      summary: {
        parishName: cleanedParishDetails.parishName,
        representativeName: cleanedParishDetails.representativeName,
        email: cleanedParishDetails.email,
        contactNumber: cleanedParishDetails.contactNumber,
        eventsCount: eventKeys.length,
        totalParticipants,
        totalFee: record.totalFee,
      },
    });
  } catch (error: any) {
    console.error("Registration submission error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process registration." },
      { status: 500 }
    );
  }
}
