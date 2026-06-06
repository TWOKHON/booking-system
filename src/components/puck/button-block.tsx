import { Button } from "@/components/ui/button";

type ButtonBlockProps = {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
};

const variantMap = {
  primary: "default",
  secondary: "secondary",
  outline: "outline",
} as const;

const sizeMap = {
  sm: "sm",
  md: "default",
  lg: "lg",
} as const;

const sizeClasses = {
  sm: "",
  md: "",
  lg: "px-4",
};

export function ButtonBlock({ label, href, variant, size }: ButtonBlockProps) {
  return (
    <div className="flex">
      <Button
        asChild
        variant={variantMap[variant]}
        size={sizeMap[size]}
        className={sizeClasses[size]}
      >
        <a href={href || "#"}>{label}</a>
      </Button>
    </div>
  );
}
