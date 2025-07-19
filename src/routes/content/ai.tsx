import { createFileRoute } from "@tanstack/react-router";
import { AIContentForm } from "@/components/forms/AIContentForm";
import { AIResults } from "@/components/content/AIResults";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { contentApi } from "@/lib/api";
import type {
  AIServiceRequest,
  SummaryResponse,
  QuizResponse,
  CategorizeResponse,
} from "@/types/content";

export const Route = createFileRoute("/content/ai")({
  component: AIGenerationPage,
});

function AIGenerationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<{
    type: "summary" | "quiz" | "categorize";
    data: SummaryResponse | QuizResponse | CategorizeResponse;
  } | null>(null);

  const handleAIGeneration = async (data: AIServiceRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await contentApi.generateContent(data);
      if (response.success && response.data) {
        setAiResults({
          type: data.type,
          data: response.data,
        });
      } else {
        setError(response.error || "Failed to generate content");
      }
    } catch (error) {
      setError("Failed to generate content");
      console.error("Error generating content:", error);
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
        <h1 className="text-3xl font-bold text-gray-900">
          AI Content Generation
        </h1>
        <p className="text-gray-600 mt-2">
          Generate summaries, quizzes, or categorize content using AI
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800">
          {error}
        </div>
      )}

      <AIContentForm
        onSubmit={handleAIGeneration}
        onCancel={() => navigate({ to: "/content" })}
        isLoading={isSubmitting}
      />

      {/* AI Results */}
      {aiResults && (
        <div className="mt-8">
          <AIResults
            type={aiResults.type}
            data={aiResults.data}
            onClose={() => setAiResults(null)}
          />
        </div>
      )}
    </div>
  );
}
