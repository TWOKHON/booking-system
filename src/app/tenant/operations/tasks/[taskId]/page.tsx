import { TaskFormView } from "../_components/TaskFormView";

type PageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { taskId } = await params;

  return <TaskFormView taskId={taskId} />;
}
