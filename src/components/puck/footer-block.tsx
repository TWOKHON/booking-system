type FooterLink = { label: string; url: string };
type FooterColumn = { heading: string; links: FooterLink[] };

type FooterBlockProps = {
  logo: string;
  tagline: string;
  address: string;
  legalLinks: FooterLink[];
  copyright: string;
  columns: FooterColumn[];
};

export function FooterBlock({
  logo,
  tagline,
  address,
  legalLinks,
  copyright,
  columns,
}: FooterBlockProps) {
  const SmartLink = ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => {
    // In preview mode, we want to intercept links that are likely internal paths
    if (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/preview")
    ) {
      const isInternal = href.startsWith("/") && !href.startsWith("//");
      if (isInternal) {
        return (
          <a
            href={`/preview?path=${encodeURIComponent(href)}`}
            className={className}
          >
            {children}
          </a>
        );
      }
    }

    return (
      <a href={href || "#"} className={className}>
        {children}
      </a>
    );
  };

  return (
    <footer className="bg-background text-foreground px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-[auto_1fr] gap-16 mb-10">
          {/* Left: brand */}
          <div className="max-w-xs">
            <p className="text-2xl font-bold mb-2">{logo}</p>
            <p className="text-muted-foreground text-sm mb-6">{tagline}</p>
            {address && (
              <p className="text-muted-foreground text-xs whitespace-pre-line mb-4">
                {address}
              </p>
            )}
            {legalLinks && legalLinks.length > 0 && (
              <div className="flex flex-col gap-1">
                {legalLinks.map((link, i) => (
                  <SmartLink
                    key={i}
                    href={link.url}
                    className="text-muted-foreground text-xs hover:text-foreground"
                  >
                    {link.label}
                  </SmartLink>
                ))}
              </div>
            )}
            {copyright && (
              <p className="text-muted-foreground/80 text-xs mt-4">
                {copyright}
              </p>
            )}
          </div>

          {/* Right: columns */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-8">
            {columns?.map((col, i) => (
              <div key={i}>
                <p className="text-sm font-semibold mb-4">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links?.map((link, j) => (
                    <li key={j}>
                      <SmartLink
                        href={link.url}
                        className="text-muted-foreground text-sm hover:text-foreground"
                      >
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}