"use client";
import { useRouter } from "next/navigation";
import { ContactPage } from "../../components/pages/contact-page";
import { RouterLayout } from "../../components/router-layout";

export default function ContactRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <ContactPage onBack={() => router.push('/')} />
    </RouterLayout>
  );
}
