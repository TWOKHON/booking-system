"use client";

import { useEffect, useState } from "react";
import { Render, type Data } from "@puckeditor/core";
import { usePathname } from "next/navigation";
import { config } from "../site-builder/_lib/puck/puck-config";
import { PUCK_PREVIEW_STORAGE_KEY } from "../site-builder/_lib/puck/puck-storage";

const emptyData: Data = { content: [], root: { theme: "" } };

type PageData = Record<string, Data>;

function readPreviewData(): PageData | Data {
  if (typeof window === "undefined") return { "/": emptyData };
  const stored = window.localStorage.getItem(PUCK_PREVIEW_STORAGE_KEY);

  if (!stored) {
    return { "/": emptyData };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { "/": emptyData };
  }
}

export default function PreviewPage() {
  const [pages, setPages] = useState<PageData | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const data = readPreviewData();
    if (data && "content" in data) {
      setPages({ "/": data as Data });
    } else {
      setPages(data as PageData);
    }
  }, []);

  if (!pages) {
    return null;
  }

  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const requestedPath = searchParams.get("path") || "/";

  const pageData = pages[requestedPath] || pages["/"] || emptyData;

  return (
    <div data-puck-preview>
      <Render config={config} data={pageData} />
    </div>
  );
}
