import { AdminLayoutWrapper } from "@/components/AdminLayoutWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | RC3ID Guestbook",
  description: "Admin panel for managing RC3ID digital guestbook.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
}
