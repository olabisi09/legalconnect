"use client";

import { useRef, useState } from "react";
import { RiUploadCloud2Line, RiFileLine, RiCloseLine } from "@remixicon/react";

import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/app-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  useRegisterDocument,
  useUploadDocument,
} from "@/hooks/features/use-documents";
import type { Confidentiality } from "@/types/document";
import { formatBytes } from "@/lib/formatter";

const CONFIDENTIALITY_LEVELS: { value: Confidentiality; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "INTERNAL", label: "Internal" },
  { value: "CONFIDENTIAL", label: "Confidential" },
  { value: "ATTORNEY_CLIENT_PRIVILEGED", label: "Attorney-Client Privileged" },
];

export function UploadDocumentModal({
  caseId,
  open,
  setOpen,
}: {
  caseId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [confidentiality, setConfidentiality] =
    useState<Confidentiality>("OPEN");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const registerDocument = useRegisterDocument();
  const uploadFile = useUploadDocument();
  const isSubmitting = registerDocument.isPending || uploadFile.isPending;

  const reset = () => {
    setFile(null);
    setConfidentiality("OPEN");
    setDescription("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    setError(null);
    try {
      // Step 1 — register the metadata record.
      const document = await registerDocument.mutateAsync({
        caseId,
        fileName: file.name,
        fileType: file.type || undefined,
        fileSize: file.size,
        confidentiality,
        description: description || undefined,
      });
      // Step 2 — push the actual bytes against the record just created.
      await uploadFile.mutateAsync({
        id: document.id,
        file,
        changeDescription: description || undefined,
      });
      reset();
      setOpen(false);
    } catch {
      setError("Upload failed partway through. Check the file and try again.");
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
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
          >
            <RiUploadCloud2Line className="mr-1.5 h-4 w-4" />
            Upload document
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-newsreader text-xl font-medium">
            Upload a document
          </DialogTitle>
          <DialogDescription>
            Every document carries a confidentiality level from the moment
            it&apos;s filed.
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
            <Label>Confidentiality</Label>
            <Select
              value={confidentiality}
              onValueChange={(v) => setConfidentiality(v as Confidentiality)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONFIDENTIALITY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doc-description">Description</Label>
            <Textarea
              id="doc-description"
              placeholder="What is this document?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error ? <p className="text-sm text-lc-stamp">{error}</p> : null}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <AppButton
            type="button"
            onClick={handleSubmit}
            className="bg-primary text-primary-foreground hover:bg-lc-stamp-dark"
            loading={isSubmitting}
            loadingText={
              registerDocument.isPending ? "Registering..." : "Uploading..."
            }
          >
            Upload
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
