import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { RoomsSummary } from "./_components/rooms-summary";
import { roomRecords } from "./_components/rooms-data";
import { RoomsTable } from "./_components/rooms-table";

const insights =
  "Room inventory is mostly stable today, but 3 units still need cleaning or inspection and 2 high-priority rooms are blocked by maintenance risk.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <RoomsSummary data={roomRecords} />
      <RoomsTable />
    </div>
  );
};

export default Page;
