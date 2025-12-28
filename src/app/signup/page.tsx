"use client";
import { useRouter } from "next/navigation";
import { SignUp } from "../../components/pages/signup";
import { RouterLayout } from "../../components/router-layout";

export default function SignUpRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <SignUp onToggleMode={() => router.push('/signin')} />
    </RouterLayout>
  );
}
