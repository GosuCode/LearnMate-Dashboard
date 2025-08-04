import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";
import { DialogDescription } from "@radix-ui/react-dialog";
import type { Subject } from "@/types/subject";
import { SubjectForm } from "@/components/forms/SubjectForm";
import SubjectCard from "@/components/subject/SubjectCard";

export function SubjectPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [open, setOpen] = useState(false);

  const fetchSubjects = async () => {
    try {
      const { data } = await axiosInstance.get("/subject");
      setSubjects(data.data);
    } catch (err) {
      toast.error("Error fetching subjects");
    }
  };

  const handleCreate = async (values: {
    name: string;
    code: string;
    semesterId: string;
  }) => {
    try {
      await axiosInstance.post("/subject", values);
      toast.success("Subject created");
      setOpen(false);
      fetchSubjects();
    } catch (err) {
      toast.error("Failed to create subject");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">📖 Subjects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl px-6 py-2 text-base shadow-sm hover:shadow-md transition">
              + Create
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>
                Provide the subject details below.
              </DialogDescription>
            </DialogHeader>
            <SubjectForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <SubjectCard subjects={subjects} />
    </div>
  );
}
