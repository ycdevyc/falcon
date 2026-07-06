"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCurrentDriver, type CurrentDriver } from "@/lib/driver";
import { supabase } from "@/lib/supabase";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Vehicle = {
  id: string;
  name: string;
  capacity: number | null;
};

export default function DriverProfilePage() {
  const [driver, setDriver] = useState<CurrentDriver | null>(null);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    setLoading(true);

    try {
      const currentDriver = await getCurrentDriver();
      setDriver(currentDriver);

      if (currentDriver?.vehicle_id) {
        const { data } = await supabase
          .from("vehicles")
          .select("*")
          .eq("id", currentDriver.vehicle_id)
          .single();

        setVehicle(data || null);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/driver/login";
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        Loading profile...
      </Card>
    );
  }

  if (!driver) {
    return (
      <Card className="p-4 space-y-3">
        <p className="font-semibold">Not logged in as driver</p>
        <p className="text-sm text-muted-foreground">
          Please log in to view your profile.
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
          Profile
        </h2>

        <p className="text-sm text-muted-foreground">
          Your Falcon driver account.
        </p>
      </div>

      <Card className="p-4 space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Driver</p>
          <p className="font-semibold">{driver.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-semibold">{driver.phone || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Languages</p>
          <p className="font-semibold">{driver.languages || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Rating</p>
          <p className="font-semibold">
            ⭐ {driver.rating ?? "5.0"}
          </p>
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Vehicle</p>
          <p className="font-semibold">
            {vehicle?.name || "No vehicle linked"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Capacity</p>
          <p className="font-semibold">
            {vehicle?.capacity ? `${vehicle.capacity} passengers` : "-"}
          </p>
        </div>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={logout}
      >
        Log out
      </Button>
    </div>
  );
}