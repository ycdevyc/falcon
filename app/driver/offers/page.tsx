"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Ride = {
  id: string;
  customer_name: string;
  pickup_location: string;
  dropoff_location: string;
  passengers: number;
  status: string;
  driver_id: string | null;
};

type Offer = {
  id: string;
  ride_id: string;
  driver_id: string;
  status: string;
};

const DRIVER_ID = "driver-1";

function getStatusColor(status: string) {
  switch (status) {
    case "accepted":
      return "text-blue-600";
    case "rejected":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

export default function DriverRidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchData() {
    const { data: rideData } = await supabase
      .from("ride_requests")
      .select("*")
      .in("status", ["open", "offered", "confirmed"])
      .order("created_at", { ascending: false });

    setRides(rideData || []);

    const { data: offerData } = await supabase
      .from("ride_offers")
      .select("*")
      .eq("driver_id", DRIVER_ID);

    setOffers(offerData || []);
  }

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("driver-ux-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_requests",
        },
        () => fetchData()
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_offers",
          filter: `driver_id=eq.${DRIVER_ID}`,
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function makeOffer(rideId: string) {
    setLoading(true);

    await supabase.from("ride_offers").insert({
      ride_id: rideId,
      driver_id: DRIVER_ID,
      status: "pending",
    });

    await supabase
      .from("ride_requests")
      .update({ status: "offered" })
      .eq("id", rideId)
      .eq("status", "open");

    setLoading(false);
    fetchData();
  }

  function getOfferStatus(rideId: string) {
    const offer = offers.find((o) => o.ride_id === rideId);

    if (!offer) return "none";
    return offer.status;
  }

  function getRideState(ride: Ride) {
    if (ride.status === "confirmed" && ride.driver_id === DRIVER_ID) {
      return "selected";
    }

    const offerStatus = getOfferStatus(ride.id);

    if (offerStatus === "pending") return "offered";
    if (offerStatus === "accepted") return "selected";

    return "available";
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Driver workspace
          </h1>
          <p className="text-muted-foreground text-sm">
            Live rides + offer tracking
          </p>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {rides.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">
              Waiting for new rides...
            </Card>
          )}

          {rides.map((ride) => {
            const state = getRideState(ride);

            return (
              <Card key={ride.id} className="p-4 space-y-3">

                {/* TOP */}
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">
                      {ride.pickup_location} → {ride.dropoff_location}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {ride.customer_name} • {ride.passengers} pax
                    </p>
                  </div>

                  <div className={`text-sm font-medium ${getStatusColor(state)}`}>
                    {state === "available" && "Available"}
                    {state === "offered" && "Offer sent"}
                    {state === "selected" && "You are selected"}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end">
                  {state === "available" && (
                    <Button
                      disabled={loading}
                      onClick={() => makeOffer(ride.id)}
                    >
                      Make offer
                    </Button>
                  )}

                  {state === "offered" && (
                    <Button disabled variant="secondary">
                      Offer sent
                    </Button>
                  )}

                  {state === "selected" && (
                    <Button className="bg-blue-600">
                      Start ride
                    </Button>
                  )}
                </div>

              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}