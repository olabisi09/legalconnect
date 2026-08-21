"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateCase } from "@/hooks/features/use-cases";
import { ENTITY_TYPES, PARTY_TYPES, PRIORITY_LEVELS } from "@/lib/enums";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormInput } from "@/components/forms/form-input";
import { AppButton } from "@/components/app-button";
import {
  RiAddLine,
  RiCloseLine,
  RiUser3Line,
  RiBuildingLine,
  RiStarFill,
  RiStarLine,
} from "@remixicon/react";
import { FormSelect } from "@/components/forms/form-select";
import { cn } from "@/lib/utils";
import { FormTextarea } from "@/components/forms/form-textarea";

const partySchema = z
  .object({
    partyType: z.enum(PARTY_TYPES, { error: "Party type is required" }),
    entityType: z.enum(ENTITY_TYPES, { error: "Entity type is required" }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    entityName: z.string().optional(),
    primaryClient: z.boolean(),
  })
  .superRefine((party, ctx) => {
    if (party.partyType === "CLIENT_INDIVIDUAL") {
      if (!party.firstName?.trim()) {
        ctx.addIssue({
          path: ["firstName"],
          message: "First name is required",
          code: "custom",
        });
      }
      if (!party.lastName?.trim()) {
        ctx.addIssue({
          path: ["lastName"],
          message: "Last name is required",
          code: "custom",
        });
      }
    } else if (!party.entityName?.trim()) {
      ctx.addIssue({
        path: ["entityName"],
        message: "Entity name is required",
        code: "custom",
      });
    }
  });

const caseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  practiceArea: z.string().min(1, "Practice area is required"),
  jurisdictionCode: z.string().min(1, "Jurisdiction is required"),
  priority: z.enum(PRIORITY_LEVELS, { error: "Priority is required" }),
  parties: z.array(partySchema).min(1, "Add at least one party"),
});

type CreateCaseValues = z.infer<typeof caseSchema>;

const emptyParty: CreateCaseValues["parties"][number] = {
  partyType: "CLIENT_INDIVIDUAL",
  entityType: "INDIVIDUAL",
  firstName: "",
  lastName: "",
  entityName: "",
  email: "",
  phone: "",
  primaryClient: false,
};

