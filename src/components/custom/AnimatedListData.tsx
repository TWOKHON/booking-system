"use client"

import { cn } from "@/lib/utils"
import { AnimatedList } from "@/components/animated-ui/AnimatedList"

interface Item {
  name: string
  description: string
  icon: string
  color: string
  time: string
}

let notifications = [
  {
    name: "New booking confirmed",
    description: "Room 204 · April 10 - April 12",
    time: "15m ago",
    icon: "🏝️",
    color: "#00C9A7",
  },
  {
    name: "Payment received",
    description: "₱5,200 · Reservation #1023",
    time: "12m ago",
    icon: "💳",
    color: "#1E86FF",
  },
  {
    name: "Guest check-in",
    description: "John Dela Cruz · Villa 3",
    time: "10m ago",
    icon: "🛎️",
    color: "#FFB800",
  },
  {
    name: "New reservation request",
    description: "Pending approval · April 15",
    time: "8m ago",
    icon: "📅",
    color: "#FF3D71",
  },
  {
    name: "Room availability updated",
    description: "Cottage A is now available",
    time: "6m ago",
    icon: "🏠",
    color: "#845EF7",
  },
  {
    name: "Staff task assigned",
    description: "Cleaning scheduled · Room 101",
    time: "5m ago",
    icon: "🧹",
    color: "#00A8E8",
  },
  {
    name: "Guest request received",
    description: "Extra towels requested",
    time: "4m ago",
    icon: "📝",
    color: "#FF6B6B",
  },
  {
    name: "Checkout completed",
    description: "Villa 2 · Ready for cleaning",
    time: "3m ago",
    icon: "🚪",
    color: "#4CAF50",
  },
]

notifications = Array.from({ length: 10 }, () => notifications).flat()

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-100 cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center text-lg font-medium whitespace-pre dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  )
}

export function AnimatedListData({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative flex h-125 w-full flex-col overflow-hidden p-2",
        className
      )}
    >
      <AnimatedList>
        {notifications.map((item, idx) => (
          <Notification {...item} key={idx} />
        ))}
      </AnimatedList>

      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t"></div>
    </div>
  )
}