import { SubjectPage } from "@/pages/subject";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/subject/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SubjectPage />;
}
