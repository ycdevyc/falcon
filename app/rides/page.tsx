"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Ride = {
  id: string;
  customer_name: string;
  pickup_location: string;
  dropoff_location: string;
  status: string;
  created_at: string;
};

function getStatusLabel(status: string) {
  if (status === "pending") return "Trip requested";
  if (status === "open") return "Waiting for drivers";
  if (status === "offered") return "Drivers responding";
  if (status === "confirmed") return "Driver confirmed";
  if (status === "completed") return "Completed";
  return status;
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchRides() {
    setLoading(true);

    const { data, error } = await supabase
      .from("ride_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setRides(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Trips</h1>
          <p className="text-muted-foreground text-sm">
            Track your transfer requests and driver proposals.
          </p>
        </div>

        {loading && (
          <p className="text-muted-foreground">Loading trips...</p>
        )}

        {!loading && rides.length === 0 && (
          <Card className="p-6 text-center space-y-4">
            <p className="text-muted-foreground">
              No trips yet.
            </p>

            <Link href="/search">
              <Button>Book a Transfer</Button>
            </Link>
          </Card>
        )}

        <div className="space-y-4">
          {rides.map((ride) => (
            <Card key={ride.id} className="p-4 space-y-3">
              <div>
                <p className="font-semibold">
                  {ride.pickup_location || "Pickup"} →{" "}
                  {ride.dropoff_location || "Destination"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {ride.customer_name}
                </p>

                <p className="text-xs text-muted-foreground">
                  Status: {getStatusLabel(ride.status)}
                </p>
              </div>

              <Link href={`/rides/${ride.id}`}>
                <Button className="w-full">
                  View Trip
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}