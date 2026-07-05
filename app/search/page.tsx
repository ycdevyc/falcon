import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      
      <div className="max-w-4xl mx-auto space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Available Transfers</h1>
          <p className="text-muted-foreground">
            Antalya Airport → Hotel
          </p>
        </div>

        {/* Results */}
        <div className="space-y-4">

          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">Mercedes Vito</p>
              <p className="text-sm text-muted-foreground">
                4 passengers • Private transfer
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className="font-bold">€45</p>
              
              <Link href="/book?vehicle=mercedes-vito&price=45">
                <Button>Book</Button>
              </Link>

            </div>
          </Card>

          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">Mercedes V-Class</p>
              <p className="text-sm text-muted-foreground">
                Luxury • 6 passengers
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className="font-bold">€65</p>

              <Link href="/book?vehicle=mercedes-v-class&price=65">
                <Button>Book</Button>
              </Link>

            </div>
          </Card>

          <Card className="p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">Minibus</p>
              <p className="text-sm text-muted-foreground">
                8–12 passengers
              </p>
            </div>
            <div className="text-right space-y-2">
              <p className="font-bold">€80</p>

              <Link href="/book?vehicle=minibus&price=80">
                <Button>Book</Button>
              </Link>

            </div>
          </Card>

        </div>

      </div>
    </div>
  )
}