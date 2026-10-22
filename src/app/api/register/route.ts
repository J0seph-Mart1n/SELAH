import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parishDetails, registrations, payment, totalFee } = body;

    // Basic validation
    if (!parishDetails?.email || !parishDetails?.parishName || !parishDetails?.representativeName || !parishDetails?.contactNumber) {
      return NextResponse.json(
        { success: false, error: "Please provide all required parish and representative details." },
        { status: 400 }
      );
    }

    if (!payment?.utrNumber) {
      return NextResponse.json(
        { success: false, error: "Payment UTR / Transaction Reference number is required." },
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
    for (const key of eventKeys) {
      const reg = registrations[key];
      if (!reg?.participants || reg.participants.length === 0) {
        return NextResponse.json(
          { success: false, error: `No participants added for ${reg?.title || key}.` },
          { status: 400 }
        );
      }
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

    const record = {
      registrationId,
      timestamp,
      parishDetails,
      totalFee,
      payment: {
        utrNumber: payment.utrNumber,
        payerName: payment.payerName || parishDetails.representativeName,
        paymentDate: payment.paymentDate || timestamp,
        hasScreenshot: Boolean(payment.screenshotBase64 || payment.screenshotName),
        screenshotName: payment.screenshotName || null,
      },
      events: registrations,
    };

    // 1. Save to Firebase Cloud Firestore (if configured)
    let savedToFirestore = false;
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        const { db } = await import("@/lib/firebase");
        const { doc, setDoc } = await import("firebase/firestore");
        await setDoc(doc(db, "registrations", registrationId), record);
        savedToFirestore = true;
        console.log(`[Firebase] Successfully saved registration ${registrationId} to Firestore.`);
      }
    } catch (fbErr: any) {
      console.warn("[Firebase] Could not save to Firestore:", fbErr?.message || fbErr);
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
      message: "Registration submitted successfully!",
      summary: {
        parishName: parishDetails.parishName,
        representativeName: parishDetails.representativeName,
        email: parishDetails.email,
        contactNumber: parishDetails.contactNumber,
        eventsCount: eventKeys.length,
        totalFee,
        utrNumber: payment.utrNumber,
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
