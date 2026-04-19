import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Clock3, CreditCard } from "lucide-react";

type PaymentState = "50% paid" | "Awaiting proof" | "Fully paid" | "Balance due";
type ReservationStatus = "Confirmed" | "Pending" | "Checked in";

const bookings: {
  name: string;
  email: string;
  villa: string;
  stay: string;
  channel: string;
  amount: string;
  payment: PaymentState;
  status: ReservationStatus;
}[] = [
  {
    name: "Andrea Santos",
    email: "andrea.santos@email.com",
    villa: "Family Villa 2",
    stay: "Apr 21 - Apr 23",
    channel: "Direct Website",
    amount: "P12,400",
    payment: "50% paid",
    status: "Confirmed",
  },
  {
    name: "Michael Reyes",
    email: "michael.reyes@email.com",
    villa: "Casita 8",
    stay: "Apr 19 - Apr 20",
    channel: "Facebook Inquiry",
    amount: "P5,800",
    payment: "Awaiting proof",
    status: "Pending",
  },
  {
    name: "Claire Dizon",
    email: "claire.dizon@email.com",
    villa: "Garden Suite 4",
    stay: "Apr 20 - Apr 22",
    channel: "OTA Partner",
    amount: "P8,950",
    payment: "Fully paid",
    status: "Checked in",
  },
  {
    name: "Paolo Navarro",
    email: "paolo.navarro@email.com",
    villa: "Pool Villa 1",
    stay: "Apr 25 - Apr 27",
    channel: "Sales Team",
    amount: "P16,200",
    payment: "Balance due",
    status: "Confirmed",
  },
];

const statusClasses: Record<ReservationStatus, string> = {
  Confirmed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  "Checked in": "bg-blue-100 text-blue-700",
};

const paymentIcons: Record<PaymentState, typeof CreditCard> = {
  "50% paid": CreditCard,
  "Awaiting proof": Clock3,
  "Fully paid": BadgeCheck,
  "Balance due": CreditCard,
};

export const BookingTable = () => {
  return (
    <div className="border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Recent Reservations</h2>
          <p className="text-sm text-muted-foreground">
            Live bookings with stay dates, sales channel, and payment checkpoints.
          </p>
        </div>
        <div className="bg-neutral-100 px-3 py-1 text-xs text-muted-foreground dark:bg-neutral-800">
          4 high-priority bookings
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-195 text-sm">
          <thead className="text-left text-muted-foreground">
            <tr className="border-b">
              <th className="py-3 pr-4 font-medium">Guest</th>
              <th className="py-3 pr-4 font-medium">Stay</th>
              <th className="py-3 pr-4 font-medium">Unit</th>
              <th className="py-3 pr-4 font-medium">Channel</th>
              <th className="py-3 pr-4 font-medium">Amount</th>
              <th className="py-3 pr-4 font-medium">Payment</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {bookings.map((booking) => {
              const PaymentIcon = paymentIcons[booking.payment];

              return (
                <tr key={`${booking.name}-${booking.villa}`}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{booking.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <p className="font-medium">{booking.name}</p>
                        <p className="text-xs text-muted-foreground">{booking.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 pr-4">
                    <p className="font-medium">{booking.stay}</p>
                    <p className="text-xs text-muted-foreground">2 nights stay</p>
                  </td>

                  <td className="py-4 pr-4">{booking.villa}</td>
                  <td className="py-4 pr-4">{booking.channel}</td>
                  <td className="py-4 pr-4 font-medium">{booking.amount}</td>

                  <td className="py-4 pr-4">
                    <Badge variant="outline">
                      <PaymentIcon className="h-3.5 w-3.5" />
                      {booking.payment}
                    </Badge>
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-medium ${statusClasses[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
