import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardBlockProps = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
};

export function CardBlock({ title, description, imageUrl, imageAlt, link }: CardBlockProps) {
  return (
    <a
      href={link || "#"}
      className="block rounded-xl outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="h-full gap-0 py-0! transition-shadow hover:shadow-md">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={imageAlt} className="aspect-[2/1] w-full object-cover" />
        )}
        <CardHeader className="pt-4">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </a>
  );
}
