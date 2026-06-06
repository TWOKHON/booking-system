export type BuilderViewport = "desktop" | "tablet" | "mobile";

export type BuilderButtonVariant = "primary" | "secondary";

export type BuilderCanvasPlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BuilderCanvasComponentType =
  | "button"
  | "link"
  | "text"
  | "heading"
  | "image"
  | "divider"
  | "spacer"
  | "container"
  | "columns"
  | "grid"
  | "gallery"
  | "video"
  | "icon"
  | "map"
  | "embed"
  | "form"
  | "input"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio";

export type BuilderButtonSchema = {
  id: string;
  type: "button";
  label: string;
  variant: BuilderButtonVariant;
};

export type BuilderHeroSectionSchema = {
  id: string;
  type: "hero";
  eyebrow: string;
  title: string;
  description: string;
  buttons: BuilderButtonSchema[];
  mediaLabel: string | null;
};

export type BuilderFeatureCardSchema = {
  id: string;
  title: string;
  description: string;
};

export type BuilderFeatureGridSectionSchema = {
  id: string;
  type: "feature-grid";
  eyebrow: string;
  title: string;
  description: string;
  cards: BuilderFeatureCardSchema[];
};

export type BuilderSectionSchema =
  | BuilderHeroSectionSchema
  | BuilderFeatureGridSectionSchema;

export type BuilderCanvasButtonNode = {
  id: string;
  type: "button";
  label: string;
  variant: BuilderButtonVariant;
  placement: BuilderCanvasPlacement;
};

export type BuilderCanvasLinkNode = {
  id: string;
  type: "link";
  label: string;
  href: string;
  placement: BuilderCanvasPlacement;
};

export type BuilderCanvasTextNode = {
  id: string;
  type: "text";
  text: string;
  placement: BuilderCanvasPlacement;
};

export type BuilderCanvasHeadingNode = {
  id: string;
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
  placement: BuilderCanvasPlacement;
};

export type BuilderCanvasContainerNode = {
  id: string;
  type: "container";
  label: string;
  placement: BuilderCanvasPlacement;
  children: BuilderCanvasNode[];
};

export type BuilderCanvasPlaceholderNode = {
  id: string;
  type: Exclude<
    BuilderCanvasComponentType,
    "button" | "link" | "text" | "heading" | "container"
  >;
  label: string;
  description: string;
  placement: BuilderCanvasPlacement;
};

export type BuilderCanvasNode =
  | BuilderCanvasButtonNode
  | BuilderCanvasLinkNode
  | BuilderCanvasTextNode
  | BuilderCanvasHeadingNode
  | BuilderCanvasContainerNode
  | BuilderCanvasPlaceholderNode;

export type BuilderPageSchema = {
  id: string;
  name: string;
  siteId: string;
  resortName: string;
  propertyType: string | null;
  publishStatus: "Live" | "Draft";
  navigation: string[];
  breadcrumbs: string[];
  heroImageUrl: string | null;
  sections: BuilderSectionSchema[];
  canvasItems: BuilderCanvasNode[];
};

export type BuilderSchemaSeedInput = {
  siteId: string;
  resortName: string;
  propertyType: string | null;
  publishStatus: "Live" | "Draft";
  heroImageUrl: string | null;
  heroImageLabel: string | null;
  roomNames: string[];
  serviceNames: string[];
};

export function createDefaultBuilderPageSchema(
  input: BuilderSchemaSeedInput,
): BuilderPageSchema {
  return {
    id: `page-${input.siteId}`,
    name: "Home page",
    siteId: input.siteId,
    resortName: input.resortName,
    propertyType: input.propertyType,
    publishStatus: input.publishStatus,
    navigation: [],
    breadcrumbs: ["Body"],
    heroImageUrl: input.heroImageUrl,
    sections: [],
    canvasItems: [],
  };
}

