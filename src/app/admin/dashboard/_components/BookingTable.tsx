
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreditCard } from "lucide-react";

const bookings = [
  {
    name: "John Doe",
    email: "john@email.com",
    resort: "Sunset Resort",
    amount: "₱3,200",
    status: "Paid",
  },
  {
    name: "Maria Clara",
    email: "maria@email.com",
    resort: "Ocean View",
    amount: "₱5,500",
    status: "Pending",
  },
];

export const BookingTable = () => {
  return (
    <div className="rounded-2xl border bg-white dark:bg-neutral-900 p-6">
      <h2 className="font-semibold text-lg mb-4">Recent Bookings</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground">
            <tr>
              <th className="py-2">Guest</th>
              <th>Resort</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {bookings.map((b, i) => (
              <tr key={i}>
                <td className="py-3 flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {b.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {b.email}
                    </p>
                  </div>
                </td>

                <td>{b.resort}</td>
                <td>{b.amount}</td>

                <td>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      b.status === "Paid"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                <td>
                  <CreditCard className="w-4 h-4 opacity-70" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};