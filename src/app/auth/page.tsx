"use client";
import { AuthPage } from "../../components/pages/auth-page";
import { RouterLayout } from "../../components/router-layout";

export default function AuthRoute() {
  return (
    <RouterLayout>
      <AuthPage />
    </RouterLayout>
  );
}