export function createCanvasNodeFromComponent(
  componentType: BuilderCanvasComponentType,
  index: number,
  placement?: Partial<BuilderCanvasPlacement>,
): BuilderCanvasNode {
  const sequence = index + 1;
  const defaultPlacement = (width: number): BuilderCanvasPlacement => ({
    x: placement?.x ?? 32,
    y: placement?.y ?? 32,
    width: placement?.width ?? width,
    height: placement?.height ?? 120,
  });

  switch (componentType) {
    case "button":
      return {
        id: `canvas-button-${sequence}`,
        type: "button",
        label: `Button ${sequence}`,
        variant: "secondary",
        placement: { ...defaultPlacement(220), height: placement?.height ?? 72 },
      };
    case "link":
      return {
        id: `canvas-link-${sequence}`,
        type: "link",
        label: `Link ${sequence}`,
        href: "/",
        placement: { ...defaultPlacement(180), height: placement?.height ?? 56 },
      };
    case "text":
      return {
        id: `canvas-text-${sequence}`,
        type: "text",
        text: "Add your paragraph text here.",
        placement: { ...defaultPlacement(360), height: placement?.height ?? 140 },
      };
    case "heading":
      return {
        id: `canvas-heading-${sequence}`,
        type: "heading",
        text: "Add your heading",
        level: 2,
        placement: { ...defaultPlacement(420), height: placement?.height ?? 120 },
      };
    case "image":
      return {
        id: `canvas-image-${sequence}`,
        type: "image",
        label: `Image ${sequence}`,
        description: "Drop media here or connect an uploaded asset later.",
        placement: { ...defaultPlacement(320), height: placement?.height ?? 220 },
      };
    case "divider":
      return {
        id: `canvas-divider-${sequence}`,
        type: "divider",
        label: "Divider",
        description: "Use this to separate visual sections on the page.",
        placement: { ...defaultPlacement(420), height: placement?.height ?? 32 },
      };
    case "spacer":
      return {
        id: `canvas-spacer-${sequence}`,
        type: "spacer",
        label: "Spacer",
        description: "Adds breathing room between blocks.",
        placement: { ...defaultPlacement(320), height: placement?.height ?? 96 },
      };
    case "container":
      return {
        id: `canvas-container-${sequence}`,
        type: "container",
        label: `Container ${sequence}`,
        placement: { ...defaultPlacement(520), height: placement?.height ?? 180 },
        children: [],
      };
    case "columns":
      return {
        id: `canvas-columns-${sequence}`,
        type: "columns",
        label: `Columns ${sequence}`,
        description: "A multi-column layout block for side-by-side content.",
        placement: { ...defaultPlacement(420), height: placement?.height ?? 180 },
      };
    case "grid":
      return {
        id: `canvas-grid-${sequence}`,
        type: "grid",
        label: `Grid ${sequence}`,
        description: "A repeating grid layout for cards or amenities.",
        placement: { ...defaultPlacement(420), height: placement?.height ?? 180 },
      };
    case "gallery":
      return {
        id: `canvas-gallery-${sequence}`,
        type: "gallery",
        label: `Gallery ${sequence}`,
        description: "A visual gallery section for room or resort imagery.",
        placement: { ...defaultPlacement(340), height: placement?.height ?? 220 },
      };
    case "video":
      return {
        id: `canvas-video-${sequence}`,
        type: "video",
        label: `Video ${sequence}`,
        description: "Embed a hosted video or promo reel here.",
        placement: { ...defaultPlacement(340), height: placement?.height ?? 220 },
      };
    case "icon":
      return {
        id: `canvas-icon-${sequence}`,
        type: "icon",
        label: `Icon ${sequence}`,
        description: "A small visual icon block for feature callouts.",
        placement: { ...defaultPlacement(220), height: placement?.height ?? 96 },
      };
    case "map":
      return {
        id: `canvas-map-${sequence}`,
        type: "map",
        label: `Map ${sequence}`,
        description: "Show the resort location or nearby destinations.",
        placement: { ...defaultPlacement(360), height: placement?.height ?? 220 },
      };
    case "embed":
      return {
        id: `canvas-embed-${sequence}`,
        type: "embed",
        label: `Embed ${sequence}`,
        description: "Embed custom widgets or third-party content.",
        placement: { ...defaultPlacement(360), height: placement?.height ?? 220 },
      };
    case "form":
      return {
        id: `canvas-form-${sequence}`,
        type: "form",
        label: `Form ${sequence}`,
        description: "A lead or inquiry form container.",
        placement: { ...defaultPlacement(360), height: placement?.height ?? 220 },
      };
    case "input":
      return {
        id: `canvas-input-${sequence}`,
        type: "input",
        label: `Input ${sequence}`,
        description: "A single-line text field placeholder.",
        placement: { ...defaultPlacement(320), height: placement?.height ?? 72 },
      };
    case "textarea":
      return {
        id: `canvas-textarea-${sequence}`,
        type: "textarea",
        label: `Textarea ${sequence}`,
        description: "A long-form text input field placeholder.",
        placement: { ...defaultPlacement(340), height: placement?.height ?? 140 },
      };
    case "select":
      return {
        id: `canvas-select-${sequence}`,
        type: "select",
        label: `Select ${sequence}`,
        description: "A dropdown field placeholder.",
        placement: { ...defaultPlacement(320), height: placement?.height ?? 72 },
      };
    case "checkbox":
      return {
        id: `canvas-checkbox-${sequence}`,
        type: "checkbox",
        label: `Checkbox ${sequence}`,
        description: "A consent or options checkbox field.",
        placement: { ...defaultPlacement(320), height: placement?.height ?? 72 },
      };
    case "radio":
      return {
        id: `canvas-radio-${sequence}`,
        type: "radio",
        label: `Radio ${sequence}`,
        description: "A radio option group placeholder.",
        placement: { ...defaultPlacement(320), height: placement?.height ?? 72 },
      };
    default: {
      const exhaustiveCheck: never = componentType;
      throw new Error(`Unsupported component type: ${exhaustiveCheck}`);
    }
  }
}
