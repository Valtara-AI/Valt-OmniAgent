"use client";
import { useRouter } from "next/navigation";
import { AboutPage } from "../../components/pages/about-page";
import { RouterLayout } from "../../components/router-layout";

export default function AboutRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <AboutPage onGetDemo={() => router.push('/signin')} onBack={() => router.push('/')} />
    </RouterLayout>
  );
}
