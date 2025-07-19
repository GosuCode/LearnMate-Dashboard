import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Copy,
  Download,
  CheckCircle,
  XCircle,
  FileText,
  BookOpen,
  Tag,
  Sparkles,
} from "lucide-react";
import type {
  SummaryResponse,
  QuizResponse,
  CategorizeResponse,
} from "@/types/content";

interface AIResultsProps {
  type: "summary" | "quiz" | "categorize";
  data: SummaryResponse | QuizResponse | CategorizeResponse;
  onClose: () => void;
}

export function AIResults({ type, data, onClose }: AIResultsProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const downloadAsText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderSummary = (data: SummaryResponse) => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Summary
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-800 leading-relaxed">{data.summary}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <span>Word count: {data.wordCount}</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Key Points</h3>
        <ul className="space-y-2">
          {data.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => copyToClipboard(data.summary)}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Summary
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadAsText(data.summary, "summary.txt")}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );

  const renderQuiz = (data: QuizResponse) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-purple-600" />
          Quiz ({data.totalQuestions} questions)
        </h3>
        <Badge variant="secondary">{data.totalQuestions} Questions</Badge>
      </div>

      <div className="space-y-6">
        {data.questions.map((question, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">Question {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium text-gray-800">{question.question}</p>

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`flex items-center gap-2 p-2 rounded ${
                      optionIndex === question.correctAnswer
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    {optionIndex === question.correctAnswer ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-sm">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </span>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            const quizText = data.questions
              .map(
                (q, i) =>
                  `Question ${i + 1}: ${q.question}\n${q.options
                    .map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`)
                    .join(
                      "\n"
                    )}\nCorrect Answer: ${String.fromCharCode(65 + q.correctAnswer)}\n${q.explanation ? `Explanation: ${q.explanation}` : ""}\n`
              )
              .join("\n");
            copyToClipboard(quizText);
          }}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Quiz
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const quizText = data.questions
              .map(
                (q, i) =>
                  `Question ${i + 1}: ${q.question}\n${q.options
                    .map((opt, j) => `${String.fromCharCode(65 + j)}. ${opt}`)
                    .join(
                      "\n"
                    )}\nCorrect Answer: ${String.fromCharCode(65 + q.correctAnswer)}\n${q.explanation ? `Explanation: ${q.explanation}` : ""}\n`
              )
              .join("\n");
            downloadAsText(quizText, "quiz.txt");
          }}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );

  const renderCategorize = (data: CategorizeResponse) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5 text-orange-600" />
          Categories
        </h3>
        <Badge variant="secondary">
          {Math.round(data.confidence * 100)}% confidence
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {data.categories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {category}
            </Badge>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Confidence Score:</strong>{" "}
            {Math.round(data.confidence * 100)}%
          </p>
          <p className="text-sm text-gray-600 mt-1">
            The AI is {Math.round(data.confidence * 100)}% confident in these
            category suggestions.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => copyToClipboard(data.categories.join(", "))}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Categories
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            downloadAsText(data.categories.join("\n"), "categories.txt")
          }
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Generated {type.charAt(0).toUpperCase() + type.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Here's what the AI generated for your content
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {type === "summary" && renderSummary(data as SummaryResponse)}
          {type === "quiz" && renderQuiz(data as QuizResponse)}
          {type === "categorize" &&
            renderCategorize(data as CategorizeResponse)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
