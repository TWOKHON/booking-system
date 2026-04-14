/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  body: string;
  name: string;
  image: string;
};

export const ThreeDMarquee = ({
  testimonials,
  className,
}: {
  testimonials: Testimonial[];
  className?: string;
}) => {
  const chunkSize = Math.ceil(testimonials.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return testimonials.slice(start, start + chunkSize);
  });

  return (
    <div
      className={cn("mx-auto block h-full w-full overflow-hidden", className)}
    >
      <div className="flex size-full items-center justify-center">
        <div
          style={{
            transform:
              "rotateX(45deg) rotateY(0deg) rotateZ(-45deg) scale(0.8)",
            transformOrigin: "center center",
            width: "200%",
            height: "200%",
            marginTop: "10%",
          }}
          className="grid grid-cols-4 gap-6"
        >
          {chunks.map((subarray, colIndex) => (
            <motion.div
              animate={{ y: colIndex % 2 === 0 ? 80 : -80 }}
              transition={{
                duration: colIndex % 2 === 0 ? 10 : 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              key={colIndex + "marquee"}
              className="flex flex-col gap-6"
            >
              {/* Vertical line runs along the left edge of each column */}
              <GridLineVertical className="-left-4" offset="80px" />

              {subarray.map((testimonial, index) => (
                <div className="relative" key={index + testimonial.name}>
                  {/* Horizontal line runs above each card */}
                  <GridLineHorizontal className="-top-4" offset="20px" />
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-950/8"
                  >
                    <p className="mb-2 text-sm font-semibold text-gray-900 leading-snug">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <p className="mb-4 text-xs text-gray-500 leading-relaxed">
                      {testimonial.body}
                    </p>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {testimonial.name}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-(--height) w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "bg-size-[var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "mask-exclude",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-(--width)",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "bg-size-[var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),linear-gradient(black,black)]",
        "mask-exclude",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    />
  );
};
