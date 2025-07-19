import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ContentForm } from "@/components/forms/ContentForm";
import { ContentList } from "./ContentList";
import { AIResults } from "./AIResults";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { contentApi } from "@/lib/api";
import type {
  Content,
  CreateContentRequest,
  UpdateContentRequest,
  AIServiceRequest,
  SummaryResponse,
  QuizResponse,
  CategorizeResponse,
} from "@/types/content";

export default function ContentPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [aiResults, setAiResults] = useState<{
    type: "summary" | "quiz" | "categorize";
    data: SummaryResponse | QuizResponse | CategorizeResponse;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await contentApi.getAllContent();
      if (response.success && response.data) {
        setContent(response.data);
      } else {
        setError(response.error || "Failed to load content");
      }
    } catch (error) {
      setError("Failed to load content");
      console.error("Error loading content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateContent = async (data: UpdateContentRequest) => {
    if (!editingContent) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await contentApi.updateContent(editingContent.id, data);
      if (response.success && response.data) {
        setContent((prev) =>
          prev.map((item) =>
            item.id === editingContent.id ? response.data! : item
          )
        );
        setEditingContent(null);
      } else {
        setError(response.error || "Failed to update content");
      }
    } catch (error) {
      setError("Failed to update content");
      console.error("Error updating content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async (id: string) => {
    try {
      setError(null);
      const response = await contentApi.deleteContent(id);
      if (response.success) {
        setContent((prev) => prev.filter((item) => item.id !== id));
      } else {
        setError(response.error || "Failed to delete content");
      }
    } catch (error) {
      setError("Failed to delete content");
      console.error("Error deleting content:", error);
    }
  };

  const handleGenerateSummary = async (contentId: string) => {
    try {
      setError(null);
      const response = await contentApi.generateSummary(contentId);
      if (response.success && response.data) {
        setAiResults({
          type: "summary",
          data: response.data,
        });
      } else {
        setError(response.error || "Failed to generate summary");
      }
    } catch (error) {
      setError("Failed to generate summary");
      console.error("Error generating summary:", error);
    }
  };

  const handleGenerateQuiz = async (contentId: string) => {
    try {
      setError(null);
      const response = await contentApi.generateQuiz(contentId);
      if (response.success && response.data) {
        setAiResults({
          type: "quiz",
          data: response.data,
        });
      } else {
        setError(response.error || "Failed to generate quiz");
      }
    } catch (error) {
      setError("Failed to generate quiz");
      console.error("Error generating quiz:", error);
    }
  };

  const handleCategorize = async (contentId: string) => {
    try {
      setError(null);
      const response = await contentApi.categorizeContent(contentId);
      if (response.success && response.data) {
        setAiResults({
          type: "categorize",
          data: response.data,
        });
      } else {
        setError(response.error || "Failed to categorize content");
      }
    } catch (error) {
      setError("Failed to categorize content");
      console.error("Error categorizing content:", error);
    }
  };

  const handleCreateContent = () => {
    navigate({ to: "/content/create" });
  };

  const handleAIGeneration = () => {
    navigate({ to: "/content/ai" });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Management</CardTitle>
          <div className="flex gap-3">
            <Button onClick={handleAIGeneration} variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generation
            </Button>
            <Button onClick={handleCreateContent}>
              <Plus className="h-4 w-4 mr-2" />
              Create Content
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="flex items-center gap-2 mb-4 p-2 bg-red-50 border border-red-200 rounded">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading content...</span>
            </div>
          ) : (
            <ContentList
              content={content}
              onEdit={setEditingContent}
              onDelete={handleDeleteContent}
              onGenerateSummary={handleGenerateSummary}
              onGenerateQuiz={handleGenerateQuiz}
              onCategorize={handleCategorize}
              isLoading={isSubmitting}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Form Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-2xl">
            <ContentForm
              content={editingContent}
              onSubmit={handleUpdateContent}
              onCancel={() => setEditingContent(null)}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* AI Results */}
      {aiResults && (
        <AIResults
          type={aiResults.type}
          data={aiResults.data}
          onClose={() => setAiResults(null)}
        />
      )}
    </div>
  );
}
