"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { getCurrentDriver, type CurrentDriver } from "@/lib/driver";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Ride = {
  id: string;
  customer_name: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  passengers: number | null;
  status: string | null;
  created_at: string | null;
};

type Offer = {
  id: string;
  ride_id: string;
  driver_id: string;
  status: string | null;
};

function getStatusLabel(status: string | null) {
  if (status === "pending") return "New trip";
  if (status === "open") return "Open";
  if (status === "offered") return "Drivers responding";
  if (status === "confirmed") return "Driver selected";
  return status || "Unknown";
}

export default function DriverRidesPage() {
  const [driver, setDriver] = useState<CurrentDriver | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);

    try {
      const currentDriver = await getCurrentDriver();
      setDriver(currentDriver);

      if (!currentDriver) {
        setLoading(false);
        return;
      }

      const { data: rideData, error: rideError } = await supabase
        .from("ride_requests")
        .select("*")
        .in("status", ["pending", "open", "offered"])
        .order("created_at", { ascending: false });

      if (rideError) {
        throw new Error(rideError.message);
      }

      setRides(rideData || []);

      const { data: offerData, error: offerError } = await supabase
        .from("ride_offers")
        .select("*")
        .eq("driver_id", currentDriver.id);

      if (offerError) {
        throw new Error(offerError.message);
      }

      setOffers(offerData || []);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("driver-rides-current-driver")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_requests",
        },
        () => {
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_offers",
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function hasSubmittedProposal(rideId: string) {
    return offers.some((offer) => offer.ride_id === rideId);
  }

  if (loading) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        Loading available trips...
      </Card>
    );
  }

  if (!driver) {
    return (
      <Card className="p-4 space-y-3">
        <p className="font-semibold">Not logged in as driver</p>
        <p className="text-sm text-muted-foreground">
          Please log in with a driver account.
        </p>

        <Link href="/driver/login">
          <Button className="w-full">
            Go to Driver Login
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Available Trips
        </h2>

        <p className="text-sm text-muted-foreground">
          Signed in as {driver.name}
        </p>
      </div>

      {rides.length === 0 && (
        <Card className="p-6 text-center text-muted-foreground">
          No available trips right now.
        </Card>
      )}

      <div className="space-y-4">
        {rides.map((ride) => {
          const alreadySubmitted = hasSubmittedProposal(ride.id);

          return (
            <Card key={ride.id} className="p-4 space-y-4">
              <div className="space-y-1">
                <p className="font-semibold">
                  {ride.pickup_location || "Pickup"} →{" "}
                  {ride.dropoff_location || "Destination"}
                </p>

                <p className="text-sm text-muted-foreground">
                  {ride.customer_name || "Customer"} •{" "}
                  {ride.passengers || 1} passengers
                </p>

                <p className="text-xs text-muted-foreground">
                  Status: {getStatusLabel(ride.status)}
                </p>

                {alreadySubmitted && (
                  <p className="text-xs text-blue-600 font-medium">
                    Proposal already submitted
                  </p>
                )}
              </div>

              <Link href={`/driver/rides/${ride.id}`}>
                <Button className="w-full" variant={alreadySubmitted ? "secondary" : "default"}>
                  {alreadySubmitted ? "View Proposal" : "View Trip Details"}
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}