import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Falcon Admin</h1>

        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <p className="font-semibold text-red-700">
            Error loading bookings
          </p>

          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold mb-2">
          Falcon Admin
        </h1>

        <p className="text-muted-foreground mb-8">
          Ride requests
        </p>

        <div className="overflow-hidden rounded-xl border">

          <table className="w-full">

            <thead className="bg-muted">
              <tr>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Vehicle</th>
                <th className="p-4 text-left">Flight</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Created</th>
              </tr>
            </thead>

            <tbody>

              {bookings?.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {booking.status}
                  </td>

                  <td className="p-4">
                    <div className="font-medium">
                      {booking.customer_name}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {booking.phone}
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {booking.email}
                    </div>
                  </td>

                  <td className="p-4">
                    {booking.vehicle}
                  </td>

                  <td className="p-4">
                    {booking.flight_number || "-"}
                  </td>

                  <td className="p-4">
                    €{booking.total_price}
                  </td>

                  <td className="p-4 text-sm">
                    {new Date(
                      booking.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}