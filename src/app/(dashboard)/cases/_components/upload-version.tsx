"use client";

import { useRef, useState } from "react";
import { RiFileLine, RiCloseLine, RiUploadCloud2Line } from "@remixicon/react";
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
} from "@/components/ui/dialog";
import { useUploadDocument } from "@/hooks/features/use-documents";
import { formatBytes } from "@/lib/formatter";

export function UploadVersionDialog({
  caseId,
  documentId,
  open,
  onOpenChange,
}: {
  caseId: string;
  documentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [changeDescription, setChangeDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useUploadDocument();

  const reset = () => {
    setFile(null);
    setChangeDescription("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    setError(null);
    try {
      await uploadFile.mutateAsync({
        caseId,
        id: documentId,
        file,
        changeDescription,
      });
      reset();
      onOpenChange(false);
    } catch {
      setError("Upload failed. Try again.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Upload new version
          </DialogTitle>
          <DialogDescription>
            This replaces the current file on record.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {file ? (
            <div className="flex items-center justify-between rounded-[3px] border border-lc-ink/12 bg-lc-paper-warm px-3.5 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <RiFileLine className="h-4 w-4 shrink-0 text-lc-slate" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-foreground">
                    {file.name}
                  </p>
                  <p className="font-plexmono text-[10.5px] text-muted-foreground">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Remove file"
              >
                <RiCloseLine className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-[3px] border border-dashed border-border px-6 py-8 text-center hover:border-primary/50"
            >
              <RiUploadCloud2Line className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to choose a file
              </span>
            </button>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="change-description">What changed</Label>
            <Input
              id="change-description"
              value={changeDescription}
              onChange={(e) => setChangeDescription(e.target.value)}
              placeholder="e.g. Incorporated redline comments"
            />
          </div>

          {error ? <p className="text-sm text-lc-stamp">{error}</p> : null}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploadFile.isPending}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
            loading={uploadFile.isPending}
            loadingText="Uploading..."
          >
            Upload version
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
