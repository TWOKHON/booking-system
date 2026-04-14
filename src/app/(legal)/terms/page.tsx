import { LegalDocumentView } from "../_components/LegalDocumentView";
import { getTermsDocument } from "@/data/legal";

export default async function Page() {
  const document = await getTermsDocument();

  return <LegalDocumentView document={document} />;
}
