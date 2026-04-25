import { TuroInsightCard } from "../../dashboard/_components/TuroInsightCard";
import { amenitiesRecords } from "./_components/amenities-data";
import { AmenitiesSummary } from "./_components/amenities-summary";
import { AmenitiesTable } from "./_components/amenities-table";

const insights =
  "Amenity operations are mostly stable today, but 3 guest-facing facilities are still limited or offline and 2 peak-hour bookings need staffing clearance before release.";

const Page = () => {
  return (
    <div className="space-y-6">
      <TuroInsightCard message={insights} />

      <AmenitiesSummary data={amenitiesRecords} />
      <AmenitiesTable />
    </div>
  );
};

export default Page;
