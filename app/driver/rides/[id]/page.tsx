"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { getCurrentDriver, type CurrentDriver } from "@/lib/driver";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Ride = {
  id: string;
  customer_name: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  passengers: number | null;
  scheduled_at: string | null;
  eta_minutes: number | null;
  status: string | null;
};

export default function DriverTripDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [driver, setDriver] = useState<CurrentDriver | null>(null);
  const [ride, setRide] = useState<Ride | null>(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadPage() {
    setLoading(true);

    try {
      const currentDriver = await getCurrentDriver();
      setDriver(currentDriver);

      const { data: rideData, error: rideError } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (rideError) {
        throw new Error(rideError.message);
      }

      setRide(rideData || null);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadPage();
  }, [id]);

  async function submitProposal() {
    if (!ride || !driver) return;

    setSubmitting(true);

    const { error } = await supabase.from("ride_offers").insert({
      ride_id: ride.id,
      driver_id: driver.id,
      offered_price: Number(price),
      message: message || null,
      status: "pending",
    });

    if (error) {
      alert(error.message);
      setSubmitting(false);
      return;
    }

    await supabase
      .from("ride_requests")
      .update({ status: "offered" })
      .eq("id", ride.id)
      .in("status", ["pending", "open"]);

    setSubmitting(false);
    router.push("/driver/rides");
  }

  if (loading) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        Loading trip details...
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
      </Card>
    );
  }

  if (!ride) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        Trip not found.
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          Trip Details
        </h2>

        <p className="text-sm text-muted-foreground">
          Submit your proposal as {driver.name}.
        </p>
      </div>

      <Card className="p-4 space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Route</p>
          <p className="font-semibold">
            {ride.pickup_location || "Pickup"} →{" "}
            {ride.dropoff_location || "Destination"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Customer</p>
          <p className="font-semibold">
            {ride.customer_name || "Customer"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Passengers</p>
          <p className="font-semibold">
            {ride.passengers || 1}
          </p>
        </div>

        {ride.scheduled_at && (
          <div>
            <p className="text-sm text-muted-foreground">Pickup time</p>
            <p className="font-semibold">
              {new Date(ride.scheduled_at).toLocaleString()}
            </p>
          </div>
        )}
      </Card>

      <Card className="p-4 space-y-4">
        <div>
          <p className="font-semibold mb-2">Your price</p>
          <Input
            type="number"
            placeholder="Example: 45"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div>
          <p className="font-semibold mb-2">Message</p>
          <Input
            placeholder="Example: I can pick you up at arrivals."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          disabled={submitting || !price}
          onClick={submitProposal}
        >
          {submitting ? "Sending proposal..." : "Submit Proposal"}
        </Button>
      </Card>
    </div>
  );
}