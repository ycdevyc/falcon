"use client";

import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DriverDashboardPage() {
  const currentHour = new Date().getHours();

  let greeting = "Good evening";

  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 18) {
    greeting = "Good afternoon";
  }

  return (
    <div className="space-y-6">

      {/* Greeting */}
      <div>
        <h2 className="text-2xl font-bold">
          {greeting}
        </h2>

        <p className="text-muted-foreground">
          Welcome back to Falcon Driver
        </p>
      </div>

      {/* Driver Status */}
      <Card className="p-5">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-muted-foreground">
              Driver status
            </p>

            <h3 className="text-xl font-semibold text-green-600">
              ● Available
            </h3>
          </div>

          <Button variant="outline">
            Go Offline
          </Button>

        </div>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-3">

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">
            0
          </p>

          <p className="text-xs text-muted-foreground">
            Today's rides
          </p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">
            0
          </p>

          <p className="text-xs text-muted-foreground">
            Pending offers
          </p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">
            0
          </p>

          <p className="text-xs text-muted-foreground">
            Completed
          </p>
        </Card>

      </div>

      {/* Active Ride */}
      <Card className="p-5">

        <h3 className="font-semibold mb-2">
          Active Ride
        </h3>

        <p className="text-muted-foreground text-sm">
          You don't have an active ride yet.
        </p>

      </Card>

      {/* Quick Action */}
      <Card className="p-5 space-y-4">

        <div>
          <h3 className="font-semibold">
            Ready for your next ride?
          </h3>

          <p className="text-sm text-muted-foreground">
            Browse available airport transfers and send an offer.
          </p>
        </div>

        <Link href="/driver/rides" className="block">
          <Button className="w-full">
            View Available Rides
          </Button>
        </Link>

      </Card>

    </div>
  );
}