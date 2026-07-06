import { supabase } from "@/lib/supabase";

export async function createRideRequest(data: {
  customer_name: string;
  phone: string;
  email: string;
  pickup_location?: string;
  dropoff_location?: string;
  flight_number?: string;
  vehicle_id?: string;
}) {
  return await supabase.from("ride_requests").insert({
    ...data,
    status: "pending",
  });
}

export async function getRideRequests() {
  return await supabase
    .from("ride_requests")
    .select("*")
    .order("created_at", { ascending: false });
}