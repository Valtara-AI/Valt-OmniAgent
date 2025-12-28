"use client";
import { useRouter } from "next/navigation";
import { Dashboard } from "../../components/pages/dashboard";
import { RouterLayout } from "../../components/router-layout";

export default function DashboardRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <Dashboard onPageChange={(p) => router.push(p)} />
    </RouterLayout>
  );
}
