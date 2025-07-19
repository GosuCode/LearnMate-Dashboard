import { createFileRoute } from "@tanstack/react-router";
import { ContentForm } from "@/components/forms/ContentForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { contentApi } from "@/lib/api";
import type {
  CreateContentRequest,
  UpdateContentRequest,
} from "@/types/content";

export const Route = createFileRoute("/content/create")({
  component: CreateContentPage,
});

function CreateContentPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateContent = async (
    data: CreateContentRequest | UpdateContentRequest
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);
      // Since this is a create page, we know the data will be CreateContentRequest
      const createData = data as CreateContentRequest;
      const response = await contentApi.createContent(createData);
      if (response.success && response.data) {
        navigate({ to: "/content" });
      } else {
        setError(response.error || "Failed to create content");
      }
    } catch (error) {
      setError("Failed to create content");
      console.error("Error creating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/content" })}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Content
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
        <p className="text-gray-600 mt-2">
          Add new educational content to your library
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      <ContentForm
        onSubmit={handleCreateContent}
        onCancel={() => navigate({ to: "/content" })}
        isLoading={isSubmitting}
      />
    </div>
  );
}
