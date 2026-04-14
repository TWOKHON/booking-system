import type { ReactNode } from "react";

import { LegalShell } from "./_components/LegalShell";

export default function Layout({ children }: { children: ReactNode }) {
  return <LegalShell>{children}</LegalShell>;
}
