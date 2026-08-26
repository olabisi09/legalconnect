"use client";

import { useState } from "react";
import { RiShareLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { useShareDocument } from "@/hooks/features/use-documents";
import type { AccessLevel, ShareTargetType } from "@/types/document";

const TARGET_TYPES: { value: ShareTargetType; label: string }[] = [
  { value: "USER", label: "User" },
  { value: "TEAM", label: "Team" },
  { value: "ROLE", label: "Role" },
  { value: "ORGANIZATION", label: "Organization" },
];

const ACCESS_LEVELS: { value: AccessLevel; label: string }[] = [
  { value: "VIEW", label: "View" },
  { value: "COMMENT", label: "Comment" },
  { value: "EDIT", label: "Edit" },
  { value: "FULL_CONTROL", label: "Full control" },
];

export function ShareDocumentDialog({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [targetType, setTargetType] = useState<ShareTargetType>("USER");
  // Plain text ID for now — swap for a real user/team/role picker once that lookup exists.
  const [targetId, setTargetId] = useState("");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("VIEW");
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  const shareDocument = useShareDocument();

  const reset = () => {
    setTargetType("USER");
    setTargetId("");
    setAccessLevel("VIEW");
    setExpiresAt("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!targetId.trim()) {
      setError(`Enter the ${targetType.toLowerCase()}'s ID.`);
      return;
    }
    setError(null);
    try {
      await shareDocument.mutateAsync({
        id: documentId,
        targetType,
        targetId: targetId.trim(),
        accessLevel,
        expiresAt: expiresAt || undefined,
      });
      reset();
      setOpen(false);
    } catch {
      setError("Couldn't grant access. Try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            <RiShareLine className="mr-1.5 h-4 w-4" />
            Share
          </Button>
        }
      />

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Grant access
          </DialogTitle>
          <DialogDescription>
            Give a user, team, role, or the whole org access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Grant to</Label>
            <Select
              value={targetType}
              onValueChange={(v) => setTargetType(v as ShareTargetType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TARGET_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="target-id">
              {targetType === "USER"
                ? "User"
                : targetType === "TEAM"
                  ? "Team"
                  : targetType === "ROLE"
                    ? "Role"
                    : "Organization"}{" "}
              ID
            </Label>
            <Input
              id="target-id"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="Paste an ID"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Access level</Label>
            <Select
              value={accessLevel}
              onValueChange={(v) => setAccessLevel(v as AccessLevel)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expires-at">Expires (optional)</Label>
            <Input
              id="expires-at"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          {error ? <p className="text-sm text-lc-stamp">{error}</p> : null}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={shareDocument.isPending}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
            loading={shareDocument.isPending}
            loadingText="Granting..."
          >
            Grant access
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
