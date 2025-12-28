"use client";
import { useRouter } from "next/navigation";
import { PrivacyPage } from "../../components/pages/privacy-page";
import { RouterLayout } from "../../components/router-layout";

export default function PrivacyRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <PrivacyPage onBack={() => router.push('/')} />
    </RouterLayout>
  );
}
