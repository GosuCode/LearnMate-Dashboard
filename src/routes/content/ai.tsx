import { createFileRoute } from "@tanstack/react-router";
import { AIContentForm } from "@/components/forms/AIContentForm";
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

  const handleAIGeneration = async (data: AIServiceRequest) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await contentApi.generateContent(data);
      console.log("AI Generation Response:", response); // Debug log
      if (response.success && response.data) {
        // Automatically create content from AI generation
        const contentData = formatAIDataToContent(data, response.data);
        const createResponse = await contentApi.createContent(contentData);

        if (createResponse.success) {
          // Navigate to content page to show the newly created content
          navigate({ to: "/content" });
        } else {
          setError(createResponse.error || "Failed to save generated content");
        }
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

  // Helper function to format AI data into content format
  const formatAIDataToContent = (
    request: AIServiceRequest,
    aiData: SummaryResponse | QuizResponse | CategorizeResponse
  ) => {
    let title = "";
    let content = "";

    switch (request.type) {
      case "summary":
        const summaryData = aiData as SummaryResponse;
        title = `AI Generated Summary - ${new Date().toLocaleDateString()}`;
        content = `Summary:\n${summaryData.summary}\n\nKey Points:\n${summaryData.keyPoints.map((point) => `• ${point}`).join("\n")}\n\nWord Count: ${summaryData.wordCount}`;
        break;

      case "quiz":
        const quizData = aiData as QuizResponse;
        title = `AI Generated Quiz - ${new Date().toLocaleDateString()}`;
        content = quizData.questions
          .map(
            (q, i) =>
              `Question ${i + 1}: ${q.question}\n${q.options.map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`).join("\n")}\nCorrect Answer: ${String.fromCharCode(65 + q.correctAnswer)}${q.explanation ? `\nExplanation: ${q.explanation}` : ""}\n`
          )
          .join("\n");
        break;

      case "categorize":
        const categorizeData = aiData as CategorizeResponse;
        title = `AI Generated Categories - ${new Date().toLocaleDateString()}`;
        content = `Categories: ${categorizeData.categories.join(", ")}\nConfidence: ${Math.round(categorizeData.confidence * 100)}%`;
        break;
    }

    return {
      title,
      content,
      type: "text" as const,
      category: request.type,
    };
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
    </div>
  );
}