export function CreateCase({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createCase = useCreateCase();

  const form = useForm<CreateCaseValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: "",
      description: "",
      practiceArea: "",
      jurisdictionCode: "",
      priority: "MEDIUM",
      parties: [{ ...emptyParty, primaryClient: true }],
    },
  });

  const {
    fields: partyFields,
    append: appendParty,
    remove: removeParty,
  } = useFieldArray({
    control: form.control,
    name: "parties",
  });

  const onSubmit = async (values: CreateCaseValues) => {
    const payload = {
      ...values,
      parties: values.parties.map((party) => ({
        ...party,
        email: party.email || undefined,
      })),
    };

    await createCase.mutateAsync(payload, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  const partyTypeOptions = PARTY_TYPES.map((type) => ({
    value: type,
    label: type
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));

  const entityTypeOptions = ENTITY_TYPES.map((type) => ({
    value: type,
    label:
      type === "LLC"
        ? type
        : type
            .replace(/_/g, " ")
            .toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
  }));

  const priorityOptions = PRIORITY_LEVELS.map((level) => ({
    value: level,
    label: level.charAt(0).toUpperCase() + level.slice(1).toLowerCase(),
  }));

  return (
    <>
      <style>{`
        .transparent-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(120, 120, 120, 0.4) transparent;
        }
      `}</style>
      <div className="w-full flex items-center justify-center">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="flex max-h-[calc(100vh-3rem)] w-full sm:max-w-2xl flex-col overflow-hidden p-0">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex min-h-0 flex-1 flex-col"
              >
                <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 py-4">
                  <DialogTitle>Create Case</DialogTitle>
                </DialogHeader>

                <div className="transparent-scrollbar me-0.5 flex-1 overflow-auto px-6 py-4">
                  <div className="space-y-4">
                    <FormInput
                      name="title"
                      label="Title"
                      placeholder="e.g Smith vs. Johnson"
                    />
                    <FormTextarea
                      name="description"
                      label="Description"
                      placeholder="Brief summary of the case"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        name="practiceArea"
                        label="Practice Area"
                        placeholder="e.g Family Law"
                      />
                      <FormInput
                        name="jurisdictionCode"
                        label="Jurisdiction"
                        placeholder="e.g CA"
                      />
                    </div>
                    <FormSelect
                      name="priority"
                      label="Priority"
                      placeholder="e.g High, Medium, Low"
                      options={priorityOptions}
                    />
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-foreground">
                          Parties
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Everyone involved in this case
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {partyFields.length}{" "}
                        {partyFields.length === 1 ? "party" : "parties"}
                      </span>
                    </div>

                    {form.formState.errors.parties?.root?.message && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.parties.root.message}
                      </p>
                    )}

                    <div className="space-y-3">
                      {partyFields.map((field, index) => {
                        // eslint-disable-next-line react-hooks/incompatible-library
                        const entityType = form.watch(
                          `parties.${index}.entityType`,
                        );

                        const isPrimary = form.watch(
                          `parties.${index}.primaryClient`,
                        );

                        return (
                          <div
                            key={field.id}
                            className={cn(
                              "group relative rounded-lg border bg-card shadow-sm transition-colors",
                              isPrimary && "border-primary/40 bg-primary/3",
                            )}
                          >
                            {/* Card header */}
                            <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground",
                                    isPrimary && "bg-primary/10 text-primary",
                                  )}
                                >
                                  {entityType === "INDIVIDUAL" ? (
                                    <RiUser3Line className="h-3.5 w-3.5" />
                                  ) : (
                                    <RiBuildingLine className="h-3.5 w-3.5" />
                                  )}
                                </div>
                                <span className="text-sm font-medium">
                                  Party {index + 1}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="font-normal text-muted-foreground"
                                >
                                  {
                                    partyTypeOptions.find(
                                      (o) => o.value === field.partyType,
                                    )?.label
                                  }
                                </Badge>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    form.setValue(
                                      `parties.${index}.primaryClient`,
                                      !isPrimary,
                                      { shouldDirty: true },
                                    )
                                  }
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors",
                                    isPrimary
                                      ? "bg-primary/10 text-primary"
                                      : "text-muted-foreground hover:bg-muted",
                                  )}
                                >
                                  {isPrimary ? (
                                    <RiStarFill className="h-3.5 w-3.5" />
                                  ) : (
                                    <RiStarLine className="h-3.5 w-3.5" />
                                  )}
                                  Primary
                                </button>

                                {partyFields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeParty(index)}
                                    className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                                    aria-label={`Remove party ${index + 1}`}
                                  >
                                    <RiCloseLine className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Card body */}
                            <div className="space-y-4 px-4 py-4">
                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormSelect
                                  name={`parties.${index}.partyType`}
                                  label="Party Type"
                                  placeholder="e.g Client, Opposing Party"
                                  options={partyTypeOptions}
                                />
                                <FormSelect
                                  name={`parties.${index}.entityType`}
                                  label="Entity Type"
                                  placeholder="e.g Individual, Organization"
                                  options={entityTypeOptions}
                                />
                              </div>

                              {entityType === "INDIVIDUAL" ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  <FormInput
                                    name={`parties.${index}.firstName`}
                                    label="First Name"
                                    placeholder="e.g John"
                                  />
                                  <FormInput
                                    name={`parties.${index}.lastName`}
                                    label="Last Name"
                                    placeholder="e.g Doe"
                                  />
                                </div>
                              ) : (
                                <FormInput
                                  name={`parties.${index}.entityName`}
                                  label="Entity Name"
                                  placeholder="e.g Acme Corp."
                                />
                              )}

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <FormInput
                                  name={`parties.${index}.email`}
                                  label="Email"
                                  placeholder="e.g john.doe@example.com"
                                />
                                <FormInput
                                  name={`parties.${index}.phone`}
                                  label="Phone"
                                  placeholder="e.g (123) 456-7890"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => appendParty({ ...emptyParty })}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/3 hover:text-primary"
                    >
                      <RiAddLine className="h-4 w-4" />
                      Add party
                    </button>
                  </div>
                </div>

                <DialogFooter className="bg-background border-t px-6 py-4">
                  <DialogClose
                    type="button"
                    render={<Button variant="outline" />}
                  >
                    Close
                  </DialogClose>
                  <AppButton
                    type="submit"
                    loading={createCase.isPending}
                    loadingText="Saving..."
                  >
                    Save changes
                  </AppButton>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
