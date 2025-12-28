"use client";
import { useRouter } from "next/navigation";
import { SignIn } from "../../components/pages/signin";
import { RouterLayout } from "../../components/router-layout";

export default function SignInRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <SignIn onToggleMode={() => router.push('/signup')} />
    </RouterLayout>
  );
}
