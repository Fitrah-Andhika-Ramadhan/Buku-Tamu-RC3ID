"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleAttendanceStatus(id: string, currentStatus: boolean) {
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
