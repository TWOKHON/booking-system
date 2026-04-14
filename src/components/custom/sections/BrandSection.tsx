import { BRANDS } from "@/constants";
import Image from "next/image";

export function BrandSection() {
  return (
    <section className="py-40">
      <div className="text-center text-lg">
        <h3 className="font-semibold">
          Powered by technologies shaping modern systems.
        </h3>
        <p className="text-muted-foreground">
          From idea to production, all working together.
        </p>
      </div>
      <div className="mt-10 grid items-center lg:grid-cols-6 gap-10">
        {BRANDS.map((brand) => (
          <div className="relative size-30" key={brand.alt}>
            <Image
              src={brand.src}
              alt={brand.alt}
              className="object-contain size-full"
              fill
            />
          </div>
        ))}
      </div>
      <div className="mt-30 text-center">
        <p className="text-muted-foreground">Fragmented tools are outdated</p>
        <h3 className="font-bold text-3xl mt-2">
          No Central System? No Control.
        </h3>
        <div className="grid mt-20 place-items-center lg:grid-cols-3 gap-5">
          <div className="text-center border-r pr-15 flex flex-col items-center">
            <Image src="/icons/file.svg" alt="File" width={100} height={100} />
            <p className="font-semibold text-sm mb-2 mt-5">
              Data is everywhere, but nowhere unified
            </p>
            <p className="text-sm text-muted-foreground">
              Insights are lost and decisions become harder
            </p>
          </div>
          <div className="text-center border-r pr-10 flex flex-col items-center">
            <Image src="/icons/chat.svg" alt="Chat" width={100} height={100} />
            <p className="font-semibold text-sm mb-2 mt-5">
              Customer experience suffers
            </p>
            <p className="text-sm text-muted-foreground">
              Slow coordination impact guest satisfaction
            </p>
          </div>
          <div className="text-center flex flex-col items-center">
            <Image
              src="/icons/settings.svg"
              alt="Settings"
              width={100}
              height={100}
            />
            <p className="font-semibold text-sm mb-2 mt-5">
              Operations become inconsistent
            </p>
            <p className="text-sm text-muted-foreground">
              Multiple systems lead to disconnected workflows
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
