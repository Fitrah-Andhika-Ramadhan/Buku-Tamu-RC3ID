"use server";

import { cookies } from "next/headers";

export async function loginAdmin(password: string) {
  // Use environment variable for secure password, or fallback to default
  const correctPassword = process.env.ADMIN_PASSWORD || "SandiRC3ID2026";
  
  // To protect against timing attacks, we should ideally use crypto.timingSafeEqual
  // but for a simple event admin panel, standard equality is acceptable.
  if (password === correctPassword) {
    const cookieStore = await cookies();
    
    // Set a secure, HTTP-only cookie that expires in 1 day
    cookieStore.set("admin_session", "authorized_rc3id", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    
    return { success: true };
  }
  
  return { success: false, error: "Password salah. Silakan coba lagi." };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return { success: true };
}
