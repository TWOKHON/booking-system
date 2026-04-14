import type { LegalDocument } from "@/data/legal";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <main className="mx-auto w-full max-w-420 px-6 pb-8 md:px-8">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-10">
        <div className="max-w-5xl">
          <h1 className="mt-6 text-4xl font-black text-white">
            {document.title}
          </h1>
          <p className="mt-4 text-sm text-white/55">
            Effective date: {document.effectiveDate}
          </p>
        </div>

        <div className="mt-10 max-w-6xl space-y-8 tex-base text-white/92">
          {document.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-18 space-y-14">
          {document.sections.map((section) => (
            <section key={section.title} className="max-w-6xl">
              <h2 className="text-2xl font-semibold text-white">
                {section.title}
              </h2>
              {section.paragraphs ? (
                <div className="mt-5 space-y-7 text-base text-white/88">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : null}
              {section.bullets ? (
                <ul className="mt-5 space-y-4 text-base text-white/88">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-4">
                      <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <section className="mt-20 max-w-6xl">
          <h2 className="text-2xl font-semibold text-white">
            {document.contactTitle}
          </h2>
          <p className="mt-8 text-base text-white/88">
            {document.contactBody}
          </p>
          <a
            href={`mailto:${document.contactEmail}`}
            className="mt-3 inline-block text-base font-semibold text-white underline underline-offset-4"
          >
            {document.contactEmail}
          </a>
        </section>
      </div>
    </main>
  );
}
