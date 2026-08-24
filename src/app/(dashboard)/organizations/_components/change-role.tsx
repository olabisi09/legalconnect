"use client";

import { useState } from "react";
import { RiLoader4Line } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateUserRole } from "@/hooks/features/use-team";
import { OrgRole } from "@/types/auth";
import { TeamMember } from "@/types/user";

const ROLES: { value: OrgRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "LAWYER", label: "Lawyer" },
  { value: "PARALEGAL", label: "Paralegal" },
  { value: "FINANCE", label: "Finance" },
  { value: "CLIENT", label: "Client" },
];

export function ChangeRoleDialog({
  member,
  open,
  onOpenChange,
}: Readonly<{
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const changeRole = useUpdateUserRole();
  const [role, setRole] = useState<OrgRole>(member.role as OrgRole);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    try {
      await changeRole.mutateAsync({ id: member.id, role });
      onOpenChange(false);
    } catch {
      setError("Couldn't update the role. Try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setError(null);
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Change role
          </DialogTitle>
          <DialogDescription>
            {member.firstName} {member.lastName} — {member.email}
          </DialogDescription>
        </DialogHeader>

        <Select value={role} onValueChange={(v) => setRole(v as OrgRole)}>
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

        {error ? <p className="text-sm text-lc-stamp">{error}</p> : null}

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={changeRole.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={changeRole.isPending || role === member.role}
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
          >
            {changeRole.isPending ? (
              <RiLoader4Line className="h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
