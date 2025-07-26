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
import type { Semester } from "@/types/semester";
import { SemesterForm } from "@/components/forms/SemesterForm";
import SemesterCard from "@/components/semester/SemesterCard";

export function SemesterPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [open, setOpen] = useState(false);

  const fetchSemesters = async () => {
    try {
      const { data } = await axiosInstance.get("/semester");
      setSemesters(data.data);
    } catch (err) {
      toast.error("Error fetching semesters");
    }
  };

  const handleCreate = async (values: { name: string; code: string }) => {
    try {
      await axiosInstance.post("/semester", values);
      toast.success("Semester created");
      setOpen(false);
      fetchSemesters();
    } catch (err) {
      toast.error("Failed to create semester");
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">📚 Semesters</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl px-6 py-2 text-base shadow-sm hover:shadow-md transition">
              + Create
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Semester</DialogTitle>
              <DialogDescription>
                Provide the semester details below.
              </DialogDescription>
            </DialogHeader>
            <SemesterForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <SemesterCard semesters={semesters} />
    </div>
  );
}
