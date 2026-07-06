"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { supabase } from "@/lib/supabase";

export default function BookPage() {
  const searchParams = useSearchParams();

  const vehicle = searchParams.get("vehicle") || "Unknown vehicle";
  const price = Number(searchParams.get("price") || "0");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [loading, setLoading] = useState(false);

  async function createRideRequest() {
    setLoading(true);

    console.log("🚀 INSERT TARGET = ride_requests");

    const payload = {
      customer_name: customerName,
      phone,
      email,
      flight_number: flightNumber,
      pickup_location: "Antalya Airport",
      dropoff_location: "Hotel",
      vehicle_id: null,
      status: "pending",
    };

    console.log("📦 payload:", payload);

    const { data, error, status, statusText } = await supabase
      .from("ride_requests")   // 🔥 HARD FIX: ONLY THIS TABLE
      .insert(payload)
      .select();

    console.log("📡 response:", {
      data,
      error,
      status,
      statusText,
    });

    setLoading(false);

    if (error) {
      alert("ERROR: " + error.message);
      return;
    }

    alert("✅ Ride request saved in NEW system!");

    setCustomerName("");
    setPhone("");
    setEmail("");
    setFlightNumber("");
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Complete your ride request
          </h1>

          <p className="text-muted-foreground">
            {vehicle} • €{price}
          </p>
        </div>

        <Card className="p-4 space-y-4">
          <Input
            placeholder="Full name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <Input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Flight number"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
          />

          <Button
            className="w-full"
            disabled={loading}
            onClick={createRideRequest}
          >
            {loading ? "Saving..." : "Confirm Ride Request"}
          </Button>
        </Card>

      </div>
    </div>
  );
}