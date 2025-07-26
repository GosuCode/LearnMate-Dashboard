import { SemesterPage } from "@/pages/semester";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/semester/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SemesterPage />;
}
