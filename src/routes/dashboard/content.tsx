import { createFileRoute } from "@tanstack/react-router";
import ContentPage from "../../components/content/ContentPage";

export const Route = createFileRoute("/dashboard/content")({
  component: DashboardContentPage,
});

function DashboardContentPage() {
  return <ContentPage />;
}
