import { createFileRoute } from "@tanstack/react-router";
import ContentPage from "@/components/content/ContentPage";

export const Route = createFileRoute("/content/")({
  component: ContentIndexPage,
});

function ContentIndexPage() {
  return <ContentPage />;
}
