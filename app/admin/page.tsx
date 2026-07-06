"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

type RideRequest = {
  id: string;
  customer_name: string;
  status: string;
  vehicle_id: string | null;
  driver_id: string | null;
  passengers: number;
  scheduled_at: string | null;
  created_at: string;
};

type Vehicle = {
  id: string;
  name: string;
  capacity: number;
  status: string;
  available: boolean;
};

type Driver = {
  id: string;
  name: string;
};

export default function AdminPage() {
  const [rides, setRides] = useState<RideRequest[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  async function fetchRides() {
    const { data } = await supabase
      .from("ride_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setRides(data || []);
  }

  async function fetchVehicles() {
    const { data } = await supabase
      .from("vehicles")
      .select("*");

    setVehicles(data || []);
  }

  async function fetchDrivers() {
    const { data } = await supabase
      .from("drivers")
      .select("*");

    setDrivers(data || []);
  }

  useEffect(() => {
    fetchRides();
    fetchVehicles();
    fetchDrivers();
  }, []);

  // ⏱️ SIMPLE ETA MODEL
  function calculateETA(ride: RideRequest, vehicle: Vehicle | undefined) {
    const base = 10; // base minutes

    const passengerFactor = Math.ceil(ride.passengers / 2);
    const vehicleFactor = vehicle ? Math.max(1, vehicle.capacity / 4) : 1;

    return Math.round(base + passengerFactor * vehicleFactor);
  }

  // 📊 PRIORITY SCORE (higher = more urgent)
  function getPriorityScore(ride: RideRequest) {
    const ageMinutes =
      (Date.now() - new Date(ride.created_at).getTime()) / 60000;

    const passengerWeight = ride.passengers * 2;

    return ageMinutes + passengerWeight;
  }

  // 🧠 SMART SORTED QUEUE
  const sortedUnassigned = rides
    .filter((r) => r.status === "pending")
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

  async function autoAssign(ride: RideRequest) {
    const vehicle = vehicles.find(
      (v) => v.status === "idle" && v.capacity >= ride.passengers
    );

    const driver = drivers[0];

    if (!vehicle || !driver) {
      alert("No resources available");
      return;
    }

    const eta = calculateETA(ride, vehicle);

    await supabase
      .from("ride_requests")
      .update({
        vehicle_id: vehicle.id,
        driver_id: driver.id,
        status: "assigned",
        scheduled_at: new Date().toISOString(),
      })
      .eq("id", ride.id);

    await supabase
      .from("vehicles")
      .update({ status: "busy" })
      .eq("id", vehicle.id);

    alert(`Assigned! ETA ~ ${eta} min`);

    fetchRides();
    fetchVehicles();
  }

  const active = rides.filter((r) => r.status === "assigned");
  const completed = rides.filter((r) => r.status === "completed");

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-10">

        <h1 className="text-3xl font-bold">
          Dispatch Intelligence v8 — Predictive Layer
        </h1>

        {/* UNASSIGNED (SMART ORDERED) */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-yellow-600">
            🟡 Priority Queue
          </h2>

          {sortedUnassigned.map((ride) => (
            <Card key={ride.id} className="p-4 space-y-2">

              <p className="font-semibold">
                {ride.customer_name}
              </p>

              <p className="text-sm text-muted-foreground">
                👥 {ride.passengers} passengers
              </p>

              <p className="text-sm text-muted-foreground">
                📊 Priority: {getPriorityScore(ride).toFixed(1)}
              </p>

              <Button onClick={() => autoAssign(ride)}>
                ⚡ Assign (ETA aware)
              </Button>

            </Card>
          ))}
        </section>

        {/* ACTIVE */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-blue-600">
            🚗 Active
          </h2>

          {active.map((ride) => (
            <Card key={ride.id} className="p-4">
              <p className="font-semibold">{ride.customer_name}</p>
              <p className="text-sm text-muted-foreground">
                Status: {ride.status}
              </p>
            </Card>
          ))}
        </section>

        {/* COMPLETED */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-green-600">
            ✅ Completed
          </h2>

          {completed.map((ride) => (
            <Card key={ride.id} className="p-4">
              <p className="font-semibold">{ride.customer_name}</p>
            </Card>
          ))}
        </section>

      </div>
    </div>
  );
}