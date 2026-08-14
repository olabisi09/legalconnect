"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateMatter } from "@/hooks/features/use-matters";
import { ENTITY_TYPES, PARTY_TYPES, PRIORITY_LEVELS } from "@/lib/enums";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormInput } from "@/components/forms/form-input";
import { AppButton } from "@/components/app-button";
import { RiAddLine, RiCloseLine } from "@remixicon/react";
import { FormCheckbox } from "@/components/forms/form-checkbox";
import { FormSelect } from "@/components/forms/form-select";

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

type CreateMatterValues = z.infer<typeof matterSchema>;

const emptyParty: CreateMatterValues["parties"][number] = {
  partyType: "CLIENT_INDIVIDUAL",
  entityType: "INDIVIDUAL",
  firstName: "",
  lastName: "",
  entityName: "",
  email: "",
  phone: "",
  primaryClient: false,
};

export function CreateMatter({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createMatter = useCreateMatter();

  const form = useForm<CreateMatterValues>({
    resolver: zodResolver(matterSchema),
    defaultValues: {
      title: "",
      description: "",
      practiceArea: "",
      jurisdictionCode: "",
      priority: "NORMAL",
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

  const onSubmit = async (values: CreateMatterValues) => {
    console.log("Submitting values:", values);
    // strip the empty-string optionals so they don't get sent as ""
    const payload = {
      ...values,
      parties: values.parties.map((party) => ({
        ...party,
        email: party.email || undefined,
      })),
    };

    await createMatter.mutateAsync(payload, {
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
          <DialogContent className="flex max-h-[calc(100vh-3rem)] w-full sm:max-w-xl flex-col overflow-hidden p-0">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex min-h-0 flex-1 flex-col"
              >
                <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 py-4">
                  <DialogTitle>Create Matter</DialogTitle>
                </DialogHeader>
                <div className="transparent-scrollbar me-0.5 flex-1 overflow-auto px-6 py-4">
                  <div className="space-y-4">
                    <FormInput
                      name="title"
                      label="Title"
                      placeholder="e.g Smith vs. Johnson"
                    />
                    <FormInput
                      name="description"
                      label="Description"
                      placeholder="Brief summary of the matter"
                    />
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
                    <FormSelect
                      name="priority"
                      label="Priority"
                      placeholder="e.g High, Medium, Low"
                      options={priorityOptions}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="mt-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-foreground">
                        Parties
                      </h3>
                      <AppButton onClick={() => appendParty({ ...emptyParty })}>
                        <RiAddLine />
                        Add party
                      </AppButton>
                    </div>
                    {form.formState.errors.parties?.root?.message && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.parties.root.message}
                      </p>
                    )}

                    <div className="space-y-4">
                      {partyFields.map((field, index) => {
                        // eslint-disable-next-line react-hooks/incompatible-library
                        const entityType = form.watch(
                          `parties.${index}.entityType`,
                        );
                        return (
                          <div
                            key={field.id}
                            className="relative space-y-4 border p-4"
                          >
                            {partyFields.length > 1 && (
                              <AppButton
                                type="button"
                                onClick={() => removeParty(index)}
                              >
                                <RiCloseLine />
                              </AppButton>
                            )}

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

                            <FormCheckbox
                              name={`parties.${index}.primaryClient`}
                              label="Primary Client"
                            />
                          </div>
                        );
                      })}
                    </div>
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
                    loading={createMatter.isPending}
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
