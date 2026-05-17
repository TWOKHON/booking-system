"use client";

import * as React from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVerticalIcon,
  ImagePlusIcon,
  PencilLineIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/animated-ui/FileUpload";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useUploadThing } from "@/lib/uploadthing";
import { useTRPC } from "@/trpc/client";
import { ScrollArea } from "@/components/ui/scroll-area";

type RoomImageRecord = {
  id: string;
  fileKey: string;
  imageUrl: string;
  altText: string | null;
  caption: string | null;
  sortOrder: number;
};

type RoomImageFormValues = {
  fileKey: string;
  imageUrl: string;
  caption: string;
};

const defaultRoomImageForm: RoomImageFormValues = {
  fileKey: "",
  imageUrl: "",
  caption: "",
};

function RoomImageForm({
  values,
  onChange,
  uploadTitle,
  uploadDescription,
  onFileSelect,
  isUploading,
}: {
  values: RoomImageFormValues;
  onChange: (values: RoomImageFormValues) => void;
  uploadTitle: string;
  uploadDescription: string;
  onFileSelect: (files: File[]) => void | Promise<void>;
  isUploading: boolean;
}) {
  return (
    <div className="grid gap-4">
      <div className="space-y-3">
        <FileUpload
          onChange={onFileSelect}
          title={isUploading ? "Uploading image..." : uploadTitle}
          description={uploadDescription}
        />
        {values.imageUrl ? (
          <div className="overflow-hidden rounded-xl border">
            <div className="w-full h-70 bg-muted">
              <Image
                src={values.imageUrl}
                alt="Uploaded room preview"
                width={600}
                height={600}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Textarea
          id="room-image-caption"
          placeholder="Optional caption guests will recognize"
          value={values.caption}
          onChange={(event) =>
            onChange({
              ...values,
              caption: event.target.value,
            })
          }
          className="min-h-24"
        />
      </div>
    </div>
  );
}

function EditImageDialog({
  open,
  onOpenChange,
  roomId,
  initialValues,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: string;
  initialValues: RoomImageFormValues;
  onSubmit: (values: RoomImageFormValues) => Promise<void>;
  isPending: boolean;
}) {
  const [form, setForm] = React.useState<RoomImageFormValues>(initialValues);
  const uploadThing = useUploadThing("roomImageUploader", {
    onUploadError: (error) => {
      toast.error(error.message || "Failed to upload room image.");
    },
  });

  React.useEffect(() => {
    if (open) {
      setForm(initialValues);
    }
  }, [initialValues, open]);

  const isDisabled = !form.imageUrl.trim();

  async function handleFileSelect(files: File[]) {
    const file = files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 5MB.");
      return;
    }

    try {
      const response = await uploadThing.startUpload([file], { roomId });
      const uploaded = response?.[0];

      if (!uploaded) {
        throw new Error("Upload did not return a file.");
      }

      setForm((current) => ({
        ...current,
        fileKey: uploaded.serverData.fileKey,
        imageUrl: uploaded.serverData.imageUrl,
      }));
      toast.success("Image ready to save.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process image.",
      );
    }
  }

  async function handleSubmit() {
    if (isDisabled) {
      return;
    }

    await onSubmit(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl! max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit image</DialogTitle>
          <DialogDescription>
            Replace the image or update the caption for this room.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-150">
          <RoomImageForm
            values={form}
            onChange={setForm}
            uploadTitle="Replace image"
            uploadDescription="Drag or drop a new room image here, or click to upload"
            onFileSelect={handleFileSelect}
            isUploading={uploadThing.isUploading}
          />
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isDisabled || isPending || uploadThing.isUploading}
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteImageAlert({
  roomName,
  trigger,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: {
  roomName: string;
  trigger?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete image?</AlertDialogTitle>
          <AlertDialogDescription>
            This room image will be removed from the gallery for {roomName ?? "this room"} immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete image"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function buildImageFormFromRecord(image: RoomImageRecord): RoomImageFormValues {
  return {
    fileKey: image.fileKey ?? "",
    imageUrl: image.imageUrl,
    caption: image.caption ?? "",
  };
}

function SortableRoomImageCard({
  image,
  roomName,
  onEdit,
  onDelete,
  isDeleting,
}: {
  image: RoomImageRecord;
  roomName: string;
  onEdit: (image: RoomImageRecord) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "opacity-70" : ""}
    >
      <div className="overflow-hidden rounded-xl border bg-background">
        <div className="relative aspect-4/3 bg-muted">
          <Image
            src={image.imageUrl}
            alt={roomName}
            width={1200}
            height={900}
            unoptimized
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full border bg-background/90 text-muted-foreground shadow-sm"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="size-4" />
            <span className="sr-only">Drag to reorder image</span>
          </button>
        </div>
        <div className="space-y-3 p-3">
          <p className="text-sm font-medium">
            {image.caption?.trim() || "Untitled room image"}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(image)}>
              <PencilLineIcon className="size-4" />
              Edit
            </Button>
            <DeleteImageAlert
              roomName={roomName}
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              onConfirm={async () => {
                await onDelete();
              }}
              isPending={isDeleting}
              trigger={
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2Icon className="size-4" />
                  Delete
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function RoomImagesDialog({
  roomId,
  roomName,
  open,
  onOpenChange,
}: {
  roomId: string;
  roomName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const imagesQueryKey = trpc.rooms.listImages.queryKey({ roomId });
  const [createForm, setCreateForm] =
    React.useState<RoomImageFormValues>(defaultRoomImageForm);
  const [editTarget, setEditTarget] = React.useState<RoomImageRecord | null>(
    null,
  );
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const imagesQuery = useQuery({
    ...trpc.rooms.listImages.queryOptions({ roomId }),
    enabled: open,
  });

  const addImageMutation = useMutation(
    trpc.rooms.addImage.mutationOptions({
      onSuccess: async () => {
        toast.success("Room image added.");
        setCreateForm(defaultRoomImageForm);
        await queryClient.invalidateQueries({ queryKey: imagesQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add room image.");
      },
    }),
  );

  const updateImageMutation = useMutation(
    trpc.rooms.updateImage.mutationOptions({
      onSuccess: async () => {
        toast.success("Room image updated.");
        setEditTarget(null);
        await queryClient.invalidateQueries({ queryKey: imagesQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update room image.");
      },
    }),
  );

  const deleteImageMutation = useMutation(
    trpc.rooms.deleteImage.mutationOptions({
      onSuccess: async () => {
        toast.success("Room image deleted.");
        await queryClient.invalidateQueries({ queryKey: imagesQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete room image.");
      },
    }),
  );

  const reorderImagesMutation = useMutation(
    trpc.rooms.reorderImages.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: imagesQueryKey });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to reorder room images.");
      },
    }),
  );

  const isCreateDisabled = !createForm.imageUrl.trim();
  const images = imagesQuery.data ?? [];

  async function handleCreateImage() {
    if (isCreateDisabled) {
      return;
    }

    await addImageMutation.mutateAsync({
      roomId,
      image: {
        fileKey: createForm.fileKey,
        imageUrl: createForm.imageUrl.trim(),
        caption: createForm.caption.trim(),
      },
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || images.length <= 1) {
      return;
    }

    const oldIndex = images.findIndex((image) => image.id === active.id);
    const newIndex = images.findIndex((image) => image.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const ordered = arrayMove(images, oldIndex, newIndex);

    queryClient.setQueryData(imagesQueryKey, ordered);

    await reorderImagesMutation.mutateAsync({
      roomId,
      orderedImageIds: ordered.map((image) => image.id),
    });
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl!">
          <DialogHeader>
            <div className="px-6 pt-6">
              <DialogTitle>{roomName} images</DialogTitle>
            </div>
            <div className="px-6">
              <DialogDescription>
                Add, update, remove, and drag images into the order you want
                guests to see.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="max-h-[calc(90vh-88px)] overflow-y-auto px-6 pb-6">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_550px]">
              <div className="min-w-0 space-y-4">
                <div className="rounded-xl border bg-muted/20 p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                    <ImagePlusIcon className="size-4" />
                    Current gallery
                  </div>

                  {imagesQuery.isPending ? (
                    <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                      Loading room images...
                    </div>
                  ) : images.length > 0 ? (
                    <>
                      <p className="mb-4 text-xs text-muted-foreground">
                        Drag the handle on each image to reorder the gallery.
                      </p>
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={images.map((image) => image.id)}
                          strategy={rectSortingStrategy}
                        >
                          <div className="grid gap-4 md:grid-cols-2">
                            {images.map((image) => (
                              <SortableRoomImageCard
                                key={image.id}
                                image={image}
                                roomName={roomName}
                                onEdit={setEditTarget}
                                onDelete={async () => {
                                  await deleteImageMutation.mutateAsync({
                                    roomId,
                                    imageId: image.id,
                                  });
                                }}
                                isDeleting={
                                  deleteImageMutation.isPending &&
                                  deleteImageMutation.variables?.imageId === image.id
                                }
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    </>
                  ) : (
                    <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                      No room images yet. Add the first image from the form on
                      the right.
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 space-y-4">
                <div className="rounded-xl border bg-background p-4">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                    <PlusIcon className="size-4" />
                    Add new image
                  </div>
                  <RoomImageCreateForm
                    roomId={roomId}
                    values={createForm}
                    onChange={setCreateForm}
                    onSubmit={handleCreateImage}
                    isPending={addImageMutation.isPending}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EditImageDialog
        open={!!editTarget}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setEditTarget(null);
          }
        }}
        roomId={roomId}
        initialValues={
          editTarget
            ? buildImageFormFromRecord(editTarget)
            : defaultRoomImageForm
        }
        onSubmit={async (values) => {
          if (!editTarget) {
            return;
          }

          await updateImageMutation.mutateAsync({
            roomId,
            imageId: editTarget.id,
            image: {
              fileKey: values.fileKey,
              imageUrl: values.imageUrl.trim(),
              caption: values.caption.trim(),
            },
          });
        }}
        isPending={updateImageMutation.isPending}
      />
    </>
  );
}

function RoomImageCreateForm({
  roomId,
  values,
  onChange,
  onSubmit,
  isPending,
}: {
  roomId: string;
  values: RoomImageFormValues;
  onChange: (values: RoomImageFormValues) => void;
  onSubmit: () => Promise<void>;
  isPending: boolean;
}) {
  const uploadThing = useUploadThing("roomImageUploader", {
    onUploadError: (error) => {
      toast.error(error.message || "Failed to upload room image.");
    },
  });
  const isCreateDisabled = !values.imageUrl.trim();

  async function handleFileSelect(files: File[]) {
    const file = files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please upload an image smaller than 5MB.");
      return;
    }

    try {
      const response = await uploadThing.startUpload([file], { roomId });
      const uploaded = response?.[0];

      if (!uploaded) {
        throw new Error("Upload did not return a file.");
      }

      onChange({
        ...values,
        fileKey: uploaded.serverData.fileKey,
        imageUrl: uploaded.serverData.imageUrl,
      });
      toast.success("Image ready to add.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process image.",
      );
    }
  }

  return (
    <>
      <RoomImageForm
        values={values}
        onChange={onChange}
        uploadTitle="Upload room image"
        uploadDescription="Drag or drop a room image here, or click to upload"
        onFileSelect={handleFileSelect}
        isUploading={uploadThing.isUploading}
      />
      <div className="mt-4 rounded-lg border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Uploaded images are stored directly with this room gallery so you can
        manage them inside ResortCloud.
      </div>
      <DialogFooter className="mt-4">
        <Button
          variant="outline"
          onClick={() => onChange(defaultRoomImageForm)}
        >
          Clear
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isCreateDisabled || isPending || uploadThing.isUploading}
        >
          {isPending ? "Adding..." : "Add image"}
        </Button>
      </DialogFooter>
    </>
  );
}
