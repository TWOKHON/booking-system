export const Heading = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="space-y-2">
      <h1 className="font-bold text-2xl tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};
