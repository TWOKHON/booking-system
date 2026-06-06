"use client";

import { useEffect, useState } from "react";
import { Render } from "@puckeditor/core";
import { config, type PuckData } from "../site-builder/_lib/puck/puck-config";
import { PUCK_PREVIEW_STORAGE_KEY } from "../site-builder/_lib/puck/puck-storage";

const emptyData: PuckData = { content: [], root: { props: { theme: "" } } };

type PageData = Record<string, PuckData>;

function readPreviewData(): PageData | PuckData {
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

  useEffect(() => {
    queueMicrotask(() => {
      const data = readPreviewData();
      if (data && "content" in data) {
        setPages({ "/": data as PuckData });
      } else {
        setPages(data as PageData);
      }
    });
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
