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
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Complete your booking
          </h1>

          <p className="text-muted-foreground">
            Secure your airport transfer in seconds
          </p>
        </div>

        <Card className="p-4 space-y-2">
          <p className="font-semibold">{vehicle}</p>

          <p className="text-sm text-muted-foreground">
            Antalya Airport → Hotel
          </p>

          <p className="font-bold">€{price}</p>
        </Card>

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
            placeholder="Flight number (optional)"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
          />

          <Button
            className="w-full"
            disabled={loading}
            onClick={createBooking}
          >
            {loading ? "Saving..." : "Confirm Booking"}
          </Button>
        </Card>
      </div>
    </div>
  );
}