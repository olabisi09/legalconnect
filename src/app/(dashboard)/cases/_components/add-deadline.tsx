"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { AppButton } from "@/components/app-button";
import { useCreateDeadline } from "@/hooks/features/use-cases";
import { FormDatePicker } from "@/components/forms/form-date-picker";

const addDeadlineSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.date().min(new Date(), "Due date must be in the future"),
});

type AddDeadlineValues = z.infer<typeof addDeadlineSchema>;

export function AddDeadlineModal({
  caseId,
  open,
  onOpenChange,
}: {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createDeadline = useCreateDeadline();

  const form = useForm<AddDeadlineValues>({
    resolver: zodResolver(addDeadlineSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
    },
  });

  const onSubmit = async (values: AddDeadlineValues) => {
    await createDeadline.mutateAsync(
      {
        caseId,
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        dueDate: values.dueDate.toISOString(),
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Deadline</DialogTitle>
          <DialogDescription>
            Create a deadline for this case.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              name="title"
              label="Title"
              placeholder="e.g. File witness statement"
            />

            <FormTextarea
              name="description"
              label="Description (optional)"
              placeholder="Optional notes for this deadline"
            />

            <FormDatePicker name="dueDate" label="Due Date" />

            <DialogFooter>
              <DialogClose type="button" render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <AppButton
                type="submit"
                loading={createDeadline.isPending}
                loadingText="Adding..."
              >
                Add Deadline
              </AppButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
