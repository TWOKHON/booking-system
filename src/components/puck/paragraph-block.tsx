type ParagraphBlockProps = {
  text: string;
  size: "sm" | "base" | "lg" | "xl";
};

const sizeClasses = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
} as const;

export function ParagraphBlock({ text, size }: ParagraphBlockProps) {
  return <p className={`${sizeClasses[size]} leading-relaxed text-foreground`}>{text}</p>;
}
