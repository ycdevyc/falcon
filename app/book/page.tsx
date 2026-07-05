import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BookPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Complete your booking</h1>
          <p className="text-muted-foreground">
            Secure your airport transfer in seconds
          </p>
        </div>

        {/* Selected transfer */}
        <Card className="p-4 space-y-2">
          <p className="font-semibold">Mercedes Vito</p>
          <p className="text-sm text-muted-foreground">
            Antalya Airport → Hotel
          </p>
          <p className="font-bold">€45</p>
        </Card>

        {/* Customer form */}
        <Card className="p-4 space-y-4">

          <Input placeholder="Full name" />
          <Input placeholder="Phone number" />
          <Input placeholder="Email" />
          <Input placeholder="Flight number (optional)" />

          <Button className="w-full">
            Confirm Booking
          </Button>

        </Card>

      </div>
    </div>
  )
}