"use client";

import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiAddLine, RiCloseLine, RiCheckLine } from "@remixicon/react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { AppButton } from "@/components/app-button";
import { useUpdateMatter } from "@/hooks/features/use-matters";
import { ENTITY_TYPES, PARTY_TYPES, PRIORITY_LEVELS } from "@/lib/enums";
import { MatterDetail } from "@/types/matter";
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

const matterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  practiceArea: z.string().min(1, "Practice area is required"),
  jurisdictionCode: z.string().min(1, "Jurisdiction is required"),
  priority: z.enum(PRIORITY_LEVELS, { error: "Priority is required" }),
  parties: z.array(partySchema).min(1, "Add at least one party"),
});

type EditMatterValues = z.infer<typeof matterSchema>;

const emptyParty: EditMatterValues["parties"][number] = {
  partyType: "CLIENT_INDIVIDUAL",
  entityType: "INDIVIDUAL",
  firstName: "",
  lastName: "",
  entityName: "",
  email: "",
  phone: "",
  primaryClient: false,
};

function mapPartiesToFormValues(
  parties: MatterDetail["parties"],
): EditMatterValues["parties"] {
  return parties.map((p) => ({
    partyType: p.partyType as EditMatterValues["parties"][number]["partyType"],
    entityType:
      p.entityType as EditMatterValues["parties"][number]["entityType"],
    firstName: p.firstName,
    lastName: p.lastName,
    entityName: p.entityName,
    email: p.email,
    phone: p.phone,
    primaryClient: p.primaryClient,
  }));
}

export function EditMatterModal({
  matter,
  open,
  onOpenChange,
}: {
  matter: MatterDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateMatter = useUpdateMatter();

  const form = useForm<EditMatterValues>({
    resolver: zodResolver(matterSchema),
    defaultValues: {
      title: matter?.title || "",
      description: matter?.description || "",
      practiceArea: matter?.practiceArea || "",
      jurisdictionCode: matter?.jurisdictionCode || "",
      priority: (matter?.priority || "NORMAL") as any,
      parties:
        (matter?.parties?.length || 0) > 0
          ? mapPartiesToFormValues(matter.parties)
          : [{ ...emptyParty, primaryClient: true }],
    },
  });

  // Reset form when matter changes
  useEffect(() => {
    if (matter) {
      form.reset({
        title: matter.title || "",
        description: matter.description || "",
        practiceArea: matter.practiceArea || "",
        jurisdictionCode: matter.jurisdictionCode || "",
        priority: (matter.priority || "NORMAL") as any,
        parties:
          (matter.parties?.length || 0) > 0
            ? mapPartiesToFormValues(matter.parties)
            : [{ ...emptyParty, primaryClient: true }],
      });
    }
  }, [matter, form]);

  const {
    fields: partyFields,
    append: appendParty,
    remove: removeParty,
  } = useFieldArray({
    control: form.control,
    name: "parties",
  });

  const onSubmit = async (values: EditMatterValues) => {
    const payload = {
      ...values,
      parties: values.parties.map((party) => ({
        ...party,
        email: party.email || undefined,
      })),
    };

    await updateMatter.mutateAsync(
      { matterId: matter.id, payload },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
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
                  <DialogTitle>Edit Matter</DialogTitle>
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
                      placeholder="Brief summary of the matter"
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
                          Everyone involved in this matter
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
                                  {isPrimary && (
                                    <RiCheckLine className="size-4" />
                                  )}
                                  {!isPrimary && (
                                    <span className="text-xs font-semibold">
                                      {index + 1}
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm font-medium">
                                  Party {index + 1}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="font-normal text-muted-foreground"
                                >
                                  {form
                                    .watch(`parties.${index}.partyType`)
                                    ?.replace(/_/g, " ")}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-1">
                                <label className="cursor-pointer flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded hover:bg-muted">
                                  <input
                                    {...form.register(
                                      `parties.${index}.primaryClient`,
                                    )}
                                    type="checkbox"
                                    className="size-3.5"
                                  />
                                  Primary
                                </label>
                                {partyFields.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeParty(index)}
                                    className="text-muted-foreground hover:text-destructive p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                                  >
                                    <RiCloseLine className="size-4" />
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
                                <>
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
                                </>
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
                    loading={updateMatter.isPending}
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
