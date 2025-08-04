import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import type { Semester } from "@/types/semester";

// 🧠 Zod Schema - matches backend validation
const subjectSchema = z.object({
  name: z.string().min(2, "Subject name must be at least 2 characters long"),
  code: z.string().min(3, "Subject code must be at least 3 characters long"),
  semesterId: z.string({
    required_error: "Semester ID is required",
  }),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

interface SubjectFormProps {
  defaultValues?: SubjectFormValues;
  onSubmit: (data: SubjectFormValues) => Promise<void> | void;
  loading?: boolean;
}

export function SubjectForm({
  defaultValues,
  onSubmit,
  loading = false,
}: SubjectFormProps) {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: defaultValues || {
      name: "",
      code: "",
      semesterId: "",
    },
  });

  const fetchSemesters = async () => {
    try {
      const { data } = await axiosInstance.get("/semester");
      setSemesters(data.data);
    } catch (err) {
      console.error("Error fetching semesters:", err);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Mathematics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. MATH101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="semesterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      {semester.name} ({semester.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
