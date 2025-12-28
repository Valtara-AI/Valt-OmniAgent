"use client";
import { useRouter } from "next/navigation";
import { HelpPage } from "../../components/pages/help-page";
import { RouterLayout } from "../../components/router-layout";

export default function HelpRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <HelpPage onBack={() => router.push('/')} />
    </RouterLayout>
  );
}
