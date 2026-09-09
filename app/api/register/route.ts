import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const registerSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  no_wa: z.string().min(10, "Nomor WA tidak valid"),
  email: z.string().email("Format email tidak valid"),
  instansi: z.string().min(2, "Asal instansi wajib diisi"),
  profesi: z.string().min(2, "Profesi wajib diisi"),
  peluang_kolaborasi: z.string().min(2, "Pilih minimal satu peluang kolaborasi"),
  sosmed_follow: z.string().min(1, "Wajib dipilih"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await db.participant.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email ini sudah terdaftar sebelumnya." },
        { status: 400 }
      );
    }

    // Generate Unique IDs
    // For id_peserta, we can use a prefix + random string or timestamp
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const id_peserta = `RC3-${randomSuffix}`;
    
    // For QR Code, we can use the same unique ID or a generated token
    const qr_code = `RC3-QR-${randomSuffix}-${Date.now().toString().slice(-6)}`;

    const participant = await db.participant.create({
      data: {
        ...validatedData,
        id_peserta,
        qr_code,
      }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Registrasi berhasil", 
        participantId: participant.id 
      },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validasi gagal", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
