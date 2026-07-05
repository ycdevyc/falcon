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

  async function createBooking() {
    console.log("🚀 Confirm booking clicked");

    if (!customerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("bookings")
        .insert({
          customer_name: customerName,
          phone,
          email,
          flight_number: flightNumber,
          vehicle,
          total_price: price,
          status: "pending",
        });

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      alert("✅ Booking successfully created!");

      // Form leegmaken
      setCustomerName("");
      setPhone("");
      setEmail("");
      setFlightNumber("");

    } catch (err) {
      console.error(err);
      alert("Unexpected error. Check the browser console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-xl space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Complete your booking
          </h1>

          <p className="text-muted-foreground mt-2">
            {vehicle} • €{price}
          </p>
        </div>

        <Card className="p-6 space-y-4">

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
            placeholder="Email address"
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
            onClick={createBooking}
          >
            {loading ? "Saving..." : "Confirm booking"}
          </Button>

        </Card>

      </div>
    </div>
  );
}