"use client";
import { useRouter } from "next/navigation";
import { EnterpriseCommandCenter } from "../../components/pages/enterprise-command-center";
import { RouterLayout } from "../../components/router-layout";

export default function CommandCenterRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <EnterpriseCommandCenter onPageChange={(p) => router.push(p)} />
    </RouterLayout>
  );
}
