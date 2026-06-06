"use client";

import * as React from "react";
import {Puck} from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import {useTRPC} from "@/trpc/client";
import {useQuery, useMutation} from "@tanstack/react-query";
import {config, type PuckData} from "../../_lib/puck/puck-config";
import {PUCK_PREVIEW_STORAGE_KEY} from "../../_lib/puck/puck-storage";
import {getResortTemplate} from "../../_lib/puck/resort-templates";
import {Button} from "@/components/ui/button";
import {Eye, Plus, Trash2} from "lucide-react";
import {toast} from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type SiteBuilderViewProps = {
    siteId: string;
    resortName: string;
    templateSlug?: string;
};

const initialData: PuckData = {content: [], root: {props: {theme: ""}}};

type PageData = Record<string, PuckData>;

function HeaderActions({
                           state,
                           allPages,
                           currentPath,
                           onPathChange,
                           onAddPage,
                           onDeletePage,
                           onSaveDraft,
                           isSaving,
                       }: {
    state: { data: PuckData };
    allPages: PageData;
    currentPath: string;
    onPathChange: (path: string) => void;
    onAddPage: () => void;
    onDeletePage: (path: string) => void;
    onSaveDraft: () => void;
    isSaving: boolean;
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border-l pl-4">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Page:
        </span>
                <Select value={currentPath} onValueChange={onPathChange}>
                    <SelectTrigger className="w-[180px] h-9">
                        <SelectValue placeholder="Select page"/>
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(allPages).map((path) => {
                            let label = path;
                            if (path === "/") {
                                label = "Home";
                            } else {
                                // Remove leading slash and capitalize
                                label = path.substring(1);
                                label = label.charAt(0).toUpperCase() + label.slice(1);
                                // Replace hyphens with spaces
                                label = label.replace(/-/g, " ");
                            }

                            return (
                                <SelectItem key={path} value={path}>
                                    {label}
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <Button
                    variant="ghost"
                    size="lg"
                    onClick={onAddPage}
                    title="Add new page"
                >
                    <Plus className="size-4"/> Add new page
                </Button>
                {currentPath !== "/" && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => onDeletePage(currentPath)}
                        title="Delete current page"
                    >
                        <Trash2 className="size-4"/>
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="lg"
                    onClick={onSaveDraft}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Draft"}
                </Button>
            </div>

            <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => {
                    const previewData = {
                        ...allPages,
                        [currentPath]: state.data,
                    };
                    window.localStorage.setItem(
                        PUCK_PREVIEW_STORAGE_KEY,
                        JSON.stringify(previewData)
                    );
                    window.open("/preview", "_blank", "noopener,noreferrer");
                }}
            >
                <Eye className="size-4"/>
                Preview
            </Button>
        </div>
    );
}

export function SiteBuilderView({
                                    siteId,
                                    resortName,
                                    templateSlug,
                                }: SiteBuilderViewProps) {
    void siteId;
    void resortName;
    const trpc = useTRPC();

    const {data: siteData, isLoading: isLoadingSite} = useQuery(
        trpc.siteBuilder.get.queryOptions()
    );

    const [allPages, setAllPages] = React.useState<PageData>({});
    const [hasInitialized, setHasInitialized] = React.useState(false);

    // Initialize data from DB or template
    React.useEffect(() => {
        if (!isLoadingSite && !hasInitialized) {
            if (siteData?.draftData) {
                setAllPages(siteData.draftData as PageData);
            } else if (siteData?.publishedData) {
                setAllPages(siteData.publishedData as PageData);
            } else {
                // Fallback to template
                const template = getResortTemplate(templateSlug || null);
                if (template?.data && typeof template.data === "object" && "/" in template.data) {
                    setAllPages(JSON.parse(JSON.stringify(template.data)));
                } else {
                    const data = JSON.parse(JSON.stringify(template?.data ?? initialData));
                    setAllPages({"/": data});
                }
            }
            setHasInitialized(true);
        }
    }, [siteData, isLoadingSite, hasInitialized, templateSlug]);

    const [currentPath, setCurrentPath] = React.useState("/");
    const [isAddPageOpen, setIsAddPageOpen] = React.useState(false);
    const [newPagePath, setNewPagePath] = React.useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [pathToDelete, setPathToDelete] = React.useState<string | null>(null);

    const saveDraftMutation = useMutation(trpc.siteBuilder.saveDraft.mutationOptions({
        onSuccess: () => {
            toast.success("Draft saved successfully");
        },
        onError: (err) => {
            toast.error(`Failed to save draft: ${err.message}`);
        }
    }));

    const publishMutation = useMutation(trpc.siteBuilder.publish.mutationOptions({
        onSuccess: () => {
            toast.success("Site published successfully");
        },
        onError: (err) => {
            toast.error(`Failed to publish: ${err.message}`);
        }
    }));

    const handleSaveDraft = () => {
        saveDraftMutation.mutate({data: allPages});
    };

    const handlePublish = async (data: PuckData) => {
        const updatedPages = {...allPages, [currentPath]: data};
        publishMutation.mutate({data: updatedPages});
    };

    const handleAddPage = () => {
        if (!newPagePath) return;

        let path = newPagePath.startsWith("/") ? newPagePath : `/${newPagePath}`;
        path = path.toLowerCase().replace(/\s+/g, "-");

        if (allPages[path]) {
            toast.error("Page already exists");
            return;
        }

        setAllPages((prev) => ({
            ...prev,
            [path]: JSON.parse(JSON.stringify(initialData)),
        }));
        setCurrentPath(path);
        setIsAddPageOpen(false);
        setNewPagePath("");
        toast.success(`Page ${path} created`);
    };

    const handleDeletePage = () => {
        if (!pathToDelete || pathToDelete === "/") return;

        setAllPages((prev) => {
            const next = {...prev};
            delete next[pathToDelete];
            return next;
        });

        if (currentPath === pathToDelete) {
            setCurrentPath("/");
        }

        toast.success(`Page ${pathToDelete} deleted`);
        setIsDeleteDialogOpen(false);
        setPathToDelete(null);
    };

    return (
        <div className="h-screen bg-white">
            {(!hasInitialized || isLoadingSite) ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 mx-auto mb-4"></div>
                        <p className="text-sm text-zinc-500">Loading site builder...</p>
                    </div>
                </div>
            ) : (
                <Puck
                    key={currentPath} // Force remount when switching pages
                    config={config}
                    data={allPages[currentPath] || initialData}
                    onPublish={handlePublish}
                    onChange={(newData) => {
                        setAllPages((prev) => ({...prev, [currentPath]: newData}));
                    }}
                    renderHeaderActions={({state}) => (
                        <div className="flex items-center gap-2">
                            <HeaderActions
                                state={state}
                                allPages={allPages}
                                currentPath={currentPath}
                                onPathChange={setCurrentPath}
                                onAddPage={() => setIsAddPageOpen(true)}
                                onDeletePage={(path) => {
                                    setPathToDelete(path);
                                    setIsDeleteDialogOpen(true);
                                }}
                                onSaveDraft={handleSaveDraft}
                                isSaving={saveDraftMutation.isPending}
                            />
                        </div>
                    )}
                />
            )}

            {/* Add Page Dialog */}
            <Dialog open={isAddPageOpen} onOpenChange={setIsAddPageOpen}>
                <DialogContent className="max-w-xl!">
                    <DialogHeader>
                        <DialogTitle>Add New Page</DialogTitle>
                        <DialogDescription>
                            Enter the path for your new page. It should start with a forward
                            slash.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="path">
                            Path
                        </Label>
                        <Input
                            id="path"
                            placeholder="/rooms"
                            className="col-span-3"
                            value={newPagePath}
                            onChange={(e) => setNewPagePath(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddPage();
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddPageOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddPage}>Create Page</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Page Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the page{" "}
                            <span className="font-semibold">{pathToDelete}</span> and remove
                            all its content. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPathToDelete(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeletePage}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
