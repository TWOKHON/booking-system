import { WorkflowEditor } from "@/components/custom/workflows/WorkflowEditor";

type WorkflowPageProps = {
  params: Promise<{ workflowId: string }>;
};

const Page = async ({ params }: WorkflowPageProps) => {
  const { workflowId } = await params;

  return (
    <main className="flex-1">
      <WorkflowEditor workflowId={workflowId} />
    </main>
  );
};

export default Page;
