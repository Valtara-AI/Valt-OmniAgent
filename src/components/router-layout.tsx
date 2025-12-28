"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-context";
import { Layout } from "./layout";
import { Toaster } from "./ui/sonner";

const PUBLIC_PAGES = new Set([
  "/",
  "/about",
  "/contact",
  "/help",
  "/privacy",
  "/terms",
  "/auth",
  "/signin",
  "/signup",
]);

export const RouterLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const lastPathRef = useRef(pathname);

  useEffect(() => {
    if (isLoading) return;
    let target: string | null = null;
    if (user) {
      if (pathname === "/" || pathname === "/signin" || pathname === "/signup") {
        target = "/command-center";
      }
    } else {
      if (!PUBLIC_PAGES.has(pathname)) {
        target = "/";
      }
    }
    if (target && target !== pathname) {
      setRedirecting(true);
      router.replace(target);
    } else {
      setRedirecting(false);
    }
  }, [pathname, user, isLoading, router]);

  const handlePageChange = (page: string) => {
    if (page !== pathname) {
      router.push(page);
    }
  };

  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Determine what page Layout should highlight (after potential redirect)
  const current = lastPathRef.current !== pathname ? pathname : pathname;
  lastPathRef.current = current;

  return (
    <Layout currentPage={current} onPageChange={handlePageChange} isAuthenticated={!!user}>
      {children}
      <Toaster />
    </Layout>
  );
};
