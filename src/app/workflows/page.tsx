"use client";
import { WorkflowBuilder } from "../../components/pages/workflow-builder";
import { RouterLayout } from "../../components/router-layout";

export default function WorkflowsRoute() {
  return (
    <RouterLayout>
      <WorkflowBuilder />
    </RouterLayout>
  );
}
