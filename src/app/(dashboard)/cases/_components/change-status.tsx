"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FormSelect } from "@/components/forms/form-select";
import { AppButton } from "@/components/app-button";
import { useChangeCaseStatus } from "@/hooks/features/use-cases";
import { MATTER_STATUSES } from "@/lib/enums";
import { capitalize } from "@/lib/utils";
import { CaseStatus } from "@/types/case";
import { FormTextarea } from "@/components/forms/form-textarea";

const statusSchema = z.object({
  status: z.enum(MATTER_STATUSES, { error: "Status is required" }),
  reason: z
    .string()
    .min(1, "Reason is required")
    .min(10, "Reason must be at least 10 characters"),
});

type ChangeStatusValues = z.infer<typeof statusSchema>;

// Suggested workflow - what statuses are available after each status
const STATUS_WORKFLOW: Record<string, string[]> = {
  DRAFT: ["INTAKE", "ACTIVE"],
  INTAKE: ["ACTIVE", "DRAFT"],
  ACTIVE: ["PENDING", "CLOSED", "DRAFT"],
  PENDING: ["ACTIVE", "CLOSED"],
  CLOSED: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: ["CLOSED"],
};

export function ChangeStatusModal({
  caseId,
  currentStatus,
  open,
  onOpenChange,
}: {
  caseId: string;
  currentStatus: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const changeStatus = useChangeCaseStatus();
  const [showAllStatuses, setShowAllStatuses] = useState(false);

  const form = useForm<ChangeStatusValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: undefined,
      reason: "",
    },
  });

  // Get suggested statuses based on current status, or all if not in workflow
  const suggestedStatuses = STATUS_WORKFLOW[currentStatus] || MATTER_STATUSES;
  const statuses = showAllStatuses ? MATTER_STATUSES : suggestedStatuses;

  const statusOptions = statuses
    .filter((s) => s !== currentStatus)
    .map((s) => ({
      value: s,
      label: capitalize(s),
    }));

  const onSubmit = async (values: ChangeStatusValues) => {
    await changeStatus.mutateAsync(
      {
        caseId,
        status: values.status as CaseStatus,
        reason: values.reason,
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
          <DialogTitle>Change Matter Status</DialogTitle>
          <DialogDescription>
            Update the status of this case and provide a reason for the change.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Status - Read-only */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Current Status
              </p>
              <p className="mt-2 text-lg font-semibold">
                {capitalize(currentStatus)}
              </p>
            </div>

            {/* Status Selection */}
            <FormSelect
              name="status"
              label="New Status"
              placeholder="Select a new status"
              options={statusOptions}
            />

            {/* Show suggestion about workflow */}
            {!showAllStatuses && STATUS_WORKFLOW[currentStatus] && (
              <p className="text-xs text-muted-foreground px-1">
                Showing suggested statuses.
                <button
                  type="button"
                  onClick={() => setShowAllStatuses(true)}
                  className="ml-1 text-primary hover:underline"
                >
                  View all statuses
                </button>
              </p>
            )}

            {showAllStatuses && (
              <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md border border-amber-200">
                Note: You are viewing all possible statuses. The backend will
                accept any status transition.
              </p>
            )}

            <FormTextarea
              name="reason"
              label="Reason for change"
              placeholder="Explain why you're changing the status of this case..."
            />

            <DialogFooter>
              <DialogClose type="button" render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <AppButton
                type="submit"
                loading={changeStatus.isPending}
                loadingText="Changing..."
              >
                Change Status
              </AppButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
