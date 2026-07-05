import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type Vehicle = {
  id: string;
  name: string;
  capacity: number;
  price: number;
  active: boolean;
};

export default async function SearchPage() {
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("active", true)
    .order("price", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            Available Transfers
          </h1>

          <div className="border rounded-lg p-4 bg-red-50">
            <p className="font-semibold text-red-600">
              Error loading vehicles
            </p>

            <p className="mt-2 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Available Transfers
          </h1>

          <p className="text-muted-foreground">
            Antalya Airport → Hotel
          </p>
        </div>

        <div className="space-y-4">

          {vehicles?.map((vehicle: Vehicle) => (
            <Card
              key={vehicle.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {vehicle.name}
                </p>

                <p className="text-sm text-muted-foreground">
                  Up to {vehicle.capacity} passengers • Private transfer
                </p>
              </div>

              <div className="text-right space-y-2">

                <p className="font-bold">
                  €{vehicle.price}
                </p>

                <Link
                  href={`/book?vehicle=${encodeURIComponent(
                    vehicle.name
                  )}&price=${vehicle.price}`}
                >
                  <Button>
                    Book
                  </Button>
                </Link>

              </div>
            </Card>
          ))}

        </div>

      </div>
    </div>
  );
}