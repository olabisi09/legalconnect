"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiShieldCheckLine } from "@remixicon/react";

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
import { FormTextarea } from "@/components/forms/form-textarea";
import { AppButton } from "@/components/app-button";
import {
  useApplyLegalHold,
  useRemoveLegalHold,
} from "@/hooks/features/use-cases";

// --- Apply Legal Hold Modal ---

const applySchema = z.object({
  reason: z
    .string()
    .min(1, "Reason is required")
    .min(10, "Reason must be at least 10 characters"),
  holdInstruction: z
    .string()
    .min(1, "Hold instruction is required")
    .min(10, "Hold instruction must be at least 10 characters"),
});

type ApplyLegalHoldValues = z.infer<typeof applySchema>;

export function ApplyLegalHoldModal({
  caseId,
  open,
  onOpenChange,
}: {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const applyLegalHold = useApplyLegalHold();

  const form = useForm<ApplyLegalHoldValues>({
    resolver: zodResolver(applySchema),
    defaultValues: { reason: "", holdInstruction: "" },
  });

  const onSubmit = async (values: ApplyLegalHoldValues) => {
    await applyLegalHold.mutateAsync(
      { caseId, ...values },
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
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-red-100">
              <RiShieldCheckLine className="size-5 text-red-700" />
            </div>
            <div>
              <DialogTitle>Apply Legal Hold</DialogTitle>
              <DialogDescription className="text-xs">
                Preserves all case data from deletion or modification.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormTextarea
              name="reason"
              label="Reason for legal hold"
              placeholder="Explain why a legal hold is being applied to this case..."
              rows={3}
              disabled={applyLegalHold.isPending}
            />
            <FormTextarea
              name="holdInstruction"
              label="Hold instruction"
              placeholder="Describe what data must be preserved and any special handling instructions..."
              rows={4}
              disabled={applyLegalHold.isPending}
            />

            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
              Applying a legal hold will preserve all associated data and
              restrict modifications until the hold is removed.
            </div>

            <DialogFooter>
              <DialogClose type="button" render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <AppButton
                type="submit"
                loading={applyLegalHold.isPending}
                loadingText="Applying..."
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Apply Legal Hold
              </AppButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

// --- Remove Legal Hold Confirmation Dialog ---

export function RemoveLegalHoldModal({
  caseId,
  open,
  onOpenChange,
}: {
  caseId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const removeLegalHold = useRemoveLegalHold();

  const handleConfirm = async () => {
    await removeLegalHold.mutateAsync(caseId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-gray-100">
              <RiShieldCheckLine className="size-5 text-gray-600" />
            </div>
            <DialogTitle>Remove Legal Hold</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to remove the legal hold from this case? This
            will allow normal modifications and data operations to resume.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose type="button" render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <AppButton
            loading={removeLegalHold.isPending}
            loadingText="Removing..."
            onClick={handleConfirm}
          >
            Remove Legal Hold
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
