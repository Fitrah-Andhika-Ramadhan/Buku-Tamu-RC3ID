"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleAttendanceStatus(id: string, currentStatus: boolean) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  
  if (session !== 'authorized_rc3id') {
    return { success: false, error: "Unauthorized access" };
  }

  try {
    await db.participant.update({
      where: { id },
      data: {
        status_hadir: !currentStatus,
        waktu_hadir: !currentStatus ? new Date() : null,
      }
    });
    
    // Revalidate paths to update UI
    revalidatePath("/admin/peserta");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle status:", error);
    return { success: false };
  }
}
