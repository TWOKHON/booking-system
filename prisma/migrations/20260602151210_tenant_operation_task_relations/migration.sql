-- AlterTable
ALTER TABLE "tenant_operation_task" ADD COLUMN     "employeeId" TEXT,
ADD COLUMN     "roomId" TEXT;

-- CreateIndex
CREATE INDEX "tenant_operation_task_roomId_idx" ON "tenant_operation_task"("roomId");

-- CreateIndex
CREATE INDEX "tenant_operation_task_employeeId_idx" ON "tenant_operation_task"("employeeId");

-- AddForeignKey
ALTER TABLE "tenant_operation_task" ADD CONSTRAINT "tenant_operation_task_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "tenant_room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_operation_task" ADD CONSTRAINT "tenant_operation_task_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "tenant_employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
