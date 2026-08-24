"use client";

import { useState } from "react";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { RiUserAddLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";
import { FormInput } from "@/components/forms/form-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInviteUser } from "@/hooks/features/use-team";
import { OrgRole } from "@/types/auth";

const ROLES: { value: OrgRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "LAWYER", label: "Lawyer" },
  { value: "PARALEGAL", label: "Paralegal" },
  { value: "FINANCE", label: "Finance" },
  { value: "CLIENT", label: "Client" },
];

const inviteSchema = z.object({
  email: z.email("Enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["ADMIN", "LAWYER", "PARALEGAL", "FINANCE", "CLIENT"], {
    message: "Select a role",
  }),
});

type InviteValues = z.infer<typeof inviteSchema>;

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const inviteUser = useInviteUser();

  const form = useForm<InviteValues>({
    defaultValues: { email: "", firstName: "", lastName: "", role: undefined },
    resolver: zodResolver(inviteSchema),
  });
  const { handleSubmit, control, reset } = form;

  const onSubmit = async (values: InviteValues) => {
    setServerError(null);
    try {
      await inviteUser.mutateAsync(values);
      reset();
      setOpen(false);
    } catch (err) {
      // Surfaces the API's message (e.g. a rejected role string) instead of failing silently.
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong sending the invite.";
      setServerError(message);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          reset();
          setServerError(null);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
          >
            <RiUserAddLine className="mr-1.5 h-4 w-4" />
            Invite member
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Invite a team member
          </DialogTitle>
          <DialogDescription>
            They&apos;ll get an email with a link to set their own password and
            sign in.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              id="email"
              name="email"
              type="email"
              className="w-full"
              placeholder="Email address"
              label="Email address"
              autoFocus
            />

            <div className="grid grid-cols-2 gap-3">
              <FormInput
                id="firstName"
                name="firstName"
                type="text"
                className="w-full"
                placeholder="First name"
                label="First name"
              />
              <FormInput
                id="lastName"
                name="lastName"
                type="text"
                className="w-full"
                placeholder="Last name"
                label="Last name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>
                            {r.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error ? (
                      <p className="text-sm text-lc-stamp">
                        {fieldState.error.message}
                      </p>
                    ) : null}
                  </>
                )}
              />
            </div>

            {serverError ? (
              <p className="text-sm text-lc-stamp">{serverError}</p>
            ) : null}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={inviteUser.isPending}
              >
                Cancel
              </Button>
              <AppButton
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
                loading={inviteUser.isPending}
                loadingText="Sending invite..."
              >
                Send invite
              </AppButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
