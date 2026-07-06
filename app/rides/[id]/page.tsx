"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { TripTimeline } from "@/components/falcon/TripTimeline";
import type { TripStatus } from "@/lib/falcon/trip-status";

type Ride = {
  id: string;
  customer_name: string;
  pickup_location: string;
  dropoff_location: string;
  status: TripStatus;
  driver_id: string | null;
};

type Offer = {
  id: string;
  driver_id: string;
  status: string;
};

type Driver = {
  id: string;
  name: string;
  vehicle_id: string | null;
};

type Vehicle = {
  id: string;
  name: string;
};

export default function RideDetailPage() {
  const { id } = useParams();

  const [ride, setRide] = useState<Ride | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [drivers, setDrivers] = useState<Record<string, Driver>>({});
  const [vehicles, setVehicles] = useState<Record<string, Vehicle>>({});
  const [loading, setLoading] = useState(false);

  async function fetchAll() {
    const { data: rideData } = await supabase
      .from("ride_requests")
      .select("*")
      .eq("id", id)
      .single();

    setRide(rideData);

    const { data: offerData } = await supabase
      .from("ride_offers")
      .select("*")
      .eq("ride_id", id);

    const offers = offerData || [];
    setOffers(offers);

    if (!offers.length) return;

    const driverIds = offers.map((o) => o.driver_id);

    const { data: driverData } = await supabase
      .from("drivers")
      .select("*")
      .in("id", driverIds);

    const driverMap: Record<string, Driver> = {};
    driverData?.forEach((d) => {
      driverMap[d.id] = d;
    });

    setDrivers(driverMap);

    const vehicleIds = driverData
      ?.map((d) => d.vehicle_id)
      .filter(Boolean) as string[];

    if (vehicleIds?.length) {
      const { data: vehicleData } = await supabase
        .from("vehicles")
        .select("*")
        .in("id", vehicleIds);

      const vehicleMap: Record<string, Vehicle> = {};
      vehicleData?.forEach((v) => {
        vehicleMap[v.id] = v;
      });

      setVehicles(vehicleMap);
    }
  }

  useEffect(() => {
    fetchAll();
  }, [id]);

  async function selectDriver(driverId: string) {
    if (!ride) return;

    setLoading(true);

    const { data: rideCheck } = await supabase
      .from("ride_requests")
      .select("status")
      .eq("id", id)
      .single();

    if (
      rideCheck?.status !== "open" &&
      rideCheck?.status !== "offered"
    ) {
      alert("This trip is already confirmed.");
      setLoading(false);
      return;
    }

    await supabase
      .from("ride_requests")
      .update({
        driver_id: driverId,
        status: "confirmed",
      })
      .eq("id", id);

    await supabase
      .from("ride_offers")
      .update({ status: "accepted" })
      .eq("ride_id", id)
      .eq("driver_id", driverId);

    await supabase
      .from("ride_offers")
      .update({ status: "rejected" })
      .eq("ride_id", id)
      .neq("driver_id", driverId);

    setLoading(false);
    fetchAll();
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold">
            Trip Details
          </h1>

          <p className="text-sm text-muted-foreground">
            Compare available drivers and choose your transfer.
          </p>
        </div>

        {ride && (
          <>
            <Card className="p-4 space-y-2">
              <p className="font-semibold">
                {ride.customer_name}
              </p>

              <p className="text-sm text-muted-foreground">
                📍 {ride.pickup_location} → {ride.dropoff_location}
              </p>
            </Card>

            <Card className="p-4">
              <TripTimeline status={ride.status} />
            </Card>
          </>
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Driver Proposals
          </h2>

          {offers.length === 0 ? (
            <Card className="p-4 text-sm text-muted-foreground">
              Waiting for drivers to respond...
            </Card>
          ) : (
            offers.map((offer) => {
              const driver = drivers[offer.driver_id];
              const vehicle = driver?.vehicle_id
                ? vehicles[driver.vehicle_id]
                : null;

              const isAccepted = ride?.driver_id === driver?.id;

              return (
                <Card
                  key={offer.id}
                  className={`p-4 flex justify-between items-center transition ${
                    isAccepted ? "border-green-500 bg-green-50" : ""
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-semibold">
                      {driver?.name || "Driver"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      🚗 {vehicle?.name || "Vehicle unknown"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {isAccepted ? "Selected driver" : "Available proposal"}
                    </p>
                  </div>

                  <Button
                    disabled={loading || isAccepted || ride?.status === "confirmed"}
                    onClick={() => selectDriver(driver!.id)}
                  >
                    {isAccepted ? "Selected" : "Choose"}
                  </Button>
                </Card>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}