"use client";

import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { UploadIcon, XIcon, Loader2Icon } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploaderProps {
  onUploadComplete: (res: { url: string; name: string; size: string; type: string }) => void;
  className?: string;
}

export function ImageUploader({ onUploadComplete, className }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { startUpload } = useUploadThing("tenantAssetUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res[0]) {
        toast.success("Image uploaded successfully");
        onUploadComplete({
          url: res[0].ufsUrl,
          name: res[0].name,
          size: formatBytes(res[0].size),
          type: res[0].type,
        });
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      await startUpload([file]);
    } catch (err) {
      setIsUploading(false);
      console.error(err);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-12 transition-colors hover:bg-muted",
          isDragActive && "border-primary bg-primary/5",
          isUploading && "pointer-events-none opacity-60",
        )}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-md border">
            <img
              src={preview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
              }}
              className="absolute top-2 right-2 rounded-full bg-background/80 p-1 text-foreground shadow-sm hover:bg-background"
              disabled={isUploading}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <UploadIcon className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive ? "Drop the image here" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP, GIF up to 8MB
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
