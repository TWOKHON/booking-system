"use client";

import * as React from "react";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRightIcon,
  ImageIcon,
  PlusIcon,
  UploadIcon,
} from "lucide-react";
import { AssetsTable } from "./AssetsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "./ImageUploader";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { config, type PuckData } from "@/app/site-builder/_lib/puck/puck-config";
import { Trash2Icon } from "lucide-react";

type AssetsWorkspaceViewProps = {
  siteId: string;
  userName: string;
  resortName: string;
};

type ThemeOption = {
  label: string;
  value: string;
};

type ComponentWithDefaults = {
  defaultProps?: Record<string, unknown>;
};

function isThemeOptionArray(value: unknown): value is ThemeOption[] {
  return (
    Array.isArray(value) &&
    value.every(
      (option) =>
        typeof option === "object" &&
        option !== null &&
        "label" in option &&
        "value" in option,
    )
  );
}

export function AssetsWorkspaceView({
  siteId,
  userName,
  resortName,
}: AssetsWorkspaceViewProps) {
  void siteId;
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = React.useState(false);
  const [isBrandKitOpen, setIsBrandKitOpen] = React.useState(false);
  const [isRoomGalleryOpen, setIsRoomGalleryOpen] = React.useState(false);
  const [isHeroMediaOpen, setIsHeroMediaOpen] = React.useState(false);
  
  // Asset Form states
  const [assetName, setAssetName] = React.useState("");
  const [assetUrl, setAssetUrl] = React.useState("");
  const [uploadMethod, setUploadMethod] = React.useState<"url" | "upload">("url");

  // Section Form states
  const [sectionName, setSectionName] = React.useState("");
  const [sectionType, setSectionType] = React.useState<string>("HeroBlock");

  const { data: sections, isLoading: isLoadingSections } = useQuery(
    trpc.siteBuilder.getSections.queryOptions()
  );

  const { data: assets } = useQuery(
    trpc.siteBuilder.getAssets.queryOptions()
  );

  const logoAsset = assets?.find(a => a.name.toLowerCase().includes("logo"));

  const { data: siteData } = useQuery(trpc.siteBuilder.get.queryOptions());

  const publishedData = siteData?.publishedData as PuckData | null | undefined;
  const draftData = siteData?.draftData as PuckData | null | undefined;
  const currentTheme =
    publishedData?.root?.props?.theme || draftData?.root?.props?.theme || "";
  const themeField = config.root?.fields?.theme;
  const themeOptions =
    themeField?.type === "select" && isThemeOptionArray(themeField.options)
      ? themeField.options
      : [];
  const themeName =
    themeOptions.find((option) => option.value === currentTheme)?.label ||
    "Default";

  const addAssetMutation = useMutation(
    trpc.siteBuilder.addAsset.mutationOptions({
      onSuccess: () => {
        toast.success("Asset added successfully");
        queryClient.invalidateQueries(trpc.siteBuilder.getAssets.queryFilter());
        setIsUploadOpen(false);
        setAssetName("");
        setAssetUrl("");
      },
      onError: (error) => {
        toast.error(`Failed to add asset: ${error.message}`);
      },
    })
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadMethod === "url") {
      if (!assetName || !assetUrl) {
        toast.error("Please fill in all fields");
        return;
      }

      addAssetMutation.mutate({
        name: assetName,
        url: assetUrl,
        type: assetUrl.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
        size: "Unknown",
      });
    }
  };

  const handleFileUploaded = (file: { url: string; name: string; size: string; type: string }) => {
    addAssetMutation.mutate({
      name: file.name,
      url: file.url,
      type: file.type,
      size: file.size,
    });
  };

  const addSectionMutation = useMutation(
    trpc.siteBuilder.addSection.mutationOptions({
      onSuccess: () => {
        toast.success("Section added successfully");
        queryClient.invalidateQueries(trpc.siteBuilder.getSections.queryFilter());
        setIsAddSectionOpen(false);
        setSectionName("");
      },
      onError: (error) => {
        toast.error(`Failed to add section: ${error.message}`);
      },
    })
  );

  const deleteSectionMutation = useMutation(
    trpc.siteBuilder.deleteSection.mutationOptions({
      onSuccess: () => {
        toast.success("Section deleted successfully");
        queryClient.invalidateQueries(trpc.siteBuilder.getSections.queryFilter());
      },
      onError: (error) => {
        toast.error(`Failed to delete section: ${error.message}`);
      },
    })
  );

  const handleAddSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName) {
      toast.error("Please provide a section name");
      return;
    }

    const componentConfig = config.components[
      sectionType as keyof typeof config.components
    ] as ComponentWithDefaults | undefined;
    const defaultProps = componentConfig?.defaultProps || {};

    addSectionMutation.mutate({
      name: sectionName,
      type: sectionType,
      content: {
        type: sectionType,
        props: {
          ...defaultProps,
          id: `${sectionType}-${Math.random().toString(36).substr(2, 9)}`,
        },
      },
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard
        userName={userName}
        message={`Welcome back to Assets & Sections for ${resortName}. Here you can manage your brand visuals, room photos, and marketing media.`}
      />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <ImageIcon className="size-3.5" />
                Media Assets
              </Badge>
              <Badge variant="secondary">Brand Kit</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Sections & Assets
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Centralized library for your resort&apos;s visual content. Upload high-quality photos for your website, social media, and guest communications.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2" onClick={() => setIsUploadOpen(true)}>
              <UploadIcon className="size-4" />
              Upload Assets
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => setIsAddSectionOpen(true)}>
              <PlusIcon className="size-4" />
              Add Section
            </Button>
          </div>
        </div>

        <div className="mt-8">
          <AssetsTable />
        </div>
      </section>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-125!">
          <DialogHeader>
            <DialogTitle>Upload Asset</DialogTitle>
            <DialogDescription>
              Choose a method to add a new image asset to your library.
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={uploadMethod}
            onValueChange={(value) =>
              setUploadMethod(value === "upload" ? "upload" : "url")
            }
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Image URL</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="pt-4">
              <form onSubmit={handleUpload} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Asset Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Resort Entrance"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Image URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/image.jpg"
                    value={assetUrl}
                    onChange={(e) => setAssetUrl(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addAssetMutation.isPending}>
                    {addAssetMutation.isPending ? "Adding..." : "Add Asset"}
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="upload" className="pt-4">
              <ImageUploader 
                onUploadComplete={handleFileUploaded} 
                className="w-full"
              />
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Section Dialog */}
      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogContent className="max-w-xl!">
          <form onSubmit={handleAddSection}>
            <DialogHeader>
              <DialogTitle>Add Pre-defined Section</DialogTitle>
              <DialogDescription>
                Create a reusable section with default settings that you can use in your site builder.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="section-name">Section Name</Label>
                <Input
                  id="section-name"
                  placeholder="e.g., Summer Hero, Room Gallery A"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="section-type">Section Type</Label>
                <Select value={sectionType} onValueChange={setSectionType}>
                  <SelectTrigger className="w-full" id="section-type">
                    <SelectValue placeholder="Select a block type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(config.components).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key.replace("Block", "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddSectionOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addSectionMutation.isPending}>
                {addSectionMutation.isPending ? "Creating..." : "Create Section"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sections List */}
      <section className="overflow-hidden border bg-background p-5 shadow-sm md:p-6 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Saved Sections</h2>
            <p className="text-sm text-muted-foreground">Your library of pre-configured website components.</p>
          </div>
          <Badge variant="outline">{sections?.length || 0} Sections</Badge>
        </div>

        {isLoadingSections ? (
          <div className="flex h-32 items-center justify-center">
            <PlusIcon className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : sections && sections.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.id} className="group relative overflow-hidden rounded-lg border bg-muted/30 p-4 transition-all hover:bg-muted/50">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-2">{section.type.replace("Block", "")}</Badge>
                    <h4 className="font-medium">{section.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(section.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteSectionMutation.mutate({ id: section.id })}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center border-2 border-dashed rounded-lg">
            <PlusIcon className="mx-auto mb-4 size-12 opacity-10" />
            <p className="text-muted-foreground">No sections created yet. Add your first pre-defined section.</p>
          </div>
        )}
      </section>
      
      {/* Brand Kit Dialog */}
      <Dialog open={isBrandKitOpen} onOpenChange={setIsBrandKitOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Brand Kit</DialogTitle>
            <DialogDescription>
              Upload and manage your brand assets for your website.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label>Primary Logo</Label>
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                <div className="size-16 rounded border bg-background flex items-center justify-center overflow-hidden">
                  {logoAsset ? (
                    <img src={logoAsset.url} alt="Logo" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <UploadIcon className="size-6 text-muted-foreground opacity-20" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{logoAsset ? logoAsset.name : "No logo uploaded"}</p>
                  <p className="text-xs text-muted-foreground">PNG, SVG or JPG (max 2MB)</p>
                </div>
                <Button size="sm" onClick={() => {
                  setUploadMethod("upload");
                  setIsUploadOpen(true);
                  setIsBrandKitOpen(false);
                }}>{logoAsset ? "Replace" : "Upload"}</Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Active Site Theme</Label>
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                <div className={`size-16 rounded border flex items-center justify-center overflow-hidden ${currentTheme}`}>
                   <div className="w-full h-full bg-background flex flex-col p-2 gap-1">
                      <div className="w-full h-2 bg-primary rounded-full" />
                      <div className="w-3/4 h-2 bg-muted rounded-full" />
                      <div className="w-1/2 h-2 bg-accent rounded-full" />
                   </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{themeName}</p>
                  <p className="text-xs text-muted-foreground">The visual theme currently applied to your website.</p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/site-builder/${siteId}`}>Change</a>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsBrandKitOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Gallery Dialog */}
      <Dialog open={isRoomGalleryOpen} onOpenChange={setIsRoomGalleryOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Room Galleries</DialogTitle>
            <DialogDescription>
              Manage assets specifically for your room showcases.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center border-2 border-dashed rounded-lg">
            <PlusIcon className="mx-auto mb-4 size-12 opacity-10" />
            <p className="text-muted-foreground">Select assets from your library or upload new ones to tag as &quot;Room Gallery&quot;.</p>
            <div className="mt-6 grid grid-cols-4 gap-4 px-4">
              {assets?.filter(a => a.name.toLowerCase().includes("room")).slice(0, 4).map(asset => (
                <div key={asset.id} className="aspect-square rounded border overflow-hidden relative group">
                  <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => {
              setIsUploadOpen(true);
              setIsRoomGalleryOpen(false);
            }}>
              Upload Room Photos
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsRoomGalleryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hero Media Dialog */}
      <Dialog open={isHeroMediaOpen} onOpenChange={setIsHeroMediaOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Hero Media</DialogTitle>
            <DialogDescription>
              High-resolution visuals for your landing sections.
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center border-2 border-dashed rounded-lg">
            <UploadIcon className="mx-auto mb-4 size-12 opacity-10" />
            <p className="text-muted-foreground">Hero images should be high-quality and optimized for wide screens.</p>
            <div className="mt-6 grid grid-cols-2 gap-4 px-4">
              {assets?.filter(a => a.name.toLowerCase().includes("hero") || a.name.toLowerCase().includes("banner")).slice(0, 2).map(asset => (
                <div key={asset.id} className="aspect-video rounded border overflow-hidden relative group">
                  <img src={asset.url} alt={asset.name} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => {
              setIsUploadOpen(true);
              setIsHeroMediaOpen(false);
            }}>
              Upload Hero Media
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHeroMediaOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h3 className="font-semibold">Logo & Branding</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your primary logo, favicons, and brand colors that appear across your site.
          </p>
          <Button variant="link" className="mt-4 h-auto p-0 text-primary" onClick={() => setIsBrandKitOpen(true)}>
            Edit brand kit <ArrowUpRightIcon className="ml-1 size-3" />
          </Button>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h3 className="font-semibold">Room Galleries</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Organize photos for specific room types to help guests choose their perfect stay.
          </p>
          <Button variant="link" className="mt-4 h-auto p-0 text-primary" onClick={() => setIsRoomGalleryOpen(true)}>
            Manage rooms <ArrowUpRightIcon className="ml-1 size-3" />
          </Button>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <h3 className="font-semibold">Hero Media</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Curate high-impact visuals for your homepage and landing sections.
          </p>
          <Button variant="link" className="mt-4 h-auto p-0 text-primary" onClick={() => setIsHeroMediaOpen(true)}>
            Update hero <ArrowUpRightIcon className="ml-1 size-3" />
          </Button>
        </div>
      </section>
    </main>
  );
}
