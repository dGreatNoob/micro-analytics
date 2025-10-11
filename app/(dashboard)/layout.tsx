import type React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <SessionProvider session={session}>
      <DashboardLayout session={session}>{children}</DashboardLayout>
    </SessionProvider>
  );
}

