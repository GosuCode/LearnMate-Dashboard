import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles, X } from "lucide-react";
import type { AIServiceRequest } from "@/types/content";

interface AIContentFormProps {
  onSubmit: (data: AIServiceRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AIContentForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: AIContentFormProps) {
  const [formData, setFormData] = useState<AIServiceRequest>({
    content: "",
    type: "summary",
    options: {
      maxLength: 500,
      difficulty: "medium",
      numQuestions: 5,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: string, value: string | number) => {
    if (field === "maxLength" || field === "numQuestions") {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [field]: Number(value) },
      }));
    } else if (field === "difficulty") {
      setFormData((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          [field]: value as "easy" | "medium" | "hard",
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Content Generation
        </CardTitle>
        <CardDescription>
          Generate summaries, quizzes, or categorize content using AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Generation Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select generation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="categorize">Categorize</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content to Process</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter the content you want to process with AI..."
              rows={8}
              required
            />
          </div>

          {formData.type === "summary" && formData.options && (
            <div className="space-y-2">
              <Label htmlFor="maxLength">Maximum Length</Label>
              <Input
                id="maxLength"
                type="number"
                value={formData.options.maxLength}
                onChange={(e) => handleChange("maxLength", e.target.value)}
                placeholder="500"
                min={100}
                max={2000}
              />
            </div>
          )}

          {formData.type === "quiz" && formData.options && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Input
                  id="numQuestions"
                  type="number"
                  value={formData.options.numQuestions}
                  onChange={(e) => handleChange("numQuestions", e.target.value)}
                  placeholder="5"
                  min={1}
                  max={20}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  value={formData.options.difficulty}
                  onValueChange={(value) => handleChange("difficulty", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
