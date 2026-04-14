import { LegalDocumentView } from "../_components/LegalDocumentView";
import { getPrivacyDocument } from "@/data/legal";

export default async function Page() {
  const document = await getPrivacyDocument();

  return <LegalDocumentView document={document} />;
}
