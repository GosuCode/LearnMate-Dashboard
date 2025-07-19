import { useState } from "react";
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
  Edit,
  Trash2,
  Eye,
  Sparkles,
  FileText,
  BookOpen,
  Link,
  Calendar,
  Tag,
} from "lucide-react";
import type { Content } from "@/types/content";

interface ContentListProps {
  content: Content[];
  onEdit: (content: Content) => void;
  onDelete: (id: string) => Promise<void>;
  onGenerateSummary: (id: string) => Promise<void>;
  onGenerateQuiz: (id: string) => Promise<void>;
  onCategorize: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ContentList({
  content,
  onEdit,
  onDelete,
  onGenerateSummary,
  onGenerateQuiz,
  onCategorize,
  isLoading = false,
}: ContentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAIProcessing = async (
    id: string,
    action: "summary" | "quiz" | "categorize"
  ) => {
    setProcessingId(id);
    try {
      switch (action) {
        case "summary":
          await onGenerateSummary(id);
          break;
        case "quiz":
          await onGenerateQuiz(id);
          break;
        case "categorize":
          await onCategorize(id);
          break;
      }
    } finally {
      setProcessingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return <FileText className="h-4 w-4" />;
      case "pdf":
        return <BookOpen className="h-4 w-4" />;
      case "url":
        return <Link className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (content.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No content yet
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            Get started by creating your first piece of content or generating
            something with AI.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {content.map((item) => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getTypeIcon(item.type)}
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant="secondary" className="capitalize">
                    {item.type}
                  </Badge>
                </div>
                {item.category && (
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <Tag className="h-3 w-3" />
                    {item.category}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Created {formatDate(item.createdAt)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>
                        {item.category && `Category: ${item.category}`}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <pre className="whitespace-pre-wrap text-sm">
                          {item.content}
                        </pre>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>AI Processing Options</DialogTitle>
                      <DialogDescription>
                        Choose what you'd like to generate for this content
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleAIProcessing(item.id, "summary")}
                        disabled={processingId === item.id}
                        className="justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Summary
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleAIProcessing(item.id, "quiz")}
                        disabled={processingId === item.id}
                        className="justify-start"
                      >
                        <BookOpen className="h-4 w-4 mr-2" />
                        Generate Quiz
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleAIProcessing(item.id, "categorize")
                        }
                        disabled={processingId === item.id}
                        className="justify-start"
                      >
                        <Tag className="h-4 w-4 mr-2" />
                        Categorize Content
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Content</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{item.title}"? This
                        action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline">Cancel</Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="line-clamp-3">
              {item.content.length > 200
                ? `${item.content.substring(0, 200)}...`
                : item.content}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
