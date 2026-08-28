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
import { useChangeUserStatus } from "@/hooks/features/use-team";
import { TeamMember, UserStatus } from "@/types/user";

const STATUSES: { value: UserStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "DEACTIVATED", label: "Deactivated" },
  { value: "PENDING", label: "Pending" },
  { value: "PENDING_VERIFICATION", label: "Pending Verification" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "LOCKED", label: "Locked" },
  { value: "DELETED", label: "Deleted" },
];

export function ChangeStatusDialog({
  member,
  open,
  onOpenChange,
}: Readonly<{
  member: TeamMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>) {
  const changeStatus = useChangeUserStatus();
  const [status, setStatus] = useState<UserStatus>(member.status as UserStatus);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    try {
      await changeStatus.mutateAsync({ id: member.id, status });
      onOpenChange(false);
    } catch {
      setError("Couldn't update the status. Try again.");
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
            Change status
          </DialogTitle>
          <DialogDescription>
            {member.firstName} {member.lastName} — {member.email}
          </DialogDescription>
        </DialogHeader>

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as UserStatus)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((r) => (
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
            disabled={changeStatus.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={changeStatus.isPending || status === member.status}
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
          >
            {changeStatus.isPending ? (
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
