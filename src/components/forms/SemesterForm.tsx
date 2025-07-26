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

// 🧠 Zod Schema
const semesterSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  code: z.string().min(2, "Code is too short"), // e.g., SEM1
});

type SemesterFormValues = z.infer<typeof semesterSchema>;

interface SemesterFormProps {
  defaultValues?: SemesterFormValues;
  onSubmit: (data: SemesterFormValues) => Promise<void> | void;
  loading?: boolean;
}

export function SemesterForm({
  defaultValues,
  onSubmit,
  loading = false,
}: SemesterFormProps) {
  const form = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues: defaultValues || {
      name: "",
      code: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. First Semester" {...field} />
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
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. SEM1" {...field} />
              </FormControl>
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
