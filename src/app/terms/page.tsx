"use client";
import { useRouter } from "next/navigation";
import { TermsPage } from "../../components/pages/terms-page";
import { RouterLayout } from "../../components/router-layout";

export default function TermsRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <TermsPage onBack={() => router.push('/')} />
    </RouterLayout>
  );
}
