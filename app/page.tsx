import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">
            Falcon Transfers
          </h1>

          <p className="text-muted-foreground text-lg">
            Airport transfer dispatch system
          </p>
        </div>

        {/* CTA */}
        <Card className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">
            Book a transfer in seconds
          </h2>

          <p className="text-muted-foreground">
            Get instant pricing and send a ride request to our dispatch system.
          </p>

          <Link href="/search">
            <Button className="w-full sm:w-auto">
              Start booking
            </Button>
          </Link>
        </Card>

        {/* Status / concept */}
        <div className="grid md:grid-cols-3 gap-4">

          <Card className="p-4 space-y-2">
            <p className="font-semibold">Ride Requests</p>
            <p className="text-sm text-muted-foreground">
              Customers submit transfer requests
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <p className="font-semibold">Dispatch System</p>
            <p className="text-sm text-muted-foreground">
              Admin assigns rides to vehicles/drivers
            </p>
          </Card>

          <Card className="p-4 space-y-2">
            <p className="font-semibold">Real-time Control</p>
            <p className="text-sm text-muted-foreground">
              Track and manage all rides centrally
            </p>
          </Card>

        </div>

        {/* Admin link */}
        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="font-semibold">
              Admin Dashboard
            </p>

            <p className="text-sm text-muted-foreground">
              Manage all ride requests
            </p>
          </div>

          <Link href="/admin">
            <Button variant="outline">
              Open admin
            </Button>
          </Link>
        </Card>

      </div>
    </div>
  );
}