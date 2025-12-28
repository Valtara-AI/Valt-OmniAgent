"use client";
import { useRouter } from "next/navigation";
import { AgentAssist } from "../../components/pages/agent-assist";
import { RouterLayout } from "../../components/router-layout";

export default function AgentAssistRoute() {
  const router = useRouter();
  return (
    <RouterLayout>
      <AgentAssist onPageChange={(p) => router.push(p)} />
    </RouterLayout>
  );
}
