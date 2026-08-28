"use client";

import { useState } from "react";
import {
  RiMore2Line,
  RiShieldUserLine,
  RiPauseCircleLine,
  RiPlayCircleLine,
  RiLogoutBoxRLine,
  RiTeamLine,
  RiUserSettingsLine,
} from "@remixicon/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { StatusBadge } from "@/components/status-badge";
import { InviteMemberDialog } from "./invite-member";
import { ChangeRoleDialog } from "./change-role";
import { TeamMember } from "@/types/user";
import {
  useActivateUser,
  useDeactivateUser,
  useForceLogoutUser,
  useTeamMembers,
} from "@/hooks/features/use-team";
import { ChangeStatusDialog } from "./change-status";

type ConfirmAction = {
  type: "deactivate" | "activate" | "force-logout";
  member: TeamMember;
};

const confirmCopy: Record<
  ConfirmAction["type"],
  { title: string; body: (m: TeamMember) => string; action: string }
> = {
  deactivate: {
    title: "Deactivate this member?",
    body: (m) =>
      `${m.firstName} ${m.lastName} will lose access immediately. You can reactivate them later.`,
    action: "Deactivate",
  },
  activate: {
    title: "Reactivate this member?",
    body: (m) =>
      `${m.firstName} ${m.lastName} will regain access to the firm's workspace.`,
    action: "Reactivate",
  },
  "force-logout": {
    title: "Force sign out?",
    body: (m) =>
      `${m.firstName} ${m.lastName} will be signed out of every active session immediately.`,
    action: "Sign out everywhere",
  },
};

function TeamSkeleton() {
  return (
    <div className="rounded-[3px] border border-border">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-b-0"
        >
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function TeamSection() {
  const { data: members, isLoading, isError } = useTeamMembers();
  const deactivateUser = useDeactivateUser();
  const activateUser = useActivateUser();
  const forceLogoutUser = useForceLogoutUser();

  const [roleDialogMember, setRoleDialogMember] = useState<TeamMember | null>(
    null,
  );
  const [statusDialogMember, setStatusDialogMember] =
    useState<TeamMember | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(
    null,
  );
  const [isConfirming, setIsConfirming] = useState(false);

  const runConfirmAction = async () => {
    if (!confirmAction) return;
    setIsConfirming(true);
    try {
      if (confirmAction.type === "deactivate") {
        await deactivateUser.mutateAsync(confirmAction.member.id);
      } else if (confirmAction.type === "activate") {
        await activateUser.mutateAsync(confirmAction.member.id);
      } else {
        await forceLogoutUser.mutateAsync(confirmAction.member.id);
      }
      setConfirmAction(null);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
            § Team
          </p>
          <h2 className="mt-1 font-newsreader text-xl font-medium text-foreground">
            Staff on file
          </h2>
        </div>
        <InviteMemberDialog />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <TeamSkeleton />
        ) : isError ? (
          <div className="rounded-[3px] border border-lc-stamp/30 bg-lc-stamp/5 px-5 py-6 text-center text-sm text-muted-foreground">
            Couldn&apos;t load the team list.
          </div>
        ) : !members || members.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[3px] border border-dashed border-border px-6 py-12 text-center">
            <RiTeamLine className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No one&apos;s been invited yet — invite your first team member to
              test role-based access.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[3px] border border-border">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-lc-paper-warm text-[11px] text-foreground">
                            {member.firstName.slice(0, 1)}
                            {member.lastName.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-[12.5px] text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-plexmono text-[11px] uppercase tracking-wide text-muted-foreground">
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge value={member.status} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <RiMore2Line className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end" className="w-fit">
                          <DropdownMenuItem
                            onClick={() => setRoleDialogMember(member)}
                          >
                            <RiShieldUserLine className="mr-2 h-4 w-4" />
                            Change role
                          </DropdownMenuItem>
                          {member.status.toUpperCase() === "DEACTIVATED" ||
                          member.status.toUpperCase() ===
                            "PENDING_VERIFICATION" ? (
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmAction({ type: "activate", member })
                              }
                            >
                              <RiPlayCircleLine className="mr-2 h-4 w-4" />
                              Reactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                setConfirmAction({ type: "deactivate", member })
                              }
                            >
                              <RiPauseCircleLine className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => setStatusDialogMember(member)}
                          >
                            <RiUserSettingsLine className="mr-2 h-4 w-4" />
                            Change status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              setConfirmAction({ type: "force-logout", member })
                            }
                          >
                            <RiLogoutBoxRLine className="mr-2 h-4 w-4" />
                            Force sign out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {roleDialogMember ? (
        <ChangeRoleDialog
          member={roleDialogMember}
          open={Boolean(roleDialogMember)}
          onOpenChange={(open) => {
            if (!open) setRoleDialogMember(null);
          }}
        />
      ) : null}

      {statusDialogMember ? (
        <ChangeStatusDialog
          member={statusDialogMember}
          open={Boolean(statusDialogMember)}
          onOpenChange={(open) => {
            if (!open) setStatusDialogMember(null);
          }}
        />
      ) : null}

      <AlertDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          {confirmAction ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-newsreader text-xl font-medium">
                  {confirmCopy[confirmAction.type].title}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmCopy[confirmAction.type].body(confirmAction.member)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isConfirming}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={runConfirmAction}
                  disabled={isConfirming}
                  className="bg-lc-stamp text-lc-paper hover:bg-lc-stamp-dark"
                >
                  {isConfirming
                    ? "Working..."
                    : confirmCopy[confirmAction.type].action}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : null}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
