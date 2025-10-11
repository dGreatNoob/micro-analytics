import type React from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}

